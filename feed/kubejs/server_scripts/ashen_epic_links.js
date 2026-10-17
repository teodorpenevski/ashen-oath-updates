// Native Epic Fight skills augment the tree; its attribute passives never need slots.
var AshenEFManager = Java.loadClass('yesman.epicfight.api.data.reloader.SkillManager');
var AshenEFNetwork = Java.loadClass('yesman.epicfight.network.EpicFightNetworkManager');
var AshenEFAdd = Java.loadClass('yesman.epicfight.network.server.SPAddLearnedSkill');
var AshenEFRemove = Java.loadClass('yesman.epicfight.network.server.SPRemoveSkillAndLearn');
var AshenEFSlots = Java.loadClass('yesman.epicfight.skill.SkillSlots');
var AshenGuardBridge = Java.loadClass('ashen.interop.AshenSkillBridge');

ServerEvents.loaded(event => event.server.runCommandSilent('gamerule skillReplaceCooldown 0'));

function ashenEpicPatch(player) {
  return AshenGuardBridge.getPatch(player);
}
function ashenEFSend(packet, player) {
  if (ashenNetworkPlayer(player)) AshenEFNetwork.sendToPlayer(packet, player);
}
function ashenSyncEpicSkills(player) {
  if (!ashenSkillsReady(player)) return;
  var patch = ashenEpicPatch(player);
  if (patch) {
    var containers = patch.getSkillCapability().skillContainers;
    for (var index=0; index<containers.length; index++) containers[index].setReplaceCooldown(0);
  }
  if (!patch) return;
  var capability = patch.getSkillCapability();
  var learned = ashenLearned(player);
  var links = global.ashenCombat.settings.epic_links;
  var defaults = global.ashenCombat.settings.epic_defaults;
  if (ashenStarterClass(player)) Object.keys(defaults).forEach(id => AshenGuardBridge.syncSkill(player, id, true, false));
  Object.keys(links).forEach(node => {
    var key = 'ashen_epic_owned_' + node;
    var owned = player.persistentData.getBoolean(key);
    var allocated = !!learned['ashen:' + node];
    if (defaults[links[node].skill]) {
      player.persistentData.putBoolean(key, false);
      return;
    }
    if (!allocated && !owned) return;
    player.persistentData.putBoolean(key, AshenGuardBridge.syncSkill(player, links[node].skill, allocated, owned));
  });
}
function ashenBlocking(player) {
  if (player.isBlocking()) return true;
  var patch = ashenEpicPatch(player);
  if (!patch) return false;
  var guard = patch.getSkillCapability().getSkillContainerFor(AshenEFSlots.GUARD);
  return guard != null && guard.isActivated();
}
