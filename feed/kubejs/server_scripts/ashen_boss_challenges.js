// Filtered FTB counters: exact Oathless tag and Apotheosis's real boss marker.
// Native kill tasks handle the other 30 registered entity types.
var ASHEN_BOSS_CUSTOM_TASKS = {
  "347BE8E0721D9F2E": {
    "kind": "oathless",
    "count": 1
  },
  "0686F569C3BE1D2E": {
    "kind": "oathless",
    "count": 3
  },
  "0139EF0FFE8AA699": {
    "kind": "oathless",
    "count": 5
  },
  "6C1B7076BEE1EC6C": {
    "kind": "apotheosis",
    "count": 1
  },
  "60B70CB759FA667F": {
    "kind": "apotheosis",
    "count": 3
  },
  "15DA403A5E286264": {
    "kind": "apotheosis",
    "count": 5
  }
};
var AshenBossFile = Java.loadClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile');
var AshenBossCustomTaskEvent = Java.loadClass('dev.ftb.mods.ftbquests.events.CustomTaskEvent');
var AshenBossEventResult = Java.loadClass('dev.architectury.event.EventResult');
var AshenBossEventActor = Java.loadClass('dev.architectury.event.EventActor');

// Keep one native listener across /reload; it reads the current global mapping.
global.ashenBossTaskRules = ASHEN_BOSS_CUSTOM_TASKS;
if (!global.ashenBossTaskListenerRegistered) {
  AshenBossCustomTaskEvent.EVENT.register(new AshenBossEventActor({act: function(event) {
    var task = event.getTask();
    var rule = global.ashenBossTaskRules[String(task.getCodeString()).toUpperCase()];
    if (rule) {
      task.setMaxProgress(rule.count);
      task.setEnableButton(false);
    }
    return AshenBossEventResult.pass();
  }}));
  global.ashenBossTaskListenerRegistered = true;
}

EntityEvents.death(event => {
  var player = event.source.player;
  if (!player || !AshenBossFile.INSTANCE) return;
  var entity = event.entity;
  var kind = null;
  if (String(entity.type) === 'minecraft:husk' && entity.getTags().contains('ashen_oathless')) kind = 'oathless';
  else if (entity.persistentData.getBoolean('apoth.boss')) kind = 'apotheosis';
  if (!kind) return;
  // Dedupe a death callback without treating an ordinary named mob as a boss.
  if (entity.persistentData.getBoolean('ashen_bounty_counted')) return;
  var file = AshenBossFile.INSTANCE;
  // Rhino otherwise considers both UUID and Entity overloads applicable to a player.
  var team = file['getOrCreateTeamData(net.minecraft.world.entity.Entity)'](player);
  var tasks = file.getAllTasks();
  var eligible = [];
  for (var i = 0; i < tasks.size(); i++) {
    var task = tasks.get(i);
    var rule = ASHEN_BOSS_CUSTOM_TASKS[String(task.getCodeString()).toUpperCase()];
    if (rule && rule.kind === kind && team.canStartTasks(task.getQuest()) && !team.isCompleted(task)) eligible.push(task);
  }
  // Snapshot eligibility so a single death cannot complete two contract tiers.
  eligible.forEach(task => team.addProgress(task, 1));
  entity.persistentData.putBoolean('ashen_bounty_counted', true);
});
