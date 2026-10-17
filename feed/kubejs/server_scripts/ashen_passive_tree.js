// Native PST ownership is the authority for every major ability.
var AshenSkillsProvider = Java.loadClass('daripher.skilltree.capability.skill.PlayerSkillsProvider');
var AshenSkillsReloader = Java.loadClass('daripher.skilltree.data.reloader.SkillsReloader');
var AshenResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');
var AshenMotionPacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundSetEntityMotionPacket');
var AshenActiveBridge = Java.loadClass('ashen.interop.AshenActiveAbilities');
var ASHEN_CENTER = new AshenResourceLocation('ashen:awakening');
var ASHEN_RAGE_DAMAGE = '3b428de1-beb4-43ca-a0ad-5c53beef0001';
var ASHEN_RAGE_SPEED = '3b428de1-beb4-43ca-a0ad-5c53beef0002';
var ASHEN_ACTIVE_NODES = {
  mage_blink: 'ashen:mage_19', ranger_windrunner: 'ashen:ranger_19',
  ranger_mark: 'ashen:ranger_21', rogue_double_jump: 'ashen:rogue_19',
  rogue_shadowstep: 'ashen:rogue_20'
};
var ASHEN_COOLDOWNS = {mage_blink: 3, ranger_windrunner: 8, ranger_mark: 5,
  rogue_double_jump: 0, rogue_shadowstep: 2};

function ashenSkillsReady(player) {
  return AshenSkillsProvider.hasSkills(player);
}

function ashenLearned(player) {
  // Mutating callers wait instead of treating unavailable data as an empty build.
  if (!ashenSkillsReady(player)) return {};
  var list = AshenSkillsProvider.get(player).getPlayerSkills();
  var result = {};
  for (let i = 0; i < list.size(); i++) result[String(list.get(i).getId())] = true;
  return result;
}

function ashenEnsureCenter(player, server) {
  ashenReconcileBuild(player, server);
}

function ashenRemoveRage(player, server) {
  server.runCommandSilent('attribute ' + player.username + ' minecraft:generic.attack_damage modifier remove ' + ASHEN_RAGE_DAMAGE);
  server.runCommandSilent('attribute ' + player.username + ' minecraft:generic.attack_speed modifier remove ' + ASHEN_RAGE_SPEED);
}

function ashenUpdateRage(player, server) {
  if (!ashenSkillsReady(player)) return;
  var learned = ashenLearned(player);
  var held = String(player.mainHandItem.id);
  var weapon = /(?:sword|mace)/i.test(held) || (/axe/i.test(held) && !/pickaxe/i.test(held));
  var eligible = !!learned['ashen:warrior_19'] && weapon;
  var active = player.persistentData.getBoolean('ashen_rage_active');
  if (eligible == active) return;
  ashenRemoveRage(player, server);
  if (eligible) {
    server.runCommandSilent('attribute ' + player.username + ' minecraft:generic.attack_damage modifier add ' + ASHEN_RAGE_DAMAGE + ' Ashen_Rage_Damage 0.12 multiply_base');
    server.runCommandSilent('attribute ' + player.username + ' minecraft:generic.attack_speed modifier add ' + ASHEN_RAGE_SPEED + ' Ashen_Rage_Speed 0.15 multiply_base');
  }
  player.persistentData.putBoolean('ashen_rage_active', eligible);
}

PlayerEvents.loggedIn(event => {
  ashenClearBloodRage(event.player);
  event.player.persistentData.remove('ashen_colossus_synced');
  ashenRemoveRage(event.player, event.server);
  event.player.persistentData.putBoolean('ashen_rage_active', false);
  event.player.persistentData.putBoolean('ashen_double_jump_used', false);
  event.player.persistentData.putString('ashen_projection', '');
  AshenActiveBridge.clearShadow(event.player);
  Java.loadClass('ashen.interop.AshenMajorPassives').clear(event.player);
  // Retire cooldown timestamps from the previous, slower ability version.
  if (event.player.persistentData.getString('ashen_combat_version') != 'ascendancy-1') {
    Object.keys(ASHEN_COOLDOWNS).forEach(id => event.player.persistentData.putLong('ashen_ability_ready_' + id, 0));
    event.player.persistentData.putString('ashen_combat_version', 'ascendancy-1');
  }
  event.server.scheduleInTicks(1, () => ashenEnsureCenter(event.player, event.server));
});
PlayerEvents.tick(event => {
  if (event.player.onGround()) {
    event.player.persistentData.putBoolean('ashen_double_jump_used', false);
    AshenGuardBridge.resetPhantomJump(event.player);
  }
});
let ashenTreeTicks = 0;
function ashenUpdatePlayerBuild(player, server) {
  // Players can enter the server list before PST finishes its login setup.
  if (!ashenSkillsReady(player)) return;
  ashenEnsureCenter(player, server);
  ashenUpdateRage(player, server);
  ashenSyncEpicSkills(player);
  ashenSubclassRegeneration(player);
  ashenSyncAbilityState(player);
}
ServerEvents.tick(event => {
  if (++ashenTreeTicks % 5 != 0) return;
  event.server.players.forEach(player => ashenUpdatePlayerBuild(player, event.server));
});
PlayerEvents.respawned(event => {
  AshenActiveBridge.clearShadow(event.player);
  ashenRemoveRage(event.player, event.server);
  event.player.persistentData.putBoolean('ashen_rage_active', false);
  event.server.scheduleInTicks(1, () => ashenEnsureCenter(event.player, event.server));
});

var ashenBlinkCasts = {};
function ashenFinishBlink(player, server, world) {
  var ready = AshenActiveBridge.canFinishBlink(player,world) && ashenSkillsReady(player) && !!ashenLearned(player)['ashen:mage_19'];
  var success = ready && AshenActiveBridge.blink(player);
  if (!success) {
    player.persistentData.putLong('ashen_ability_ready_mage_blink',0);
    if (ready) player.tell('Blink needs a safe landing within 16 blocks in your aim direction.');
  }
  if (ready) ashenSyncAbilityState(player);
  return !!success;
}
function ashenBlink(player, server) {
  var id=String(player.uuid);
  if (ashenBlinkCasts[id] || !AshenActiveBridge.canFinishBlink(player,AshenActiveBridge.blinkWorld(player)))return false;
  var ticket={world:AshenActiveBridge.blinkWorld(player)};ashenBlinkCasts[id]=ticket;
  AshenActiveBridge.beginBlink(player);
  server.players.forEach(viewer=>viewer.sendData('ashen_blink_windup',{player:id}));
  server.scheduleInTicks(3,()=>{
    if(ashenBlinkCasts[id]!=ticket)return;
    delete ashenBlinkCasts[id];
    ashenFinishBlink(player,server,ticket.world);
  });
  return true;
}
PlayerEvents.loggedOut(event=>{delete ashenBlinkCasts[String(event.player.uuid)];});
PlayerEvents.respawned(event=>{delete ashenBlinkCasts[String(event.player.uuid)];});

function ashenActivateMajor(event) {
  var player = event.player;
  if (!ashenSkillsReady(player)) return;
  var id = String(event.data.id);
  // Never accept node IDs, command text, cooldowns or effects from the client.
  if (!Object.prototype.hasOwnProperty.call(ASHEN_ACTIVE_NODES, id)) return;
  if (!ashenLearned(player)[ASHEN_ACTIVE_NODES[id]]) {
    player.tell('Unlock this major node first.');
    return;
  }
  if (player.isSpectator()) return;
  var now = Date.now();
  var cooldownKey = 'ashen_ability_ready_' + id;
  if (id == 'ranger_windrunner' && (AshenActiveBridge.windrunnerRemaining(player) > 0 || AshenActiveBridge.windrunnerCooldown(player) > 0)) {
    player.tell(AshenActiveBridge.windrunnerRemaining(player) > 0 ? 'Windrunner is already active.' : 'Windrunner is recharging (' + Math.ceil(AshenActiveBridge.windrunnerCooldown(player) / 20) + 's).');
    return;
  }
  if (id != 'ranger_windrunner' && ASHEN_COOLDOWNS[id] > 0 && player.persistentData.getLong(cooldownKey) > now) {
    player.tell('That ability is recharging.');
    return;
  }
  let activated = false;
  if (id == 'mage_blink') {
    activated = ashenBlink(player, event.server);
  } else if (id == 'rogue_shadowstep') {
    activated = AshenActiveBridge.shadowstep(player);
  } else if (id == 'ranger_windrunner') {
    activated = AshenActiveBridge.startWindrunner(player);
  } else if (id == 'ranger_mark') {
    activated = event.server.runCommandSilent('execute as ' + player.username + ' at @s run effect give @e[type=!player,type=!item,type=!experience_orb,distance=..12] minecraft:glowing 12 0 true') > 0;
  } else if (id == 'rogue_double_jump') {
    if (player.onGround() || player.isInWater() || player.isPassenger() || player.isFallFlying()) {
      player.tell('Double Jump requires you to be airborne.');
      return;
    }
    if (player.persistentData.getBoolean('ashen_double_jump_used') || !AshenGuardBridge.reservePhantomJump(player)) {
      player.tell('Land before using your next Double Jump.');
      return;
    }
    player.motionY = 0.55;
    player.connection.send(new AshenMotionPacket(player));
    player.persistentData.putBoolean('ashen_double_jump_used', true);
    activated = true;
  }
  if (activated && id != 'ranger_windrunner') player.persistentData.putLong(cooldownKey, now + ASHEN_COOLDOWNS[id] * 1000);
  else if (!activated) player.tell(id == 'rogue_shadowstep' ? 'Shadowstep needs a target within 12 blocks and a safe landing behind it.' : 'Blink needs a safe landing within 16 blocks in your aim direction.');
  if (activated) ashenSyncAbilityState(player);
}
NetworkEvents.dataReceived('ashen_ability', ashenActivateMajor);

function ashenAbilityState(player, now) {
  var owned = ashenLearned(player);
  return Object.keys(ASHEN_ACTIVE_NODES).filter(id => ASHEN_COOLDOWNS[id] > 0 && !!owned[ASHEN_ACTIVE_NODES[id]]).map(id => {
    var remaining = Math.max(0, player.persistentData.getLong('ashen_ability_ready_' + id) - now);
    var total = ASHEN_COOLDOWNS[id] * 1000, mode = 'cooldown';
    if (id == 'ranger_windrunner') {
      var active = AshenActiveBridge.windrunnerRemaining(player);
      remaining = active > 0 ? active * 50 : AshenActiveBridge.windrunnerCooldown(player) * 50;
      total = active > 0 ? 15000 : 8000;
      if (active > 0) mode = 'active';
    }
    if (id == 'rogue_double_jump' && player.persistentData.getBoolean('ashen_double_jump_used')) mode = 'blocked';
    return {id: id, mode: mode, remaining: remaining, total: Math.max(1, total)};
  });
}
function ashenSyncAbilityState(player) {
  if (!ashenSkillsReady(player) || !ashenNetworkPlayer(player)) return;
  var now = Date.now(), data = player.persistentData;
  var abilities = JSON.stringify(ashenAbilityState(player, now));
  var buffs = JSON.stringify(ashenBuffState(player, now));
  var state = abilities + buffs;
  if (state == data.getString('ashen_ability_projection') && now - data.getLong('ashen_ability_projection_sent') < 2000) return;
  player.sendData('ashen_ability_state', {abilities: abilities, buffs: buffs});
  data.putString('ashen_ability_projection', state);
  data.putLong('ashen_ability_projection_sent', now);
}

function ashenBuffState(player, now) {
  if (!ashenSkillsReady(player) || !player.isAlive() || player.isSpectator()) return [];
  var rows=[], d=player.persistentData, tick=AshenGuardBridge.gameTick(player);
  var owned=ashenLearned(player), nativeData=AshenActiveBridge.abilityData(player);
  var has=id=>!!owned['ashen:'+id];
  var add=(id,name,detail,stacks,remaining)=>rows.push({id:id,name:name,detail:detail,stacks:stacks,remaining:Math.max(0,remaining)});
  var blood=Math.min(10,d.getInt('ashen_blood_rage_stacks'));
  if (has('asc_berserker_big_2') && blood>0 && d.getLong('ashen_blood_rage_until')>now)
    add('blood_rage','Blood Rage','+'+(blood*10)+'% attack speed',blood,d.getLong('ashen_blood_rage_until')-now);
  if (has('warrior_19') && d.getBoolean('ashen_rage_active')) add('berserk','Berserk','+12% damage / +15% AS',0,0);
  var major=Java.loadClass('ashen.interop.AshenMajorPassives');
  var fortify=major.fortifyRemaining(player);
  if (has('warrior_20') && fortify>0) add('fortify','Fortify',(Math.round(fortify*10)/10)+' absorption health',0,0);
  if (has('mage_20') && major.wardActive(player)) add('ward','Arcane Ward',(Math.round(major.wardRemaining(player)*10)/10)+' shield remaining',0,(nativeData.getLong('ashen_ward_expires')-tick)*50);
  if (has('mage_21')) {
    var regen=player.getAttributeValue(AshenRegistries.ATTRIBUTE.get(new AshenResourceLocation('irons_spellbooks:mana_regen')));
    add('mana_siphon','Mana Siphon','+'+(Math.round(Math.max(0,regen)*500)/10)+'% spell power',0,0);
  }
  if (has('ranger_19') && AshenActiveBridge.windrunnerRemaining(player)>0)
    add('windrunner','Windrunner','Speed II / Slow Falling',0,AshenActiveBridge.windrunnerRemaining(player)*50);
  if (has('rogue_20') && AshenActiveBridge.shadowConcealed(player))
    add('shadowstep','Shadowstep','True invisibility',0,(nativeData.getLong('ashen_shadowstep_concealed_until')-tick)*50);
  if (ashenStarterClass(player)=='rogue' && player.isCrouching()) add('concealment','Rogue Concealment','Hidden from mobs',0,0);
  if (has('asc_duelist_big_4') && d.getLong('ashen_flurry_until')>now) {
    var flurry=Math.min(3,d.getInt('ashen_flurry_hits'));
    if (flurry>0) add('flurry','Flurry','+'+(flurry*10)+'% next melee hit',flurry,d.getLong('ashen_flurry_until')-now);
  }
  if (has('asc_vanguard_big_2') && ashenBlocking(player)) add('bulwark','Bulwark','40% less damage',0,0);
  if (has('asc_vanguard_big_3') && player.getHealth()<=player.getMaxHealth()*.35) add('last_stand','Last Stand','50% less damage',0,0);
  if (has('asc_vanguard_big_4') && player.isCrouching() && Math.abs(player.motionX)+Math.abs(player.motionZ)<.01) add('holdfast','Holdfast','1 health per second',0,0);
  if (has('asc_berserker_big_4') && AshenGuardBridge.colossusMovesetActive(player)) add('colossal_grip','Colossal Grip','Dual two-handed weapons',0,0);
  return rows;
}

ServerEvents.loaded(event => console.info('[ASHEN PATHS] Unified tree and major abilities loaded.'));

function ashenSyncSheathed(server) {
  var players=[];
  server.players.forEach(player=>{if(player.persistentData.getBoolean('ashen_sheathed'))players.push(String(player.uuid));});
  var state=JSON.stringify(players);
  server.players.forEach(player=>player.sendData('ashen_sheathe_state',{players:state}));
}
NetworkEvents.dataReceived('ashen_sheathe',event=>{
  event.player.persistentData.putBoolean('ashen_sheathed',event.data.sheathed==true);
  ashenSyncSheathed(event.server);
});
let ashenSheatheTicks=0;
ServerEvents.tick(event=>{if(++ashenSheatheTicks%40==0)ashenSyncSheathed(event.server);});
