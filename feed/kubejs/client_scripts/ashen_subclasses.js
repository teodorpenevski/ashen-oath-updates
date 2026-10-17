NetworkEvents.dataReceived('ashen_asc_state', event => {
  var allocated = {};
  JSON.parse(String(event.data.allocations || '[]')).forEach(id => allocated[id] = true);
  global.ashenAscState = {starter_class: String(event.data.starter_class || ''), subclass: String(event.data.subclass), earned: Number(event.data.earned),
    spent: Number(event.data.spent), main_allocated: Number(event.data.main_allocated), allocated: allocated};
});
NetworkEvents.dataReceived('ashen_asc_result', event => {
  var id = String(event.data.node);
  global.ashenAscInFlight = global.ashenAscInFlight.filter(key => key != id);
});
ClientEvents.tick(event => {
  if (!Client.player) {
    global.ashenRefundBusy = false;
    global.ashenAscPending = [];
    global.ashenAscInFlight = [];
    global.ashenAscState = null;
    global.ashenAscPendingScreen = null;
    return;
  }
  var mc = Java.loadClass('net.minecraft.client.Minecraft').getInstance();
  var screen = mc.screen;
  if (global.ashenRefundBusy && Date.now() - global.ashenRefundStarted > 5000) global.ashenRefundBusy = false;
  if (!screen || String(screen.getClass().getName()) != 'daripher.skilltree.client.screen.SkillTreeScreen') return;
  global.ashenAscRefresh(screen);
});
NetworkEvents.dataReceived('ashen_refund_result', event => {
  global.ashenRefundBusy = false;
  global.ashenAscPending = [];
  global.ashenAscInFlight = [];
  global.ashenAscState = {starter_class: String(event.data.starter_class || ''), subclass: String(event.data.subclass || ''),
    earned: Number(event.data.earned), spent: Number(event.data.spent), main_allocated: Number(event.data.main_allocated),
    allocated: JSON.parse(String(event.data.asc_allocations || '{}'))};
  var screen = Java.loadClass('net.minecraft.client.Minecraft').getInstance().screen;
  if (screen && String(screen.getClass().getName()) == 'daripher.skilltree.client.screen.SkillTreeScreen')
    Java.loadClass('ashen.interop.client.AshenRefundControls').refresh(screen, String(event.data.allocations), Number(event.data.points));
});
