// KeyBindJS is client-only. Do not resolve its event group on a dedicated server.
if (Platform.isClientEnvironment()) {
  KeyBindEvents.register(event => {
    event.create('ashen_mage_blink', 'key.ashen.mage_blink', 90, 'key.categories.ashen');
    event.create('ashen_sheathe', 'key.ashen.sheathe', 89, 'key.categories.ashen');
    event.create('ashen_ammunition', 'key.ashen.ammunition', 91, 'key.categories.ashen');
    event.create('ashen_ranger_windrunner', 'key.ashen.ranger_windrunner', 88, 'key.categories.ashen');
    event.create('ashen_ranger_mark', 'key.ashen.ranger_mark', 67, 'key.categories.ashen');
    event.create('ashen_rogue_double_jump', 'key.ashen.rogue_double_jump', 86, 'key.categories.ashen');
    event.create('ashen_rogue_shadowstep', 'key.ashen.rogue_shadowstep', 66, 'key.categories.ashen');
  });
  KeyBindEvents.modify(event => {
    // The camera add-on defaults to O, which already opens Passive Skill Trees.
    event.modifyKey('key.ssrcamerafixes.shoulder_cycle', 72); // H
    ['mage_blink', 'ranger_windrunner', 'ranger_mark', 'rogue_double_jump', 'rogue_shadowstep'].forEach(id =>
      event.modifyModifier('key.ashen.' + id, KeyModifier.NONE));
  });
}
