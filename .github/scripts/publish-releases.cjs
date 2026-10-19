// All release bodies are versioned files; retries never create duplicates or move tags.
module.exports = async function publish({github, context, core, readFile = require('fs').readFileSync,
                                        pause = ms => new Promise(resolve => setTimeout(resolve, ms))}) {
  const index = JSON.parse(readFile('release-notes/index.json', 'utf8'));
  const base = {owner: context.repo.owner, repo: context.repo.repo};
  const versions = new Set();
  for (const row of index.releases) {
    if (!/^\d+\.\d+\.\d+$/.test(row.version) || row.tag !== `v${row.version}` ||
        row.notes !== `release-notes/${row.version}.md` || versions.has(row.version)) {
      throw new Error('Invalid or duplicate release metadata');
    }
    versions.add(row.version);
    // Tags are pushed by the local publisher using its existing Git credentials.
    // Refuse a missing tag rather than accidentally attaching an old version to HEAD.
    await github.rest.git.getRef({...base, ref: `tags/${row.tag}`});
    let body = readFile(row.notes, 'utf8').replace(/^# [^\n]+\n+/, '').trim();
    const commit = row.commit;
    if (commit) body += `\n\n[Original release snapshot](https://github.com/${base.owner}/${base.repo}/tree/${commit})`;
    if (row.previous_tag) body += `\n\n[Full changes](https://github.com/${base.owner}/${base.repo}/compare/${row.previous_tag}...${row.tag})`;
    const desired = {...base, name: row.name, body, draft: false, prerelease: false,
                     make_latest: row.version === index.current_version ? 'true' : 'false'};
    let existing;
    try { existing = (await github.rest.repos.getReleaseByTag({...base, tag: row.tag})).data; }
    catch (error) { if (error.status !== 404) throw error; }
    if (existing) {
      if (existing.name !== desired.name || existing.body !== body || existing.draft || existing.prerelease) {
        await github.rest.repos.updateRelease({...desired, release_id: existing.id});
        core.info(`Updated notes for ${row.tag}`);
      }
    } else {
      await github.rest.repos.createRelease({...desired, tag_name: row.tag, generate_release_notes: false});
      core.info(`Published ${row.tag}`);
      await pause(1100);
    }
  }
  if (!versions.has(index.current_version)) throw new Error('Current version has no notes');
};
