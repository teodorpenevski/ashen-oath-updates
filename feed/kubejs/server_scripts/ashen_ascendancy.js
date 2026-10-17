// Free nodes and the separate four-point subclass budget are enforced server-side.
function ashenNetworkPlayer(player) {
  return String(player.getClass().getName()).indexOf('FakePlayer') < 0;
}
function ashenSpecialNodes(player) {
  var text = player.persistentData.getString('ashen_special_nodes');
  if (text) return JSON.parse(text);
  return player.persistentData.getBoolean('ashen_free_center_granted') ? ['ashen:awakening'] : [];
}
function ashenNativeSkill(id) {
  return AshenSkillsReloader.getSkillById(new AshenResourceLocation(id));
}
function ashenMainAllocated(owned) {
  var rules = global.ashenCombat;
  return rules.main_ids.filter(id => !!owned[id] && !Object.prototype.hasOwnProperty.call(rules.free_nodes, id)).length;
}
function ashenAscSpent(owned, selected) {
  var defs = global.ashenCombat.asc_nodes;
  return Object.keys(owned).filter(id => defs[id] && defs[id].subclass == selected && defs[id].cost == 1).length;
}
function ashenStarterClass(player) {
  var tags = player.getTags();
  if (tags.contains('ashen_class_change_pending')) return '';
  var matches = ['mage', 'ranger', 'warrior', 'rogue'].filter(cls => tags.contains('ashen_class_' + cls));
  return matches.length == 1 ? matches[0] : '';
}
function ashenReconcileBuild(player, server) {
  if (!ashenSkillsReady(player)) return;
  ashenRefreshSubclassStats(player);
  var rules = global.ashenCombat;
  var cap = AshenSkillsProvider.get(player);
  var owned = ashenLearned(player);
  var tracked = ashenSpecialNodes(player);
  var changed = false;
  var missing = tracked.filter(id => !owned[id]);
  if (missing.length) {
    // PST refunds every native entry, including grants from the other budget.
    cap.setSkillPoints(Math.max(0, cap.getSkillPoints() - missing.length));
    changed = true;
  }
  if (tracked.indexOf('ashen:awakening') >= 0 && !owned['ashen:awakening']) {
    ashenClearBloodRage(player);
    player.persistentData.putString('ashen_subclass', '');
    player.persistentData.remove('ashen_flurry_target');
    player.persistentData.remove('ashen_flurry_hits');
    player.persistentData.remove('ashen_flurry_until');
  }
  tracked = tracked.filter(id => !!owned[id]);
  var main = ashenMainAllocated(owned);
  var highest = Math.max(main, player.persistentData.getInt('ashen_asc_highest_main'));
  player.persistentData.putInt('ashen_asc_highest_main', highest);
  var earned = highest >= 20 ? 4 : (highest >= 10 ? 2 : 0);
  player.persistentData.putInt('ashen_asc_earned', earned);
  var selected = player.persistentData.getString('ashen_subclass');
  var starter = ashenStarterClass(player);
  if (selected && (!rules.subclasses[selected] || rules.subclasses[selected].class != starter)) {
    selected = ''; player.persistentData.putString('ashen_subclass', '');
  }
  var spent = 0;
  // Reject allocations in unchosen subclasses or beyond the four-point budget.
  // Native-paid fallback allocations are reimbursed into the main pool.
  Object.keys(owned).filter(id => rules.asc_nodes[id]).forEach(id => {
    var spec = rules.asc_nodes[id];
    var valid = spec.subclass == selected && rules.subclasses[spec.subclass].class == starter
      && spec.requires.every(parent => !!owned[parent]);
    if (spec.cost == 1 && valid) valid = ++spent <= earned;
    var wasTracked = tracked.indexOf(id) >= 0;
    if (!valid) {
      var skill = ashenNativeSkill(id);
      cap.getPlayerSkills().remove(skill);
      skill.remove(player);
      if (!wasTracked) cap.setSkillPoints(cap.getSkillPoints() + 1);
      delete owned[id];
      tracked = tracked.filter(key => key != id);
      changed = true;
    } else if (!wasTracked) {
      cap.setSkillPoints(cap.getSkillPoints() + 1);
      tracked.push(id);
      changed = true;
    }
  });
  var free = {};
  Object.keys(rules.free_nodes).forEach(id => free[id] = rules.free_nodes[id]);
  if (selected && rules.subclasses[selected]) {
    var subclass = rules.subclasses[selected];
    free[subclass.root] = ['ashen:' + subclass.class + '_0'];
  }
  Object.keys(free).forEach(id => {
    var eligible = free[id].every(parent => !!owned[parent]);
    var skill = ashenNativeSkill(id);
    if (!skill) return;
    if (eligible && !owned[id]) {
      cap.grantSkill(skill);
      skill.learn(player, true);
      owned[id] = true;
      tracked.push(id);
      changed = true;
    } else if (eligible) {
      if (tracked.indexOf(id) < 0) {
        cap.setSkillPoints(cap.getSkillPoints() + 1);
        tracked.push(id);
        changed = true;
      }
      skill.learn(player, false);
    } else if (owned[id]) {
      cap.getPlayerSkills().remove(skill);
      skill.remove(player);
      if (tracked.indexOf(id) < 0) cap.setSkillPoints(cap.getSkillPoints() + 1);
      tracked = tracked.filter(key => key != id);
      delete owned[id];
      changed = true;
    }
  });
  player.persistentData.putString('ashen_special_nodes', JSON.stringify(tracked));
  player.persistentData.putBoolean('ashen_free_center_granted', !!owned['ashen:awakening']);
  main = ashenMainAllocated(owned);
  var maxUnspent = Math.max(0, 70 - main);
  if (cap.getSkillPoints() > maxUnspent) {
    cap.setSkillPoints(maxUnspent);
    changed = true;
  }
  if (changed && ashenNetworkPlayer(player)) server.runCommandSilent('skilltree points set ' + player.username + ' ' + cap.getSkillPoints());
  spent = ashenAscSpent(owned, selected);
  // Include node identities: the open screen caches its own learned-skill list.
  var allocations = Object.keys(owned).filter(id => rules.asc_nodes[id]).sort();
  var projection = JSON.stringify({starter_class: starter, subclass: selected, earned: earned, spent: spent, main_allocated: main, highest_main: highest,
    allocations: JSON.stringify(allocations)});
  if (player.persistentData.getString('ashen_projection') != projection) {
    player.persistentData.putString('ashen_projection', projection);
    if (ashenNetworkPlayer(player)) player.sendData('ashen_asc_state', JSON.parse(projection));
  }
  ashenSyncColossus(player);
}

function ashenAllocateSubclassRequest(event) {
  var player = event.player;
  if (!ashenSkillsReady(player)) return;
  var id = String(event.data.node);
  var rules = global.ashenCombat;
  if (!Object.prototype.hasOwnProperty.call(rules.asc_nodes, id) || player.isSpectator()) return;
  ashenReconcileBuild(player, event.server);
  var spec = rules.asc_nodes[id];
  var selected = player.persistentData.getString('ashen_subclass');
  var owned = ashenLearned(player);
  if (rules.subclasses[spec.subclass].class != ashenStarterClass(player)) {
    player.tell('You can only allocate subclass nodes belonging to your chosen starter class.');
    return;
  }
  if (spec.kind == 'root') {
    if (selected && selected != spec.subclass) { player.tell('Use Memory of Renewal before changing subclass.'); return; }
    if (!owned['ashen:' + rules.subclasses[spec.subclass].class + '_0']) { player.tell('Allocate the matching class entry node first.'); return; }
    player.persistentData.putString('ashen_subclass', spec.subclass);
    ashenReconcileBuild(player, event.server);
    player.tell('Subclass selected: ' + rules.subclasses[spec.subclass].name + '.');
    return;
  }
  if (selected != spec.subclass) { player.tell('Choose this subclass through its free base first.'); return; }
  if (owned[id]) return;
  if (!spec.requires.every(parent => !!owned[parent])) { player.tell('Allocate the connected small passive first.'); return; }
  var earned = player.persistentData.getInt('ashen_asc_earned');
  if (ashenAscSpent(owned, selected) >= earned) { player.tell('Subclass points unlock at 10 and 20 main-tree allocations.'); return; }
  var nativeSkill = ashenNativeSkill(id);
  AshenSkillsProvider.get(player).grantSkill(nativeSkill);
  nativeSkill.learn(player, true);
  var tracked = ashenSpecialNodes(player);
  tracked.push(id);
  player.persistentData.putString('ashen_special_nodes', JSON.stringify(tracked));
  if (ashenNetworkPlayer(player)) event.server.runCommandSilent('skilltree points set ' + player.username + ' ' + AshenSkillsProvider.get(player).getSkillPoints());
  ashenReconcileBuild(player, event.server);
}
function ashenAllocateSubclass(event) {
  ashenAllocateSubclassRequest(event);
  var id = String(event.data.node);
  if (global.ashenCombat.asc_nodes[id] && ashenNetworkPlayer(event.player)) {
    event.player.sendData('ashen_asc_result', {node: id, allocated: !!ashenLearned(event.player)[id]});
  }
}
NetworkEvents.dataReceived('ashen_asc_allocate', ashenAllocateSubclass);
function ashenRefundRequest(player, server, id) {
  if (!ashenSkillsReady(player)) return false;
  var rules=global.ashenCombat,cap=AshenSkillsProvider.get(player);
  if (player.isSpectator()) return false;
  ashenReconcileBuild(player,server);
  var owned=ashenLearned(player),paid=rules.main_ids.filter(key=>!Object.prototype.hasOwnProperty.call(rules.free_nodes,key));
  var remove=[];
  if(id=='all') remove=Object.keys(owned).filter(key=>rules.main_ids.indexOf(key)>=0 || rules.asc_nodes[key]).filter(key=>key!='ashen:awakening');
  else {
    if(!owned[id] || (!rules.asc_nodes[id] && paid.indexOf(id)<0)) {player.tell('This node cannot be refunded directly.');return false;}
    if(Object.keys(owned).some(key=>rules.asc_nodes[key] && rules.asc_nodes[key].requires.indexOf(id)>=0)) {
      player.tell('Refund the connected subclass nodes first.');return false;
    }
    if(paid.indexOf(id)>=0 && !Java.loadClass('ashen.interop.AshenRefunds').connectedAfter(player,id,JSON.stringify(paid))) {
      player.tell('Refund the connected nodes first; this node supports another allocated passive.');return false;
    }
    remove=[id];
  }
  var returned=remove.filter(key=>paid.indexOf(key)>=0).length;
  remove.forEach(key=>{var skill=ashenNativeSkill(key);cap.getPlayerSkills().remove(skill);skill.remove(player);});
  var tracked=ashenSpecialNodes(player).filter(key=>remove.indexOf(key)<0);
  player.persistentData.putString('ashen_special_nodes',JSON.stringify(tracked));
  if(id=='all' || remove.some(key=>rules.asc_nodes[key] && rules.asc_nodes[key].kind=='root')) player.persistentData.putString('ashen_subclass','');
  cap.setSkillPoints(cap.getSkillPoints()+returned);
  player.persistentData.putString('ashen_projection','');
  ashenReconcileBuild(player,server);
  ashenUpdateRage(player,server);
  ashenClearBloodRage(player);
  ashenSyncEpicSkills(player);
  var major=Java.loadClass('ashen.interop.AshenMajorPassives');major.updateMana(player);major.updateDefenses(player);
  Java.loadClass('ashen.interop.AshenRefunds').sync(player);
  return true;
}
NetworkEvents.dataReceived('ashen_refund',event=>{
  if (!ashenSkillsReady(event.player)) return;
  var id=String(event.data.node),rules=global.ashenCombat;
  if(id!='all' && rules.main_ids.indexOf(id)<0 && !Object.prototype.hasOwnProperty.call(rules.asc_nodes,id)) return;
  var result=ashenRefundRequest(event.player,event.server,id),owned=ashenLearned(event.player),asc={};
  Object.keys(owned).filter(key=>rules.asc_nodes[key]).forEach(key=>asc[key]=true);
  event.player.sendData('ashen_refund_result',{refunded:result,allocations:JSON.stringify(Object.keys(owned)),
    points:AshenSkillsProvider.get(event.player).getSkillPoints(),starter_class:ashenStarterClass(event.player),
    subclass:event.player.persistentData.getString('ashen_subclass'),earned:event.player.persistentData.getInt('ashen_asc_earned'),
    spent:ashenAscSpent(owned,event.player.persistentData.getString('ashen_subclass')),main_allocated:ashenMainAllocated(owned),asc_allocations:JSON.stringify(asc)});
});
