var AshenAmmunitionClient=Java.loadClass('ashen.interop.client.AshenAmmoClient');
var AshenAmmunitionHud=Java.loadClass('ashen.interop.client.AshenAmmoHud');
AshenAmmunitionClient.setHandler(()=>{if(Client.player)Client.player.sendData('ashen_cycle_ammunition',{});});
NetworkEvents.dataReceived('ashen_ammunition_state',event=>{
  if(Client.player)AshenAmmunitionHud.selection(String(event.data.selection),Boolean(event.data.cycled));
});
