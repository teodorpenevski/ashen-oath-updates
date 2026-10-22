// Only recover earned campaign command rewards. Never complete a task or mint a trophy.
var AshenStoryRewardFile = Java.loadClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile');
var ASHEN_STORY_REWARD_RECOVERY = [
  ['4ABC728ECDF69C86', 'execute if score #chapter ashen_story matches 2..', 'ashen:chapter/complete_1'],
  ['69787BE0EAB76572', 'execute if score #chapter ashen_story matches 3..', 'ashen:chapter/complete_2'],
  ['4023DB8FABB513BB', 'execute if score #wither ashen_story matches 1', 'ashen:quest/defeat_wither'],
  ['0903EA157C1241F6', 'execute if score #chapter ashen_story matches 4..', 'ashen:chapter/complete_3'],
  ['76ABE089AD500783', 'execute if score #dragon ashen_story matches 1', 'ashen:quest/defeat_dragon'],
  ['29BC3DE675DD5A67', 'execute if score #chapter ashen_story matches 5..', 'ashen:chapter/complete_4'],
  ['143E257A4F5E5F1D', 'execute if score #ignis ashen_story matches 1', 'ashen:quest/defeat_ignis'],
  ['16C217BE67395162', 'execute if score #chapter ashen_story matches 6..', 'ashen:chapter/complete_5']
];
function ashenRecoverStoryRewards(server, player) {
  var file = AshenStoryRewardFile.INSTANCE;
  if (!file) return;
  var team = file['getOrCreateTeamData(net.minecraft.world.entity.Entity)'](player);
  ASHEN_STORY_REWARD_RECOVERY.forEach(rule => {
    var reward = file.getReward(file.getID(rule[0]));
    if (!reward || !team.isCompleted(reward.getQuest())) return;
    if (!team.isRewardClaimed(player.uuid, reward)) team.claimReward(player, reward, false);
    // Commands are idempotent and retain their normal chapter prerequisites.
    // Reconcile an already-claimed unlock if quest progress was moved to a new world.
    if (team.isRewardClaimed(player.uuid, reward) && server.runCommandSilent(rule[1]) === 0) {
      server.runCommandSilent('function ' + rule[2]);
    }
  });
}
// RECOVERY_CALLBACKS: the native regression exercises the function above in Rhino.
PlayerEvents.loggedIn(event => ashenRecoverStoryRewards(event.server, event.player));
var ashenStoryRewardTicks = 0;
ServerEvents.tick(event => {
  if (++ashenStoryRewardTicks % 100 !== 0) return;
  event.server.players.forEach(player => ashenRecoverStoryRewards(event.server, player));
});
