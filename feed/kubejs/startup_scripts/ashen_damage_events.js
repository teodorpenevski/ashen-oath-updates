// The native event can change incoming damage before armor is applied.
global.ashenDamageListener = function(event) {
  if (event.getEntity().level.isClientSide()) return;
  if (global.ashenForgeHurt) global.ashenForgeHurt(event);
};
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', global.ashenDamageListener);
