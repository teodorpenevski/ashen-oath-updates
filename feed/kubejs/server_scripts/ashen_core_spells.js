// Level-ten class rewards use normal, reusable Iron's Spellbooks containers.
var AshenCoreContainers = Java.loadClass('io.redspace.ironsspellbooks.api.spells.ISpellContainer');
var AshenCoreRegistry = Java.loadClass('io.redspace.ironsspellbooks.api.registry.SpellRegistry');
var ASHEN_CORE_SPELLS = {
  warrior: {id: 'stomp', name: 'Stomp'},
  mage: {id: 'magic_missile', name: 'Magic Missile'},
  ranger: {id: 'poison_arrow', name: 'Poison Arrow'},
  rogue: {id: 'poison_splash', name: 'Poison Splash'}
};

function ashenCoreSpellBook(cls) {
  var definition = ASHEN_CORE_SPELLS[cls];
  if (!definition) return null;
  // Bypass getSpell(String/ResourceLocation): Rhino treats those overloads as ambiguous.
  var spell = AshenCoreRegistry.REGISTRY.get().getValue(new AshenResourceLocation('irons_spellbooks:' + definition.id));
  if (!spell || spell == AshenCoreRegistry.none() || !spell.isEnabled()) return null;
  var book = Item.of('irons_spellbooks:copper_spell_book');
  var container = AshenCoreContainers.create(1, true, true);
  if (!container.addSpell(spell, 1, false, book)) return null;
  return book;
}

function ashenUnlockCoreSpell(player) {
  if (!player.isAlive()) return false;
  var data = player.persistentData;
  // Remember the milestone even after spending XP, dying or changing class.
  if (player.experienceLevel >= 10) data.putBoolean('ashen_core_level10', true);
  if (!data.getBoolean('ashen_core_level10')) return false;
  var cls = ashenStarterClass(player);
  if (!Object.prototype.hasOwnProperty.call(ASHEN_CORE_SPELLS, cls)) return false;
  // Existing Rangers receive the replacement once; never overwrite crafted books.
  var claim = cls == 'ranger' ? 'ashen_core_poison_arrow_claimed' : 'ashen_core_spell_' + cls + '_claimed';
  if (data.getBoolean(claim)) return false;
  // Wait for inventory space instead of losing a unique reward on the ground.
  if (player.inventory.getFreeSlot() < 0) {
    if (!data.getBoolean('ashen_core_inventory_warning')) {
      player.tell('Your level-10 core spell is ready. Free one inventory slot to receive your spellbook.');
      data.putBoolean('ashen_core_inventory_warning', true);
    }
    return false;
  }
  var book = ashenCoreSpellBook(cls);
  if (!book) return false;
  player.give(book);
  data.putBoolean(claim, true);
  data.remove('ashen_core_inventory_warning');
  player.tell('Level 10 core spell unlocked: ' + ASHEN_CORE_SPELLS[cls].name + ' I. Equip the rewarded book in your spellbook Curios slot. Craft additional spell scrolls at a Scroll Forge and inscribe them into a spellbook.');
  return true;
}

var ashenCoreSpellTicks = 0;
ServerEvents.tick(event => {
  if (++ashenCoreSpellTicks % 20 != 0) return;
  event.server.players.forEach(ashenUnlockCoreSpell);
});
PlayerEvents.loggedIn(event => {
  event.player.persistentData.remove('ashen_core_inventory_warning');
  event.server.scheduleInTicks(20, () => ashenUnlockCoreSpell(event.player));
});
