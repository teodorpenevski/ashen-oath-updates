var AshenDamageTags = Java.loadClass('net.minecraft.tags.DamageTypeTags');
var AshenEffects = Java.loadClass('net.minecraft.world.effect.MobEffects');
var AshenEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance');
var AshenMagic = Java.loadClass('io.redspace.ironsspellbooks.api.magic.MagicData');
var AshenManaPacket = Java.loadClass('io.redspace.ironsspellbooks.network.SyncManaPacket');
var AshenMessages = Java.loadClass('io.redspace.ironsspellbooks.setup.Messages');
var AshenRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries');
var AshenModifierUUID = Java.loadClass('java.util.UUID');
var AshenAttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier');
var AshenAttributeOperation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation');
var ASHEN_BLOOD_RAGE_UUID = AshenModifierUUID.fromString('e0b78470-1bd8-4a61-9618-32ac3859b809');

function ashenRefreshSubclassStats(player) {
  if (!ashenSkillsReady(player)) return;
  var revision = global.ashenCombat.settings.passive_revision;
  if (revision && player.persistentData.getString('ashen_major_revision') != revision) {
    // Removed/replaced bonuses need their OLD attribute UUID removed explicitly.
    (global.ashenCombat.settings.retired_balance_modifiers || []).forEach(bonus => {
      var attribute = AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation(bonus.attribute));
      var instance = attribute ? player.getAttribute(attribute) : null;
      if (instance) instance.removeModifier(AshenModifierUUID.fromString(bonus.id));
    });
    // Mana Siphon's retired flat spell-power bonus is absent from its new data.
    var retired = player.getAttribute(AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation('irons_spellbooks:spell_power')));
    if (retired) retired.removeModifier(AshenModifierUUID.fromString('688d116c-3601-522e-9230-13f2e4bd388f'));
    Object.keys(global.ashenCombat.settings.passive_overrides).forEach(id => {
      if (!ashenHas(player, id)) return;
      var major = ashenNativeSkill('ashen:' + id);
      major.remove(player);
      major.learn(player, false);
    });
    player.persistentData.putString('ashen_major_revision', revision);
  }
  var balance = global.ashenCombat.subclass_balance;
  if (player.persistentData.getString('ashen_subclass_balance') == balance.version) return;
  // Remove only this pack's known subclass UUIDs, including retired penalties.
  balance.previous_bonuses.forEach(bonus => {
    var attribute = AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation(bonus.attribute));
    var instance = player.getAttribute(attribute);
    if (instance) instance.removeModifier(AshenModifierUUID.fromString(bonus.id));
  });
  var owned = ashenLearned(player);
  Object.keys(global.ashenCombat.asc_nodes).forEach(id => {
    if (!owned[id]) return;
    var skill = ashenNativeSkill(id);
    skill.remove(player);
    skill.learn(player, false);
  });
  player.persistentData.putString('ashen_subclass_balance', balance.version);
  player.persistentData.remove('ashen_flurry_target');
  player.persistentData.remove('ashen_flurry_hits');
  player.persistentData.remove('ashen_flurry_until');
}

function ashenHas(player, id) { return !!ashenLearned(player)['ashen:' + id]; }
function ashenMaximumMana(player) {
  return player.getAttributeValue(AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation('irons_spellbooks:max_mana')));
}
function ashenRestoreMana(player, amount) {
  var magic = AshenMagic.getPlayerMagicData(player);
  magic.setMana(Math.min(ashenMaximumMana(player), magic.getMana() + amount));
  if (ashenNetworkPlayer(player)) AshenMessages.sendToPlayer(new AshenManaPacket(magic), player);
}
function ashenApplyEffect(entity, effect, seconds, amplifier) {
  entity.addEffect(new AshenEffectInstance(effect, seconds * 20, amplifier, false, true));
}
function ashenSubclassRegeneration(player) {
  if (!ashenSkillsReady(player)) return;
  if (!ashenHas(player, 'asc_berserker_big_2') || player.persistentData.getLong('ashen_blood_rage_until') <= Date.now()) ashenClearBloodRage(player);
}
function ashenSyncColossus(player) {
  if (!ashenSkillsReady(player)) return;
  var allocated = ashenHas(player, 'asc_berserker_big_4');
  var data = player.persistentData;
  if (data.contains('ashen_colossus_synced') && data.getBoolean('ashen_colossus_synced') == allocated) return;
  data.putBoolean('ashen_colossus_synced', allocated);
  Java.loadClass('ashen.interop.AshenSkillBridge').refreshWeapons(player);
}
function ashenClearBloodRage(player) {
  var attribute = AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation('minecraft:generic.attack_speed'));
  player.getAttribute(attribute).removeModifier(ASHEN_BLOOD_RAGE_UUID);
  player.persistentData.remove('ashen_blood_rage_stacks');
  player.persistentData.remove('ashen_blood_rage_until');
  player.persistentData.remove('ashen_blood_rage_last_tick');
}
function ashenStackBloodRage(player) {
  var data = player.persistentData;
  var tick = AshenGuardBridge.gameTick(player);
  if (data.contains('ashen_blood_rage_last_tick') && data.getLong('ashen_blood_rage_last_tick') == tick) return;
  var stacks = data.getLong('ashen_blood_rage_until') > Date.now() ? data.getInt('ashen_blood_rage_stacks') : 0;
  stacks = Math.min(stacks + 1, 10);
  data.putInt('ashen_blood_rage_stacks', stacks);
  data.putLong('ashen_blood_rage_until', Date.now() + 5000);
  data.putLong('ashen_blood_rage_last_tick', tick);
  var attribute = AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation('minecraft:generic.attack_speed'));
  var instance = player.getAttribute(attribute);
  instance.removeModifier(ASHEN_BLOOD_RAGE_UUID);
  instance.addTransientModifier(new AshenAttributeModifier(ASHEN_BLOOD_RAGE_UUID, 'Ashen Blood Rage', stacks * .1, AshenAttributeOperation.MULTIPLY_TOTAL));
}
function ashenPlayerSource(source) {
  return source.player;
}
function ashenMeleeSource(source, player) {
  var direct = source.immediate;
  return direct != null && direct == player && !source.is(AshenDamageTags.IS_PROJECTILE);
}
function ashenSubclassHurt(event) {
  var victim = event.entity;
  var source = event.source;
  if (victim.isPlayer()) {
    if (ashenHas(victim, 'asc_arcanist_big_4') && source.is(AshenDamageTags.IS_FIRE)) {
      victim.heal(event.damage * 0.5);
      event.cancel();
      return;
    }
    if (ashenHas(victim, 'asc_scout_big_4') && source.is(AshenDamageTags.IS_FALL)) { event.cancel(); return; }
  }
  var player = ashenPlayerSource(source);
  if (!player) return;
  var melee = ashenMeleeSource(source, player);
  var projectile = source.is(AshenDamageTags.IS_PROJECTILE);
  if (melee && event.damage > 0 && ashenHas(player, 'asc_berserker_big_2')) ashenStackBloodRage(player);
  if (ashenHas(player, 'asc_marksman_big_2')) {
    if (projectile) {
      var dx = player.x - victim.x, dy = player.y - victim.y, dz = player.z - victim.z;
      if (dx * dx + dy * dy + dz * dz >= 144) event.damage *= 1.6;
    }
  }
  if (ashenHas(player, 'asc_scout_big_3') && victim.hasEffect(AshenEffects.GLOWING)) event.damage *= 1.5;
  if (melee && ashenHas(player, 'asc_assassin_big_1')) {
    // KubeJS's Math binding exposes functions but no PI constant.
    var yaw = victim.nbt.getList('Rotation', 5).getFloat(0) * 0.017453292519943295;
    var x = player.x - victim.x, z = player.z - victim.z;
    var distance = Math.sqrt(x * x + z * z);
    var dot = distance > 0 ? (-Math.sin(yaw) * x + Math.cos(yaw) * z) / distance : 1;
    if (dot < -0.5) event.damage *= 2.0;
  }
  if (melee && ashenHas(player, 'asc_spellblade_big_1')) ashenRestoreMana(player, 8);
  if (melee && ashenHas(player, 'asc_spellblade_big_3')) ashenApplyEffect(player, AshenEffects.MOVEMENT_SPEED, 3, 0);
  // Rogue poison snapshots final, post-armor damage in the native LivingDamage handler.
  if (melee && ashenHas(player, 'asc_duelist_big_4')) {
    var data = player.persistentData;
    var target = String(victim.uuid);
    var now = Date.now();
    var followups = data.getString('ashen_flurry_target') == target
      && data.getLong('ashen_flurry_until') > now ? Math.min(data.getInt('ashen_flurry_hits'), 3) : 0;
    event.damage *= 1 + followups * 0.1;
    data.putString('ashen_flurry_target', target);
    data.putInt('ashen_flurry_hits', Math.min(followups + 1, 3));
    data.putLong('ashen_flurry_until', now + 3000);
  }
  if (projectile && ashenHas(player, 'asc_marksman_big_4')) ashenApplyEffect(victim, AshenEffects.MOVEMENT_SLOWDOWN, 4, 2);
}
function ashenSubclassDeath(event) {
  if (event.entity.isPlayer()) ashenClearBloodRage(event.entity);
  var player = ashenPlayerSource(event.source);
  if (!player) return;
  if (ashenHas(player, 'asc_arcanist_big_3')) ashenRestoreMana(player, ashenMaximumMana(player) * 0.2);
  if (ashenHas(player, 'asc_scout_big_2') && event.source.is(AshenDamageTags.IS_PROJECTILE)) player.heal(player.getMaxHealth() * 0.25);
  if (ashenHas(player, 'asc_berserker_big_3')) {
    player.heal(player.getMaxHealth() * 0.25);
    ashenApplyEffect(player, AshenEffects.MOVEMENT_SPEED, 2, 1);
  }
}
// KubeJS EntityEvents.hurt has a read-only damage amount. Forge's event
// supplies the mutable amount used by the actual combat calculation.
global.ashenForgeHurt = function(nativeEvent) {
  var adapted = {entity: nativeEvent.getEntity(), source: nativeEvent.getSource(),
    damage: nativeEvent.getAmount(), cancel: function() { nativeEvent.setCanceled(true); }};
  ashenSubclassHurt(adapted);
  nativeEvent.setAmount(adapted.damage);
};
EntityEvents.death(ashenSubclassDeath);
