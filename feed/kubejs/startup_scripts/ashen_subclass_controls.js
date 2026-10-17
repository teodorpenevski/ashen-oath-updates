// Stage subclass choices in the existing tree's Confirm/Cancel controls.
if (Platform.isClientEnvironment()) {
  global.ashenAscPending = [];
  global.ashenAscInFlight = [];
  global.ashenRefundBusy = false;
  global.ashenRequestRefund = (screen, id) => {
    var context = global.ashenAscContext(screen);
    if (global.ashenRefundBusy) return;
    if (!context.widgets.newlyLearnedSkills.isEmpty() || global.ashenAscPending.length || global.ashenAscInFlight.length) {
      Client.player.tell('Confirm or cancel pending allocations before refunding.');
      return;
    }
    function send() {
      global.ashenRefundBusy = true;
      global.ashenRefundStarted = Date.now();
      Client.player.sendData('ashen_refund', {node: id});
    }
    if (id == 'all') Java.loadClass('ashen.interop.client.AshenRefundControls').confirmAll(send);
    else send();
  };
  global.ashenAscContext = screen => {
    function field(name) {
      var value = screen.getClass().getDeclaredField(name);
      value.setAccessible(true);
      return value.get(screen);
    }
    if (global.ashenAscPendingScreen != screen) {
      global.ashenAscPendingScreen = screen;
      global.ashenAscPending = [];
    }
    return {buttons: field('skillButtons'), widgets: field('skillTreeWidgets')};
  };
  global.ashenAscPreview = context => {
    var state = global.ashenAscState || {starter_class: '', subclass: '', earned: 0, spent: 0, allocated: {}};
    var learned = {};
    var cap = Java.loadClass('daripher.skilltree.capability.skill.PlayerSkillsProvider').get(Client.player);
    var list = cap.getPlayerSkills();
    for (var i = 0; i < list.size(); i++) {
      var id = String(list.get(i).getId());
      if (id.indexOf('ashen:asc_') != 0) learned[id] = true;
    }
    Object.keys(state.allocated || {}).forEach(id => learned[id] = true);
    context.widgets.newlyLearnedSkills.forEach(id => learned[String(id)] = true);
    var selected = state.subclass;
    var reserved = 0;
    global.ashenAscInFlight.concat(global.ashenAscPending).forEach(id => {
      var spec = global.ashenCombat.asc_nodes[id];
      if (!spec || learned[id]) return;
      learned[id] = true;
      if (spec.kind == 'root') selected = spec.subclass;
      else reserved++;
    });
    return {state: state, learned: learned, selected: selected, available: state.earned - state.spent - reserved};
  };
  global.ashenAscCanStage = (id, preview) => {
    var spec = global.ashenCombat.asc_nodes[id];
    if (!spec || preview.learned[id] || global.ashenCombat.subclasses[spec.subclass].class != preview.state.starter_class) return false;
    if (spec.kind == 'root') return (!preview.selected || preview.selected == spec.subclass)
      && !!preview.learned['ashen:' + global.ashenCombat.subclasses[spec.subclass].class + '_0'];
    return preview.selected == spec.subclass && preview.available > 0
      && spec.requires.every(parent => !!preview.learned[parent]);
  };
  global.ashenAscRefresh = screen => {
    var context = global.ashenAscContext(screen);
    Java.loadClass('ashen.interop.client.AshenRefundControls').install(context.widgets, () => global.ashenRequestRefund(screen, 'all'));
    var preview = global.ashenAscPreview(context);
    var field = context.widgets.getClass().getDeclaredField('learnedSkills');
    field.setAccessible(true);
    var cache = field.get(context.widgets);
    for (var i = cache.size() - 1; i >= 0; i--) {
      if (String(cache.get(i)).indexOf('ashen:asc_') == 0) cache.remove(i);
    }
    var Location = Java.loadClass('net.minecraft.resources.ResourceLocation');
    Object.keys(preview.state.allocated || {}).forEach(id => cache.add(new Location(id)));
    context.buttons.getWidgets().forEach(button => {
      var id = String(button.skill.getId());
      if (!global.ashenCombat.asc_nodes[id]) return;
      button.skillLearned = !!preview.learned[id];
      button.canLearn = global.ashenAscCanStage(id, preview);
      button.active = button.canLearn || global.ashenAscPending[global.ashenAscPending.length - 1] == id;
    });
    function invoke(name) {
      var method = context.widgets.getClass().getDeclaredMethod(name);
      method.setAccessible(true);
      method.invoke(context.widgets);
    }
    var Component = Java.loadClass('net.minecraft.network.chat.Component');
    var confirmText = Component.translatable('widget.confirm_button').getString();
    var cancelText = Component.translatable('widget.cancel_button').getString();
    context.widgets.getWidgets().forEach(widget => {
      var text = String(widget.getMessage().getString());
      if (text != confirmText && text != cancelText) return;
      widget.active = !context.widgets.newlyLearnedSkills.isEmpty() || global.ashenAscPending.length > 0;
      if (text == confirmText) widget.setPressFunc(button => {
        invoke('confirmLearnSkills');
        var pending = global.ashenAscPending;
        global.ashenAscPending = [];
        pending.forEach(id => {
          global.ashenAscInFlight.push(id);
          Client.player.sendData('ashen_asc_allocate', {node: id});
        });
        global.ashenAscRefresh(screen);
      });
      else widget.setPressFunc(button => {
        global.ashenAscPending = [];
        invoke('cancelLearnSkills');
        global.ashenAscRefresh(screen);
      });
    });
  };
  ForgeEvents.onEvent('net.minecraftforge.client.event.ScreenEvent$MouseButtonPressed$Pre', event => {
    var screen = event.getScreen();
    if (String(screen.getClass().getName()) != 'daripher.skilltree.client.screen.SkillTreeScreen') return;
    if (global.ashenRefundBusy) { event.setCanceled(true); return; }
    var context = global.ashenAscContext(screen);
    if (context.widgets.getWidgetAt(event.getMouseX(), event.getMouseY())) return;
    var button = context.buttons.getWidgetAt(event.getMouseX(), event.getMouseY());
    if (!button || !button.skill) return;
    var id = String(button.skill.getId());
    if (event.getButton() == 1 && id.indexOf('ashen:') == 0) {
      event.setCanceled(true);
      if (Client.player && button.skillLearned) global.ashenRequestRefund(screen, id);
      return;
    }
    if (event.getButton() != 0) return;
    if (id.indexOf('ashen:asc_') != 0) return;
    event.setCanceled(true);
    if (!Client.player) return;
    if (global.ashenAscPending[global.ashenAscPending.length - 1] == id) global.ashenAscPending.pop();
    else if (global.ashenAscCanStage(id, global.ashenAscPreview(context))) global.ashenAscPending.push(id);
    global.ashenAscRefresh(screen);
  });
  ForgeEvents.onEvent('net.minecraftforge.client.event.ScreenEvent$Render$Post', event => {
    var screen = event.getScreen();
    if (String(screen.getClass().getName()) != 'daripher.skilltree.client.screen.SkillTreeScreen') return;
    var state = global.ashenAscState;
    if (!state || global.ashenCaptionFailed) return;
    try {
    var mc = Java.loadClass('net.minecraft.client.Minecraft').getInstance();
    var selected = state.subclass ? global.ashenCombat.subclasses[state.subclass].name : 'Not selected';
    var cls = state.starter_class ? state.starter_class.charAt(0).toUpperCase() + state.starter_class.slice(1) : 'Choose a starter class';
    // Select the exact overload; KubeJS converts both String and Component,
    // so passing typed text alone does not remove Rhino's ambiguity.
    var graphics = event.getGuiGraphics();
    var draw = 'drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)';
    var preview = global.ashenAscPreview(global.ashenAscContext(screen));
    if (preview.selected) selected = global.ashenCombat.subclasses[preview.selected].name;
    graphics[draw](mc.font, String('Class: ' + cls + ' | Subclass: ' + selected), 8, 50, 0xFFD580, true);
    graphics[draw](mc.font, String('Subclass points: ' + preview.available + '/' + state.earned + (global.ashenAscPending.length ? ' (pending confirmation)' : '')), 8, 62, 0xFFD580, true);
    } catch (error) {
      // This optional caption must never crash the tree or its controls.
      global.ashenCaptionFailed = true;
      console.warn('Ashen subclass caption disabled after rendering error: ' + error);
    }
  });
}
