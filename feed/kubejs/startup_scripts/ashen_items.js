// Ashen Oath 1.0.0 · Minecraft 1.20.1 / KubeJS 2001
StartupEvents.registry("item", event => {
  event.create("memory_of_renewal").displayName("Memory of Renewal").texture("minecraft:item/amethyst_shard").maxStackSize(16);
  event.create("memory_archive").displayName("Memory Archive").texture("minecraft:item/book").maxStackSize(1);
  event.create("oath_shard").displayName("Oath Shard \u00b7 Summon The Oathless").texture("minecraft:item/prismarine_shard").maxStackSize(1);
  event.create("memory_1").displayName("Memory I \u00b7 The Dawnwarden").texture("minecraft:item/echo_shard").maxStackSize(1);
  event.create("memory_2").displayName("Memory II \u00b7 The Catastrophe").texture("minecraft:item/blaze_powder").maxStackSize(1);
  event.create("memory_3").displayName("Memory III \u00b7 The Evacuation").texture("minecraft:item/redstone").maxStackSize(1);
  event.create("memory_4").displayName("Memory IV \u00b7 The Sacrifice").texture("minecraft:item/ender_pearl").maxStackSize(1);
  event.create("memory_5").displayName("Memory V \u00b7 The Last Commander").texture("minecraft:item/nether_star").maxStackSize(1);
  event.create("wither_proof").displayName("Proof \u00b7 The Wither").texture("minecraft:item/nether_star").maxStackSize(1);
  event.create("dragon_proof").displayName("Proof \u00b7 The Ender Dragon").texture("minecraft:item/dragon_breath").maxStackSize(1);
  event.create("restored_oath").displayName("The Restored Oath").texture("minecraft:item/heart_of_the_sea").maxStackSize(1);
  event.create("dawnwarden_crest").displayName("Dawnwarden Crest").texture("minecraft:item/totem_of_undying").maxStackSize(1);
  event.create("trophy_oathless").displayName("Oathless Crest").texture("minecraft:item/prismarine_crystals").maxStackSize(16);
  event.create("trophy_monstrosity").displayName("Monstrosity Furnace Heart").texture("minecraft:item/magma_cream").maxStackSize(16);
  event.create("trophy_wither").displayName("Wither Crown").texture("minecraft:item/nether_star").maxStackSize(16);
  event.create("trophy_harbinger").displayName("Harbinger Control Core").texture("minecraft:item/comparator").maxStackSize(16);
  event.create("trophy_dragon").displayName("Dragon Soul Scale").texture("minecraft:item/dragon_breath").maxStackSize(16);
  event.create("trophy_guardian").displayName("Guardian Void Sigil").texture("minecraft:item/ender_eye").maxStackSize(16);
  event.create("trophy_ignis").displayName("Ignis Oathbrand").texture("minecraft:item/blaze_rod").maxStackSize(16);
});
