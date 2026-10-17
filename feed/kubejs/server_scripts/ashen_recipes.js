// Five recovered memories close the breach. No unrelated factory gate.
ServerEvents.recipes(event => {
  event.shapeless('kubejs:restored_oath', [
    'kubejs:memory_1','kubejs:memory_2','kubejs:memory_3',
    'kubejs:memory_4','kubejs:memory_5',
    'minecraft:amethyst_shard','minecraft:obsidian','minecraft:ender_eye'
  ]).id('kubejs:ashen/restored_oath');
  event.shapeless('kubejs:memory_archive', ['minecraft:book','minecraft:amethyst_shard'])
    .id('kubejs:ashen/memory_archive');
  event.shapeless('kubejs:oath_shard', ['minecraft:iron_ingot','minecraft:rotten_flesh','minecraft:amethyst_shard'])
    .id('kubejs:ashen/oath_shard');
});
