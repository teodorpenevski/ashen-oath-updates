// Keep all Screen and Minecraft types on the physical client.
var AshenClassPickerClient = Java.loadClass('ashen.interop.client.AshenClassPicker');
NetworkEvents.dataReceived('ashen_class_picker', event => AshenClassPickerClient.open());
NetworkEvents.dataReceived('ashen_asc_state', event => {
  var selected = String(event.data.starter_class || '');
  if (selected) AshenClassPickerClient.acknowledge(selected);
});
