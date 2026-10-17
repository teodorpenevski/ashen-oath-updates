// Inventory Profiles Next owns wheel transfers; retain Mouse Tweaks' drag controls.
var AshenMouseTweaksMain = Java.loadClass('yalter.mousetweaks.Main');
var ashenMouseScrollConfigured = false;
function ashenConfigureMouseScroll() {
  if (ashenMouseScrollConfigured || !AshenMouseTweaksMain.config) return;
  var config = AshenMouseTweaksMain.config;
  if (config.wheelTweak) {
    config.wheelTweak = false;
    config.save();
  }
  ashenMouseScrollConfigured = true;
}
ashenConfigureMouseScroll();
ClientEvents.tick(event => ashenConfigureMouseScroll());
