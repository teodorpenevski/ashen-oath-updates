var AshenPartyPositionTracker = Java.loadClass('ashen.interop.client.AshenPartyTracker');
NetworkEvents.dataReceived('ashen_party_positions', event =>
  AshenPartyPositionTracker.update(String(event.data.positions || '[]')));
