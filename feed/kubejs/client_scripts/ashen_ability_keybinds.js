var AshenAbilityHudClient = Java.loadClass('ashen.interop.client.AshenAbilityHud');
AshenAbilityHudClient.setAbilityHandler(id => {
  if (Client.player) Client.player.sendData('ashen_ability', {id: String(id)});
});
var AshenBuffHudClient = Java.loadClass('ashen.interop.client.AshenBuffHud');
var AshenBlinkWindupClient = Java.loadClass('ashen.interop.client.AshenBlinkClient');
NetworkEvents.dataReceived('ashen_blink_windup',event=>AshenBlinkWindupClient.start(String(event.data.player)));
var AshenSheatheHudClient = Java.loadClass('ashen.interop.client.AshenSheatheClient');
AshenSheatheHudClient.setHandler(state => {if (Client.player) Client.player.sendData('ashen_sheathe',{sheathed:state==true});});
NetworkEvents.dataReceived('ashen_sheathe_state',event => AshenSheatheHudClient.update(String(event.data.players)));
NetworkEvents.dataReceived('ashen_ability_state', event => {
  AshenAbilityHudClient.update(String(event.data.abilities));
  if (event.data.buffs) AshenBuffHudClient.update(String(event.data.buffs));
});
