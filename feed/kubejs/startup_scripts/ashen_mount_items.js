// Team riding bonds; activation is validated server-side by AshenMountProgression.
StartupEvents.registry('item', event => {
  event.create('earthbound_oath').displayName('Earthbound Oath').texture('minecraft:item/lead').maxStackSize(1).tooltip('Explore 3 Overworld biomes, then right-click to unlock team ground riding.');
  event.create('skybound_oath').displayName('Skybound Oath').texture('minecraft:item/feather').maxStackSize(1).tooltip('After ground riding and a major boss victory, right-click to unlock team flying mounts.');
});
