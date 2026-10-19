// Real team progress, not manual completion buttons.
var AshenMountProgress = Java.loadClass('ashen.interop.AshenMountProgression');
var AshenMountQuestFile = Java.loadClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile');
var AshenMountTaskEvent = Java.loadClass('dev.ftb.mods.ftbquests.events.CustomTaskEvent');
var AshenMountEventResult = Java.loadClass('dev.architectury.event.EventResult');
var AshenMountEventActor = Java.loadClass('dev.architectury.event.EventActor');
var ASHEN_MOUNT_RULES = {
  "62F72F5C6661BCAE": {
    "kind": "explored",
    "count": 3
  },
  "28919B49949C883E": {
    "kind": "ground",
    "count": 1
  },
  "731A274F348B677B": {
    "kind": "victory",
    "count": 1
  },
  "4A72E17C83C0DBAC": {
    "kind": "flight",
    "count": 1
  }
};
global.ashenMountRules = ASHEN_MOUNT_RULES;
if (!global.ashenMountListenerRegistered) {
  AshenMountTaskEvent.EVENT.register(new AshenMountEventActor({act: function(event) {
    var task=event.getTask(); var rule=global.ashenMountRules[String(task.getCodeString()).toUpperCase()];
    if(rule){task.setMaxProgress(rule.count);task.setEnableButton(false);}
    return AshenMountEventResult.pass();
  }}));
  global.ashenMountListenerRegistered=true;
}
var ashenMountTicks=0;
ServerEvents.tick(event => {
  if(++ashenMountTicks%20!==0 || !AshenMountQuestFile.INSTANCE)return;
  var file=AshenMountQuestFile.INSTANCE;var tasks=file.getAllTasks();
  event.server.players.forEach(player => {
    var team=file['getOrCreateTeamData(net.minecraft.world.entity.Entity)'](player);
    for(var i=0;i<tasks.size();i++){
      var task=tasks.get(i);var rule=ASHEN_MOUNT_RULES[String(task.getCodeString()).toUpperCase()];
      if(!rule || !team.canStartTasks(task.getQuest()))continue;
      var value=rule.kind==='explored'?AshenMountProgress.explored(player):rule.kind==='ground'?(AshenMountProgress.ground(player)?1:0):rule.kind==='victory'?(AshenMountProgress.victory(player)?1:0):(AshenMountProgress.flight(player)?1:0);
      value=Math.min(value,rule.count);if(value>team.getProgress(task))team.setProgress(task,value);
    }
  });
});
ServerEvents.recipes(event => {
  event.shapeless(Item.of('patchouli:guide_book', {'patchouli:book':'mythicmounts:mythical_mounts'}), ['minecraft:book','minecraft:leather']).id('kubejs:ashen/mythical_mounts_guide');
  event.shaped('kubejs:earthbound_oath',['LIL','WSW','LIL'],{L:'minecraft:leather',I:'minecraft:iron_ingot',W:'minecraft:wheat',S:'minecraft:string'}).id('kubejs:ashen/earthbound_oath');
  event.shaped('kubejs:skybound_oath',['MPM','FOF','PDM'],{M:'minecraft:phantom_membrane',P:'minecraft:ender_pearl',F:'minecraft:feather',O:'kubejs:earthbound_oath',D:'minecraft:diamond'}).id('kubejs:ashen/skybound_oath');
});
