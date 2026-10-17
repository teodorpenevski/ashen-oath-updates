// Native class selection is displayed on the client; the server owns the choice.
function ashenOpenClassPicker(player) {
  if (ashenStarterClass(player)) return false;
  if (ashenNetworkPlayer(player)) player.sendData('ashen_class_picker', {});
  return true;
}

ServerEvents.commandRegistry(event => {
  event.register(event.commands.literal('ashenclass').executes(context => {
    var player = context.source.getPlayerOrException();
    if (!ashenOpenClassPicker(player)) player.tell('Use a Memory of Renewal to change your selected class.');
    return 1;
  }));
});

// Reset the caller's Passive Skill Tree allocations; the mod refunds spent points.
ServerEvents.recipes(event => {
  event.shaped('kubejs:memory_of_renewal', ['PAP', 'ADA', 'PAP'], {
    P: 'minecraft:paper', A: 'minecraft:amethyst_shard', D: 'minecraft:diamond'
  }).id('ashen:memory_of_renewal');
});

ItemEvents.rightClicked('kubejs:memory_of_renewal', event => {
  if (event.level.isClientSide()) return;
  const player = event.player;
  const name = player.username;
  const pending = event.server.runCommandSilent('execute as ' + name + ' if entity @s[tag=ashen_class_change_pending]');
  if (pending > 0) {
    ashenOpenClassPicker(player);
    player.tell('Your class change is pending. Choose a class in the selection screen; no second Memory is consumed.');
    return;
  }
  // Minecraft's player command argument resolves names/selectors, not UUID strings.
  const result = event.server.runCommandSilent('skilltree reset ' + name);
  if (result > 0) {
    const marked = event.server.runCommandSilent('tag ' + name + ' add ashen_class_change_pending');
    const opened = ashenOpenClassPicker(player);
    if (marked > 0 && opened) {
      event.item.shrink(1);
      player.tell('Passive Skill Tree reset completed. Skill points were refunded; choose your starter identity or keep the same one. Each class starter kit can be claimed once.');
    } else {
      event.server.runCommandSilent('tag ' + name + ' remove ashen_class_change_pending');
      player.tell('Skill points were refunded, but the class menu did not open. The Memory was kept.');
    }
  } else {
    player.tell('The reset did not complete. The Memory of Renewal was kept.');
  }
});

PlayerEvents.loggedIn(event => {
  const player = event.player;
  const name = player.username;
  event.server.scheduleInTicks(20, () => {
    event.server.runCommandSilent('execute as ' + name + ' run function ashen:class/status');
    ashenOpenClassPicker(player);
  });
});
