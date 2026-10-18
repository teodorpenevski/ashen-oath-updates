// FTB Teams can own claims without populating OpenPAC's built-in party tracker.
var AshenPartyPositionBridge = Java.loadClass('ashen.interop.AshenPartyPositions');
let ashenPartyPositionTicks = 0;
ServerEvents.tick(event => {
  if (++ashenPartyPositionTicks % 20 != 0) return;
  event.server.players.forEach(player => player.sendData('ashen_party_positions', {
    positions: AshenPartyPositionBridge.snapshot(player)
  }));
});
