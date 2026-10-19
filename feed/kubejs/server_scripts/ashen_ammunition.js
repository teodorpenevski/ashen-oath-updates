var AshenAmmoBridge=Java.loadClass('ashen.interop.AshenUnlimitedBows');
function ashenSyncAmmunition(player,cycled) {
  if(ashenNetworkPlayer(player))player.sendData('ashen_ammunition_state',{selection:AshenAmmoBridge.selection(player),cycled:cycled===true});
}
NetworkEvents.dataReceived('ashen_cycle_ammunition',event=>{
  // Only a cycle request is accepted; the server enumerates real inventory stacks.
  var tick=AshenGuardBridge.gameTick(event.player),d=event.player.persistentData;
  if(d.contains('ashen_ammo_cycle_tick') && tick-d.getLong('ashen_ammo_cycle_tick')<3)return;
  d.putLong('ashen_ammo_cycle_tick',tick);
  AshenAmmoBridge.cycle(event.player);
  ashenSyncAmmunition(event.player,true);
});
PlayerEvents.loggedIn(event=>event.server.scheduleInTicks(5,()=>ashenSyncAmmunition(event.player)));
PlayerEvents.respawned(event=>event.server.scheduleInTicks(5,()=>ashenSyncAmmunition(event.player)));
