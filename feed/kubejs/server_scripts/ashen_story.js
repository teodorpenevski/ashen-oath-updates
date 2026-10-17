// Server-wide campaign unlocks are persistent vanilla scoreboard state.
// All damage to locked story bosses is cancelled, including environmental damage.
const ASHEN_GATES = {
  "cataclysm:netherite_monstrosity": [
    "execute if score #chapter ashen_story matches 2..",
    "Complete every required Chapter 1 quest first."
  ],
  "minecraft:wither": [
    "execute if score #chapter ashen_story matches 3..",
    "Complete every required Chapter 2 quest first."
  ],
  "cataclysm:the_harbinger": [
    "execute if score #chapter ashen_story matches 3.. if score #wither ashen_story matches 1",
    "Complete the Chapter 3 Wither Crown quest first."
  ],
  "minecraft:ender_dragon": [
    "execute if score #chapter ashen_story matches 4..",
    "Complete every required Chapter 3 quest first."
  ],
  "cataclysm:ender_guardian": [
    "execute if score #chapter ashen_story matches 4.. if score #dragon ashen_story matches 1",
    "Complete the Chapter 4 Dragon Soul Scale quest first."
  ],
  "cataclysm:ignis": [
    "execute if score #chapter ashen_story matches 5..",
    "Complete every required Chapter 4 quest first."
  ]
};
EntityEvents.hurt(event => {
  const gate = ASHEN_GATES[String(event.entity.type)];
  if (!gate) return;
  if (event.server.runCommandSilent(gate[0]) !== 0) return;
  event.cancel();
  const player = event.source.player;
  if (player) {
    const now = event.entity.level.gameTime;
    const last = player.persistentData.getLong('ashen_gate_hint');
    if (now - last > 100 || last === 0) {
      player.persistentData.putLong('ashen_gate_hint', now);
      player.tell('The old seal holds. ' + gate[1]);
    }
  }
});
EntityEvents.death(event => {
  const gate = ASHEN_GATES[String(event.entity.type)];
  if (gate && event.server.runCommandSilent(gate[0]) === 0) {
    event.entity.health = 1;
    event.cancel();
    return;
  }
  // The Dragon uses its kill advancement instead; its special death sequence is
  // not a normal loot-table death. This avoids a duplicate drop and re-arms on kills.
  const type = String(event.entity.type);
  const trophies = {
    'cataclysm:netherite_monstrosity': 'kubejs:trophy_monstrosity',
    'minecraft:wither': 'kubejs:trophy_wither',
    'cataclysm:the_harbinger': 'kubejs:trophy_harbinger',
    'cataclysm:ender_guardian': 'kubejs:trophy_guardian',
    'cataclysm:ignis': 'kubejs:trophy_ignis'
  };
  let trophy = trophies[type];
  if (type === 'minecraft:husk' && event.entity.getTags().contains('ashen_oathless')) {
    trophy = 'kubejs:trophy_oathless';
  }
  if (!trophy || event.entity.persistentData.getBoolean('ashen_trophy_dropped')) return;
  const dimension = String(event.entity.level.dimension);
  const at = event.entity.x + ' ' + event.entity.y + ' ' + event.entity.z;
  const result = event.server.runCommandSilent('execute in ' + dimension + ' positioned ' + at +
    ' run summon minecraft:item ~ ~0.5 ~ {Item:{id:"' + trophy + '",Count:1b},PickupDelay:0s,Invulnerable:1b,Glowing:1b}');
  if (result > 0) event.entity.persistentData.putBoolean('ashen_trophy_dropped', true);
  else console.error('[ASHEN TROPHY] Failed to drop ' + trophy + ' for ' + type);
});
PlayerEvents.loggedIn(event => {
  event.server.runCommandSilent('execute as ' + event.player.uuid + ' run function ashen:recover');
  event.player.tell('Ashen Oath: open the quest book. Keep boss trophies in your inventory to complete their quests, then claim the story rewards. The archive recovers memories, never trophies.');
});
ItemEvents.rightClicked('kubejs:memory_archive', event => {
  if (event.level.isClientSide()) return;
  event.server.runCommandSilent('execute as ' + event.player.uuid + ' run function ashen:recover');
  event.server.runCommandSilent('execute as ' + event.player.uuid + ' run function ashen:status');
});
ItemEvents.rightClicked('kubejs:oath_shard', event => {
  if (event.level.isClientSide()) return;
  event.server.runCommandSilent('execute as ' + event.player.uuid + ' at @s run function ashen:trial');
});
ItemEvents.rightClicked('kubejs:restored_oath', event => {
  if (event.level.isClientSide()) return;
  event.server.runCommandSilent('execute as ' + event.player.uuid + ' at @s run function ashen:finish');
});
ServerEvents.loaded(event => {
  event.server.runCommandSilent('function ashen:load');
  // Fail visibly if a quest item was renamed or omitted from the installed set.
  const required = ["apotheosis:gem_cutting_table", "apotheosis:reforging_table", "apotheosis:salvaging_table", "apotheosis:simple_reforging_table", "explorerscompass:explorerscompass", "ironfurnaces:diamond_furnace", "ironfurnaces:iron_furnace", "ironfurnaces:netherite_furnace", "irons_spellbooks:common_ink", "irons_spellbooks:inscription_table", "irons_spellbooks:rare_ink", "irons_spellbooks:scroll_forge", "kubejs:dawnwarden_crest", "kubejs:dragon_proof", "kubejs:memory_1", "kubejs:memory_2", "kubejs:memory_3", "kubejs:memory_4", "kubejs:memory_5", "kubejs:restored_oath", "kubejs:wither_proof", "minecraft:blaze_rod", "minecraft:enchanting_table", "minecraft:ender_eye", "minecraft:iron_sword", "minecraft:obsidian", "minecraft:shield", "minecraft:wither_skeleton_skull", "refinedstorage:controller", "refinedstorage:crafter", "refinedstorage:crafting_grid", "refinedstorage:disk_drive", "refinedstorage:external_storage", "sophisticatedstorage:diamond_chest", "sophisticatedstorage:gold_chest", "sophisticatedstorage:iron_chest", "thermal:dynamo_stirling", "thermal:energy_cell", "thermal:machine_pulverizer", "thermal:machine_smelter"];
  required.forEach(id => {
    if (Item.of(id).isEmpty()) console.error('[ASHEN VALIDATION] Missing quest item: ' + id);
  });
  console.info('[ASHEN VALIDATION] Story scripts loaded; verify that no missing-item errors appear above.');
});
