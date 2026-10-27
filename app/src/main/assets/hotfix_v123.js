(function(){
'use strict';
if(window.__LEX_V123_COMPACT_ARCHIVE_UNDO__)return;
window.__LEX_V123_COMPACT_ARCHIVE_UNDO__='2026.07.18-v123-compact-archive-undo-redo';

var W=window,D=document;
var P=(function(){try{return typeof LS!=='undefined'?LS:'lex_v3_'}catch(e){return 'lex_v3_'}})();
var MAX_HISTORY=10;
var undoStack=[],redoStack=[];
var mapCache=null,mapCacheStamp='',stateCache=null,stateCacheUser='',lastUserKey='';
var baseRender=W.render||(typeof render==='function'?render:null);
var baseSaveKnown=W.saveKnown||(typeof saveKnown==='function'?saveKnown:null);

function text(v){return String(v==null?'':v)}
function byId(id){return D.getElementById(id)}
function uniq(a){var seen=Object.create(null),out=[];(a||[]).forEach(function(x){x=text(x);if(x&&!seen[x]){seen[x]=1;out.push(x)}});return out}
function norm(v){try{return text(v).toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}catch(e){return text(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}}
function cardId(w){
  if(w&&typeof w==='object'){
    var id=w.id!=null?text(w.id):'';
    if(!id){id='auto|'+norm([w.cat,w.__origCat,w.source,w.nl,w.read,w.root,w.tr,w.en,w.ar,w.ar_read,w.ru,w.ru_read].join('|'));try{w.id=id}catch(e){}}
    return id;
  }
  return text(w);
}
function emailRaw(){try{return text(profile&&profile.email||'').trim()}catch(e){return ''}}
function safeUser(){var e=emailRaw().toLowerCase();return e?e.replace(/[^a-z0-9_.@-]/g,'_'):'guest'}
function storageNames(kind){
  var e=emailRaw(),low=e.toLowerCase(),safe=safeUser(),out=[];
  if(kind==='archive')out=e?['archive_'+safe,'archive_'+low,'archive_'+e]:['archive_guest'];
  else out=e?['known_'+safe,'known_'+low,'known_'+e]:['known_guest','known_locked'];
  return uniq(out);
}
function canonicalName(kind){return kind==='archive'?'archive_'+safeUser():(emailRaw()?'known_'+safeUser():'known_guest')}
function readName(name,def){try{var raw=localStorage.getItem(P+name);return raw?JSON.parse(raw):def}catch(e){return def}}
function writeName(name,value){try{localStorage.setItem(P+name,JSON.stringify(value));return true}catch(e){return false}}
function removeName(name){try{localStorage.removeItem(P+name)}catch(e){}}
function allWordsArray(){try{return (typeof W.allWords==='function'?W.allWords():(typeof allWords==='function'?allWords():[]))||[]}catch(e){return []}}
function wordMap(){
  var a=allWordsArray(),len=a.length,stamp=len+'|'+(len?cardId(a[0]):'')+'|'+(len?cardId(a[len-1]):'');
  if(mapCache&&mapCacheStamp===stamp)return mapCache;
  var m=Object.create(null);
  for(var i=0;i<len;i++){var w=a[i],id=cardId(w);if(id&&!m[id])m[id]=w}
  mapCache=m;mapCacheStamp=stamp;return m;
}
function warmWordMap(){
  if(mapCache)return;
  var a=allWordsArray(),len=a.length,stamp=len+'|'+(len?cardId(a[0]):'')+'|'+(len?cardId(a[len-1]):''),m=Object.create(null),i=0;
  function step(){
    var end=Math.min(len,i+1400);for(;i<end;i++){var w=a[i],id=cardId(w);if(id&&!m[id])m[id]=w}
    if(i<len){try{if(typeof W.requestIdleCallback==='function')return W.requestIdleCallback(step,{timeout:180});}catch(e){}return setTimeout(step,0)}
    mapCache=m;mapCacheStamp=stamp;
  }
  step();
}
function leanWord(w){
  var o={},keys=['id','cat','catCode','source','__origCat','sourceId','nl','read','root','tr','en','ar','ar_read','ru','ru_read'];
  for(var i=0;i<keys.length;i++){var k=keys[i];if(w&&w[k]!=null)o[k]=w[k]}
  if(!o.id)o.id=cardId(w);
  return o;
}
function leanSnapshot(s,id){
  var w=s&&s.word?s.word:s;
  if(!w||typeof w!=='object')return null;
  var lw=leanWord(w);if(!lw.id)lw.id=id;
  return {t:(s&&s.t)||Date.now(),cat:lw.cat||lw.source||'',word:lw,screen:{cat:'',dir:''}};
}
function removeExampleStorage(){
  removeName('archive_extras_v114_'+safeUser());
  try{var prefix=P+'archive_extras_v114_';for(var i=localStorage.length-1;i>=0;i--){var k=localStorage.key(i);if(k&&k.indexOf(prefix)===0)localStorage.removeItem(k)}}catch(e){}
}
function collectStateRaw(){
  var order=[],snapshots={};
  storageNames('archive').forEach(function(name){
    var st=readName(name,{order:[],snapshots:{}})||{};
    if(Array.isArray(st.order))order=order.concat(st.order);
    Object.keys(st.snapshots||{}).forEach(function(id){if(!snapshots[id])snapshots[id]=st.snapshots[id]});
  });
  storageNames('known').forEach(function(name){var ids=readName(name,[]);if(Array.isArray(ids))order=order.concat(ids)});
  return {order:uniq(order.map(cardId)),snapshots:snapshots};
}
function compactSnapshots(order,sourceSnapshots,extraWords){
  /* All application and user cards remain in allWords(); keeping snapshots here would duplicate the full card set. */
  return {};
}
function clearAliases(kind,keep){storageNames(kind).forEach(function(name){if(name!==keep)removeName(name)})}
function invalidateRuntime(order){
  try{filtered=[];page=0;readPage=0}catch(e){}
  try{if(typeof idx!=='undefined'&&idx<0)idx=0}catch(e){}
  if(baseSaveKnown){
    try{baseSaveKnown.call(W,new Set(order))}catch(e){}
  }
  clearAliases('archive',canonicalName('archive'));
  clearAliases('known',canonicalName('known'));
}
function commitState(order,sourceSnapshots,extraWords){
  order=uniq((order||[]).map(cardId));
  removeExampleStorage();
  var archiveName=canonicalName('archive'),knownName=canonicalName('known');
  var compact={order:order,snapshots:compactSnapshots(order,sourceSnapshots,extraWords)};
  storageNames('archive').forEach(removeName);
  storageNames('known').forEach(removeName);
  var ok=writeName(archiveName,compact);
  if(!ok){
    removeExampleStorage();
    compact.snapshots={};
    ok=writeName(archiveName,compact);
  }
  if(!ok)return false;
  writeName(knownName,order);
  invalidateRuntime(order);
  writeName(archiveName,compact);
  writeName(knownName,order);
  clearAliases('archive',archiveName);clearAliases('known',knownName);
  lastUserKey=safeUser();stateCache={order:order.slice(),snapshots:compact.snapshots};stateCacheUser=lastUserKey;
  return true;
}
function migrateCompact(){
  stateCache=null;stateCacheUser='';
  var st=collectStateRaw();
  commitState(st.order,st.snapshots,{});
  stripArchiveExamples();
}
function ensureUserStorage(){var u=safeUser();if(lastUserKey!==u){lastUserKey=u;stateCache=null;stateCacheUser='';migrateCompact()}}
function stateNow(){ensureUserStorage();var u=safeUser();if(stateCache&&stateCacheUser===u)return stateCache;var st=collectStateRaw();stateCache={order:st.order.slice(),snapshots:st.snapshots};stateCacheUser=u;return stateCache}
function archivedSet(){var s=stateNow(),set=Object.create(null);s.order.forEach(function(id){set[id]=1});return set}
function archiveList(){
  var st=stateNow(),map=wordMap(),out=[];
  for(var i=0;i<st.order.length;i++){
    var id=st.order[i],snap=st.snapshots[id],w=map[id]||(snap&&snap.word);
    if(w){try{if(!w.id)w.id=id}catch(e){}out.push(w)}
  }
  return out;
}
function currentWord(){try{return typeof W.current==='function'?W.current():null}catch(e){return null}}
function notify(msg){try{(W.gold||W.msg||W.toast||function(){})(msg)}catch(e){}}
function clearSelection(){var s=W.__lexV110Select;if(s){s.active=false;s.all=false;s.ids=Object.create(null)}}
function selectedTargets(kind){
  var s=W.__lexV110Select,data=[];
  if(kind==='archive')data=archiveList();
  else try{data=(typeof W.selectedWords==='function'?W.selectedWords():[])||[]}catch(e){data=[]}
  if(!s)return [];
  if(s.all)return data.slice();
  return data.filter(function(w){return s.ids&&s.ids[cardId(w)]});
}
function pushHistory(op){
  if(!op||!op.ids||!op.ids.length)return;
  undoStack.push(op);if(undoStack.length>MAX_HISTORY)undoStack.shift();
  redoStack=[];updateUndoButtons();
}
function positionsFor(order,ids){var wanted=Object.create(null),pos=[];ids.forEach(function(id){wanted[id]=1});for(var i=0;i<order.length;i++){if(wanted[order[i]])pos.push(i)}return pos}
function removeIds(order,ids){var rm=Object.create(null);ids.forEach(function(id){rm[id]=1});return order.filter(function(id){return !rm[id]})}
function addFront(order,ids){var clean=removeIds(order,ids);return uniq(ids.concat(clean))}
function restoreAt(order,ids,positions){
  var out=removeIds(order,ids),pairs=[];
  for(var i=0;i<ids.length;i++)pairs.push({id:ids[i],p:positions&&positions[i]!=null?positions[i]:i});
  pairs.sort(function(a,b){return a.p-b.p});
  pairs.forEach(function(x){var p=Math.max(0,Math.min(Number(x.p)||0,out.length));out.splice(p,0,x.id)});
  return uniq(out);
}
function archiveWords(words,record,label){
  words=(words||[]).filter(Boolean);var st=stateNow(),present=Object.create(null),extra={};st.order.forEach(function(id){present[id]=1});
  var ids=[];words.forEach(function(w){var id=cardId(w);if(id&&!present[id]){present[id]=1;ids.push(id);extra[id]=w}});ids=uniq(ids);
  if(!ids.length)return false;
  if(!commitState(addFront(st.order,ids),st.snapshots,extra)){notify('Arşiv kaydı için cihaz depolama alanı yetersiz. İşlem uygulanmadı.');return false}
  if(record!==false)pushHistory({kind:'archive',ids:ids.slice(),snapshots:{}});
  if(label)notify(label);return true;
}
function restoreIds(ids,record,label,full){
  ids=uniq((ids||[]).map(cardId));if(!ids.length)return false;
  var st=stateNow(),present=Object.create(null),actual=[],snaps={};st.order.forEach(function(id){present[id]=1});
  ids.forEach(function(id){if(present[id]){actual.push(id);if(st.snapshots[id])snaps[id]=st.snapshots[id]}});if(!actual.length)return false;
  var positions=full?null:positionsFor(st.order,actual);
  if(!commitState(removeIds(st.order,actual),st.snapshots,{})){notify('Arşiv durumu kaydedilemedi. İşlem uygulanmadı.');return false}
  if(record!==false)pushHistory({kind:'restore',ids:actual.slice(),positions:positions,full:!!full,snapshots:snaps});
  if(label)notify(label);return true;
}
function applyHistory(op,undoing){
  var st=stateNow(),order=st.order.slice(),extra={};
  if(op.kind==='archive')order=undoing?removeIds(order,op.ids):addFront(order,op.ids);
  else if(op.kind==='restore'){
    if(undoing){
      if(op.full)order=uniq(op.ids.concat(removeIds(order,op.ids)));
      else order=restoreAt(order,op.ids,op.positions);
      Object.keys(op.snapshots||{}).forEach(function(id){extra[id]=(op.snapshots[id]&&op.snapshots[id].word)||op.snapshots[id]});
    }else order=removeIds(order,op.ids);
  }
  return commitState(order,st.snapshots,extra);
}
function rerenderAfterMutation(preferredIdx){
  try{filtered=[];if(typeof idx!=='undefined'&&preferredIdx!=null)idx=Math.max(0,Number(preferredIdx)||0)}catch(e){}
  try{if(W.__lexArchiveMode){var a=archiveList();if(!a.length){W.__lexArchiveMode=false;W.__lexArchiveView='card'}else if(Number(W.__lexArchiveIdx||0)>=a.length)W.__lexArchiveIdx=a.length-1}}catch(e){}
  try{W.render()}catch(e){try{render()}catch(_){}}
}
W.lexV123Undo=function(){
  var op=undoStack.pop();if(!op){updateUndoButtons();return}
  if(applyHistory(op,true)){redoStack.push(op);if(redoStack.length>MAX_HISTORY)redoStack.shift();notify('Son işlem geri alındı.');rerenderAfterMutation()}
  else undoStack.push(op);
  updateUndoButtons();
};
W.lexV123Redo=function(){
  var op=redoStack.pop();if(!op){updateUndoButtons();return}
  if(applyHistory(op,false)){undoStack.push(op);if(undoStack.length>MAX_HISTORY)undoStack.shift();notify('İşlem yeniden uygulandı.');rerenderAfterMutation()}
  else redoStack.push(op);
  updateUndoButtons();
};

W.markKnown=function(){
  var w=currentWord(),oldIdx=0;try{oldIdx=Number(idx)||0}catch(e){}
  if(!w)return;
  if(archiveWords([w],true,'Kart arşive alındı.'))rerenderAfterMutation(oldIdx);
};try{markKnown=W.markKnown}catch(e){}

W.lexV110ApplySelection=function(kind){
  var targets=selectedTargets(kind);
  if(!targets.length){notify('Seçili kelime yok.');return}
  var ok=kind==='archive'
    ?restoreIds(targets.map(cardId),true,'Seçilen kelime kartları arşivden çıkarıldı.',false)
    :archiveWords(targets,true,targets.length+' kelime kartı arşive aktarıldı.');
  if(ok){clearSelection();rerenderAfterMutation()}
};
W.lexV110ArchiveRestoreOne=function(i){var a=archiveList(),w=a[Math.max(0,Number(i)||0)];if(w&&restoreIds([cardId(w)],true,'Kart arşivden çıkarıldı.',false))rerenderAfterMutation()};
W.lexArchiveRestore=function(){var a=archiveList(),w=a[Math.max(0,Number(W.__lexArchiveIdx)||0)];if(w&&restoreIds([cardId(w)],true,'Kart arşivden çıkarıldı ve aktif desteye döndü.',false))rerenderAfterMutation()};
W.lexArchiveRestoreAll=function(){
  var run=function(){var st=stateNow();if(st.order.length&&restoreIds(st.order.slice(),true,'Arşivdeki tüm kartlar aktif desteye döndü.',true))rerenderAfterMutation()};
  try{if(typeof confirmAction==='function')return confirmAction('Arşivin tamamı çıkarılsın mı?','Arşivdeki tüm kelime kartları aktif kelime kartı ekranına dönecek.',run)}catch(e){}
  return run();
};
W.lexArchiveList=function(){return archiveList()};
W.knownSet=function(){return new Set(stateNow().order)};try{knownSet=W.knownSet}catch(e){}
W.isKnown=function(id){var s=archivedSet();return !!s[cardId(id)]};try{isKnown=W.isKnown}catch(e){}
W.saveKnown=function(set){
  var desired=uniq(Array.from(set||[]).map(cardId)),st=stateNow(),keep=Object.create(null),present=Object.create(null);
  desired.forEach(function(id){keep[id]=1});
  var order=st.order.filter(function(id){if(keep[id]){present[id]=1;return true}return false});
  desired.forEach(function(id){if(!present[id]){present[id]=1;order.push(id)}});
  return commitState(order,st.snapshots,{});
};try{saveKnown=W.saveKnown}catch(e){}

function installCss(){
  if(byId('lexV123Css'))return;
  var s=D.createElement('style');s.id='lexV123Css';s.textContent='\
#lexV123ArchiveExampleSentinel{display:none!important}\
body.lexV123ArchiveCard #view>.card.example,body.lexV123ArchiveCard #view>.lexV114ArchiveExamples{display:none!important}\
.lexV123UndoHost{position:relative!important}\
.lexV123UndoBar{position:absolute;right:8px;top:8px;z-index:8;display:flex;gap:3px;align-items:center}\
.lexV123UndoBtn{width:25px!important;height:23px!important;min-width:25px!important;padding:0!important;border-radius:8px!important;font-size:14px!important;line-height:1!important;background:rgba(6,18,36,.78)!important;border:1px solid rgba(169,190,216,.20)!important;color:#cbd5e1!important;box-shadow:none!important;opacity:.78}\
.lexV123UndoBtn:active{transform:none!important;background:rgba(24,55,88,.92)!important}\
.lexV123UndoBtn:disabled{opacity:.22!important;filter:none!important}\
.lexV123UndoHost>.badge:first-of-type{padding-right:62px!important}\
';D.head.appendChild(s);
}
function ensureSentinel(){
  var old=D.querySelector('#view #lexV114ArchiveExamples');if(old&&old.parentNode)old.parentNode.removeChild(old);
  if(!byId('lexV123ArchiveExampleSentinel')){
    var x=D.createElement('div');x.id='lexV123ArchiveExampleSentinel';x.setAttribute('aria-hidden','true');D.body.appendChild(x);
  }
  if(!byId('lexV114ArchiveExamples')){
    var y=D.createElement('div');y.id='lexV114ArchiveExamples';y.setAttribute('data-lex-v123-sentinel','1');y.setAttribute('aria-hidden','true');y.style.display='none';D.body.appendChild(y);
  }
}
function stripArchiveExamples(){
  var archiveCard=!!W.__lexArchiveMode&&W.__lexArchiveView!=='list';
  D.body.classList.toggle('lexV123ArchiveCard',archiveCard);
  if(!archiveCard)return;
  var view=byId('view');if(!view)return;
  var nodes=view.querySelectorAll('#lexV114ArchiveExamples,.lexV114ArchiveExamples,section.card.example');
  for(var i=0;i<nodes.length;i++){var n=nodes[i];if(n&&n.parentNode)n.parentNode.removeChild(n)}
  var sections=view.querySelectorAll('section.card');
  for(var j=0;j<sections.length;j++){
    var badge=sections[j].querySelector('.badge'),t=badge?text(badge.textContent):'';
    if(/örnek\s*cümle/i.test(t)&&sections[j].id!=='lexArchiveCard'&&sections[j].parentNode)sections[j].parentNode.removeChild(sections[j]);
  }
}
function injectUndoControls(){
  var hosts=D.querySelectorAll('#view #lexV110WordCard,#view .lexV110ListCard');
  for(var i=0;i<hosts.length;i++){
    var h=hosts[i];h.classList.add('lexV123UndoHost');
    var bar=null,children=h.children||[];for(var c=0;c<children.length;c++){if((' '+text(children[c].className)+' ').indexOf(' lexV123UndoBar ')>=0){bar=children[c];break}}
    if(!bar){
      bar=D.createElement('div');bar.className='lexV123UndoBar';bar.innerHTML='<button type="button" class="lexV123UndoBtn lexV123Undo" onclick="event.stopPropagation();lexV123Undo()" aria-label="Geri al" title="Geri al">↶</button><button type="button" class="lexV123UndoBtn lexV123Redo" onclick="event.stopPropagation();lexV123Redo()" aria-label="Yinele" title="Yinele">↷</button>';h.appendChild(bar);
    }
  }
  updateUndoButtons();
}
function updateUndoButtons(){
  var u=D.querySelectorAll('.lexV123Undo'),r=D.querySelectorAll('.lexV123Redo');
  for(var i=0;i<u.length;i++)u[i].disabled=!undoStack.length;
  for(var j=0;j<r.length;j++)r[j].disabled=!redoStack.length;
}
function postRender(){ensureSentinel();stripArchiveExamples();injectUndoControls()}
W.render=function(){var out=baseRender?baseRender.apply(this,arguments):undefined;postRender();try{requestAnimationFrame(postRender)}catch(e){setTimeout(postRender,0)}return out};try{render=W.render}catch(e){}

function boot(){
  installCss();ensureSentinel();postRender();
  var v=byId('view');if(v&&W.MutationObserver){try{new MutationObserver(function(){postRender()}).observe(v,{childList:true,subtree:false})}catch(e){}}
  var run=function(){migrateCompact();warmWordMap();postRender()};
  try{if(typeof W.requestIdleCallback==='function')W.requestIdleCallback(run,{timeout:1200});else setTimeout(run,350)}catch(e){setTimeout(run,350)}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
