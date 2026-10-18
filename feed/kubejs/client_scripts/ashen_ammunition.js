var AshenAmmunitionClient=Java.loadClass('ashen.interop.client.AshenAmmoClient');
var AshenAmmunitionBridge=Java.loadClass('ashen.interop.AshenUnlimitedBows');
AshenAmmunitionClient.setHandler(()=>{if(Client.player)Client.player.sendData('ashen_cycle_ammunition',{});});
NetworkEvents.dataReceived('ashen_ammunition_state',event=>{
  if(Client.player)AshenAmmunitionBridge.acceptSelection(Client.player,String(event.data.selection));
});
