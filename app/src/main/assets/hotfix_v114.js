(function(){
'use strict';
if(window.__LEX_V114_INTERACTION_ARCHIVE_TTS_FIX__)return;
window.__LEX_V114_INTERACTION_ARCHIVE_TTS_FIX__='2026.07.15-v115-targeted-safe';
var W=window,D=document,P=(function(){try{return typeof LS!=='undefined'?LS:'lex_v3_'}catch(e){return 'lex_v3_'}})();
function byId(id){return D.getElementById(id)}
function text(v){return String(v==null?'':v)}
function esc(v){return text(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function enc(v){try{return encodeURIComponent(text(v)).replace(/'/g,'%27')}catch(e){return ''}}
function dec(v){try{return decodeURIComponent(text(v))}catch(e){return text(v)}}
function raf(fn){try{requestAnimationFrame(fn)}catch(e){setTimeout(fn,0)}}
function modeNow(){try{return text(mode||'learn')}catch(e){return 'learn'}}
function userKey(){try{var e=profile&&profile.email?text(profile.email).toLowerCase().trim():'';return e?e.replace(/[^a-z0-9_.@-]/g,'_'):'guest'}catch(e){return 'guest'}}
function norm(v){try{return text(v).toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}catch(e){return text(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}}
function idOf(w){if(!w)return '';return text(w.id||('auto|'+norm([w.cat,w.__origCat,w.source,w.nl,w.read,w.root,w.tr,w.en,w.ar,w.ar_read,w.ru,w.ru_read].join('|'))))}
function activeWords(){try{return (typeof W.selectedWords==='function'?W.selectedWords():[]).slice()}catch(e){try{return (typeof selectedWords==='function'?selectedWords():[]).slice()}catch(_){return []}}}
function currentWord(){try{return typeof W.current==='function'?W.current():null}catch(e){try{return typeof current==='function'?current():null}catch(_){return null}}}
function archiveWords(){try{return typeof W.lexArchiveList==='function'?W.lexArchiveList().slice():[]}catch(e){return []}}
function clone(v){try{return JSON.parse(JSON.stringify(v))}catch(e){try{return Object.assign({},v)}catch(_){return v}}}
function categoryLabel(){var c='ALL';try{c=text(settings&&settings.cat||'ALL')}catch(e){}if(c==='ALL')return 'Tüm kategoriler';try{return typeof catName==='function'?text(catName(c)):c}catch(e){return c}}

/* Final ticker typography: every ticker descendant is regular weight. */
function installCss(){
  if(byId('lexV114Css'))return;
  var s=D.createElement('style');s.id='lexV114Css';s.textContent='\
.ticker,.ticker *,.ticker #tickerText,.ticker #tickerText *{font-weight:400!important;font-synthesis:none!important;-webkit-text-stroke:0!important;text-shadow:none!important}\
#tickerText b,#tickerText strong,#tickerText .v64Label,#tickerText .v8TickerLabel,#tickerText .v64Change,#tickerText .v64Arrow,#tickerText .v8Up,#tickerText .v8Down,#tickerText .v8Flat{font-weight:400!important}\
.lexCQJump,.v9EbookMenu,[data-lex-horizontal="1"]{overscroll-behavior-x:contain!important;scroll-snap-type:none!important;-webkit-overflow-scrolling:touch!important}\
.lexV114ArchiveExamples{margin-top:10px!important}.lexV114ArchiveExample{border:1px solid rgba(216,179,95,.25);border-radius:16px;padding:9px;margin:9px 0;background:rgba(15,23,42,.32)}\
.lexV114ArchiveLine{display:grid;grid-template-columns:32px 86px minmax(0,1fr);gap:7px;align-items:start;padding:7px 0;border-bottom:1px solid rgba(148,163,184,.14)}\
.lexV114ArchiveLine:last-child{border-bottom:0}.lexV114ArchiveLine .lexV114Label{font-size:11px;color:#cbd5e1;font-weight:700}.lexV114ArchiveLine .lexV114Value{user-select:text;-webkit-user-select:text;line-height:1.45;overflow-wrap:anywhere}.lexV114ArchiveLine .speaker{width:28px!important;height:28px!important}\
#scaleRange{-webkit-appearance:none!important;appearance:none!important;height:18px!important;min-height:18px!important;background:transparent!important;padding:0!important;margin:0!important}\
#scaleRange::-webkit-slider-runnable-track{height:3px!important;border-radius:999px!important;background:rgba(216,179,95,.38)!important;border:0!important}\
#scaleRange::-webkit-slider-thumb{-webkit-appearance:none!important;appearance:none!important;width:14px!important;height:14px!important;border-radius:50%!important;margin-top:-5.5px!important;background:#d8b35f!important;border:2px solid rgba(8,15,29,.92)!important;box-shadow:0 1px 5px rgba(0,0,0,.35)!important}\
#scaleRange:focus{outline:none!important}#scaleRange:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px rgba(216,179,95,.2),0 1px 5px rgba(0,0,0,.35)!important}.scaleGrid{gap:7px!important;padding-top:7px!important;padding-bottom:7px!important}\
.lexV110SelectBar.lexV114Busy{opacity:.9!important}.lexV110SelectBar.lexV114Busy button{pointer-events:none!important;opacity:.5!important}.lexV110SelectBar.lexV114Busy span{font-variant-numeric:tabular-nums!important}\
';D.head.appendChild(s)
}
function enforceTickerWeight(){try{var n=byId('tickerText');if(n){n.style.setProperty('font-weight','400','important');n.querySelectorAll('*').forEach(function(x){x.style.setProperty('font-weight','400','important')})}}catch(e){}}

/* Synchronous header/scale/category feedback. */
function syncScale(v){
  v=Math.max(10,Math.min(190,Number(v)||110));
  try{if(settings)settings.scale=v}catch(e){}
  try{if(localStorage.getItem(P+'scale')!==String(v))localStorage.setItem(P+'scale',String(v))}catch(e){}
  var t=byId('scaleText'),r=byId('scaleRange');if(t&&t.textContent!==v+'%')t.textContent=v+'%';if(r){r.min='10';r.max='190';if(r.value!==String(v))r.value=String(v)}
  var p=(v-10)/180,ui=(.95+p*.10).toFixed(3),card=(v/100).toFixed(3);var de=D.documentElement;
  de.style.setProperty('--ui',ui);de.style.setProperty('--bodyUi',ui);de.style.setProperty('--lexCardBodyUi',card);de.style.setProperty('--tight',(.94+p*.10).toFixed(3));
}
function syncHeader(){
  try{if(typeof W.updateHeaderMetrics==='function')W.updateHeaderMetrics();else if(typeof updateHeaderMetrics==='function')updateHeaderMetrics()}catch(e){}
  var c=byId('catBtn');if(c)c.textContent=categoryLabel();
  var v=110;try{v=Number(settings&&settings.scale||localStorage.getItem(P+'scale')||110)}catch(e){}
  var st=byId('scaleText'),sr=byId('scaleRange');if((st&&st.textContent!==v+'%')||(sr&&sr.value!==String(v))||D.documentElement.style.getPropertyValue('--lexCardBodyUi')!==(v/100).toFixed(3))syncScale(v);
  enforceTickerWeight();
}
function syncSoon(){syncHeader();raf(syncHeader)}
var baseScale=W.setScale||(typeof setScale==='function'?setScale:null);
W.setScale=function(v){var out;try{if(baseScale)out=baseScale.apply(this,arguments)}finally{syncScale(v);syncSoon()}return out};try{setScale=W.setScale}catch(e){}
var baseApply=W.applyFilter||(typeof applyFilter==='function'?applyFilter:null);
W.applyFilter=function(){var out;try{out=baseApply?baseApply.apply(this,arguments):undefined}finally{syncSoon()}return out};try{applyFilter=W.applyFilter}catch(e){}
var baseSetCat=W.setCategory||(typeof setCategory==='function'?setCategory:null);
W.setCategory=function(c){try{if(settings)settings.cat=c;localStorage.setItem(P+'cat',text(c))}catch(e){}var out=baseSetCat?baseSetCat.apply(this,arguments):undefined;syncSoon();return out};try{setCategory=W.setCategory}catch(e){}
D.addEventListener('click',function(ev){try{var t=ev.target&&ev.target.closest?ev.target.closest('.modalOpt,#catBtn,[onclick*="settings.cat"],[onclick*="setCategory"]'):null;if(t)setTimeout(syncSoon,0)}catch(e){}},false);

/* Preserve vertical position while list selection state changes. */
function restoreY(y){var run=function(){try{W.scrollTo(0,Math.max(0,Number(y)||0))}catch(e){}};raf(function(){run();raf(run)});setTimeout(run,80)}
function selectionObj(kind){var s=W.__lexV110Select||(W.__lexV110Select={kind:kind,active:false,ids:Object.create(null),all:false});if(s.kind!==kind){s.kind=kind;s.active=false;s.ids=Object.create(null);s.all=false}return s}
function selectionData(kind){return kind==='archive'?archiveWords():activeWords()}
function selectedCount(sel,data){if(sel.all)return data.length;var n=0;Object.keys(sel.ids||{}).forEach(function(k){if(sel.ids[k])n++});return n}
function updateSelectionUi(kind,id,selected){
  try{
    var row=D.querySelector('.lexV110Selectable[data-id="'+CSS.escape(id)+'"]');
    if(row){row.classList.toggle('lexV110Selected',!!selected);var cb=row.querySelector('input[type="checkbox"]');if(cb)cb.checked=!!selected}
    var bar=D.querySelector('.lexV110SelectBar');if(bar){var spans=bar.querySelectorAll('span');if(spans.length)spans[0].textContent='Seçilen: '+selectedCount(selectionObj(kind),selectionData(kind))}
  }catch(e){
    try{D.querySelectorAll('.lexV110Selectable').forEach(function(row){if(row.getAttribute('data-id')===id){row.classList.toggle('lexV110Selected',!!selected);var cb=row.querySelector('input[type="checkbox"]');if(cb)cb.checked=!!selected}})}catch(_){ }
  }
}
function setExplicitFromAll(sel,kind){if(!sel.all)return;sel.all=false;sel.ids=Object.create(null);selectionData(kind).forEach(function(w){sel.ids[idOf(w)]=1})}
var baseToggle=W.lexV110Toggle;
W.lexV110Toggle=function(kind,id){
  var sel=selectionObj(kind);sel.active=true;setExplicitFromAll(sel,kind);id=text(id);if(sel.ids[id])delete sel.ids[id];else sel.ids[id]=1;updateSelectionUi(kind,id,!!sel.ids[id]);syncSoon();
};
var baseListClick=W.lexV110ListClick;
W.lexV110ListClick=function(kind,index,ev){
  var sel=selectionObj(kind);if(sel.active){var w=selectionData(kind)[Math.max(0,Number(index)||0)];if(!w)return;setExplicitFromAll(sel,kind);var id=idOf(w);if(sel.ids[id])delete sel.ids[id];else sel.ids[id]=1;updateSelectionUi(kind,id,!!sel.ids[id]);return}
  return baseListClick?baseListClick.apply(this,arguments):undefined;
};
function preserveCall(name,delay){var old=W[name];if(typeof old!=='function')return;W[name]=function(){var y=W.scrollY||0,out=old.apply(this,arguments);restoreY(y);if(delay)setTimeout(function(){restoreY(y)},delay);return out}}
preserveCall('lexV110SelectPage',0);preserveCall('lexV110SelectAll',0);preserveCall('lexV110ExitSelection',0);preserveCall('lexV110ApplySelection',0);preserveCall('lexV110ArchiveRestoreOne',0);
var baseHold=W.lexV110HoldStart;if(typeof baseHold==='function')W.lexV110HoldStart=function(){var y=W.scrollY||0,out=baseHold.apply(this,arguments);setTimeout(function(){restoreY(y)},570);setTimeout(function(){restoreY(y)},700);return out};

/* Horizontal scrollers must not be interpreted as global previous/next swipe. */
var touch=null;
function scrollableXFrom(target){
  var el=target&&target.nodeType===1?target:target&&target.parentElement;
  while(el&&el!==D.body){
    try{var cs=getComputedStyle(el),ox=cs.overflowX;if((ox==='auto'||ox==='scroll')&&el.scrollWidth>el.clientWidth+2)return el;if(el.matches&&el.matches('.lexCQJump,.v9EbookMenu,[data-lex-horizontal="1"]'))return el}catch(e){}
    el=el.parentElement;
  }
  return null;
}
D.addEventListener('touchstart',function(e){var t=e.touches&&e.touches[0];if(!t){touch=null;return}var sc=scrollableXFrom(e.target);touch=sc?{x:t.clientX,y:t.clientY,el:sc}:null},true);
D.addEventListener('touchend',function(e){if(!touch)return;var t=e.changedTouches&&e.changedTouches[0],g=touch;touch=null;if(!t)return;var dx=t.clientX-g.x,dy=t.clientY-g.y;if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){try{e.stopImmediatePropagation()}catch(_){}try{e.stopPropagation()}catch(_){}}},true);
D.addEventListener('touchcancel',function(){touch=null},true);

/* Arabic TTS: prefer the actual Arabic voice, split long text into a stable queue, and use the stored Latin reading only as fallback. */
function hasArabic(v){return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text(v))}
function arabicKey(v){try{return text(v).normalize('NFKC').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g,'')}catch(e){return text(v).replace(/\s+/g,'')}}
var arabicReadCache=Object.create(null);
function arabicReadFor(v){
  var k=arabicKey(v);if(!k)return '';if(Object.prototype.hasOwnProperty.call(arabicReadCache,k))return arabicReadCache[k];
  var pools=[],cw=currentWord();function add(a){if(Array.isArray(a)&&a.length)pools.push(a)}
  if(cw)add([cw]);try{if(cw&&typeof W.__lexV15ExamplesFor==='function')add(W.__lexV15ExamplesFor(cw)||[])}catch(e){}
  try{if(cw&&typeof W.sourcePool==='function')add(W.sourcePool(cw)||[])}catch(e){}try{if(cw&&typeof sourcePool==='function')add(sourcePool(cw)||[])}catch(e){}
  add(archiveWords());add(activeWords());try{if(typeof W.selectedSources==='function')add(W.selectedSources()||[])}catch(e){}
  try{if(typeof W.allWords==='function')add(W.allWords()||[]);else if(typeof allWords==='function')add(allWords()||[])}catch(e){}
  try{if(typeof W.allSources==='function')add(W.allSources()||[]);else if(typeof allSources==='function')add(allSources()||[])}catch(e){}
  for(var pi=0;pi<pools.length;pi++){var a=pools[pi];for(var i=0;i<a.length;i++){var x=a[i];if(x&&arabicKey(x.ar||'')===k&&text(x.ar_read||'').trim()){arabicReadCache[k]=text(x.ar_read).trim();return arabicReadCache[k]}}}
  arabicReadCache[k]='';return '';
}
function splitSpeechText(v,max){
  v=text(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();max=Math.max(80,Number(max)||190);if(!v)return [];
  var parts=v.split(/(?<=[.!?؟؛،:;])\s+/),out=[];
  function pushPart(p){p=text(p).trim();while(p.length>max){var cut=p.lastIndexOf(' ',max);if(cut<Math.floor(max*.55))cut=max;out.push(p.slice(0,cut).trim());p=p.slice(cut).trim()}if(p)out.push(p)}
  parts.forEach(pushPart);return out;
}
var baseStopAudio114=W.stopAudio||(typeof stopAudio==='function'?stopAudio:null),arabicSpeech={token:0,key:'',btn:null,timer:0};
function clearArabicSpeech(){arabicSpeech.token++;arabicSpeech.key='';if(arabicSpeech.timer){clearInterval(arabicSpeech.timer);arabicSpeech.timer=0}if(arabicSpeech.btn)try{arabicSpeech.btn.classList.remove('playing','stop')}catch(e){}arabicSpeech.btn=null}
W.stopAudio=function(){clearArabicSpeech();try{return baseStopAudio114?baseStopAudio114.apply(this,arguments):undefined}catch(e){try{if(W.speechSynthesis)W.speechSynthesis.cancel()}catch(_){}}};try{stopAudio=W.stopAudio}catch(e){}
function arabicVoice(){try{var a=W.speechSynthesis&&speechSynthesis.getVoices?speechSynthesis.getVoices():[];return a.find(function(x){return /^ar[-_]sa$/i.test(text(x.lang))})||a.find(function(x){return /^ar([_-]|$)/i.test(text(x.lang))})||null}catch(e){return null}}
var baseSpeak114=W.speak||(typeof speak==='function'?speak:null);
function browserArabicSpeak(v,key,btn,fallback){
  try{
    if(!('speechSynthesis' in W)||typeof SpeechSynthesisUtterance==='undefined')return false;
    key=text(key||'arabic');if(arabicSpeech.key===key){W.stopAudio();return true}
    var chunks=splitSpeechText(v,190);if(!chunks.length)return false;
    W.stopAudio();var token=++arabicSpeech.token,pos=0,failed=false;arabicSpeech.key=key;arabicSpeech.btn=btn||null;
    if(btn)try{btn.classList.add('playing','stop')}catch(e){}
    arabicSpeech.timer=setInterval(function(){try{if(token===arabicSpeech.token&&speechSynthesis.paused)speechSynthesis.resume()}catch(e){}},5000);
    function finish(){if(token!==arabicSpeech.token)return;clearArabicSpeech()}
    function fallbackSpeak(){if(failed)return finish();failed=true;var rd=text(fallback).trim();finish();if(rd&&baseSpeak114)try{return baseSpeak114.call(W,rd,'tr-TR',key,btn)}catch(e){} }
    function next(){
      if(token!==arabicSpeech.token)return;if(pos>=chunks.length)return finish();
      var u=new SpeechSynthesisUtterance(chunks[pos++]);u.lang='ar-SA';u.rate=.80;u.pitch=1;var av=arabicVoice();if(av)u.voice=av;
      u.onend=function(){setTimeout(next,20)};u.onerror=fallbackSpeak;
      try{speechSynthesis.speak(u)}catch(e){fallbackSpeak()}
    }
    setTimeout(next,0);return true;
  }catch(e){return false}
}
if(typeof baseSpeak114==='function'){
  W.speak=function(v,lang,key,btn){
    v=text(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();lang=text(lang||'nl-NL');
    if(/^ar/i.test(lang)){
      if(v&&!hasArabic(v))return baseSpeak114.call(this,v,'tr-TR',key,btn);
      var rd=arabicReadFor(v);if(v&&browserArabicSpeak(v,key,btn,rd))return true;
      if(rd)return baseSpeak114.call(this,rd,'tr-TR',key,btn);
    }
    return baseSpeak114.call(this,v,lang,key,btn)
  };try{speak=W.speak}catch(e){}
}
var baseSpeakSafe114=W.speakSafe||(typeof speakSafe==='function'?speakSafe:null);
W.speakSafe=function(encoded,lang,key,btn){var v=dec(encoded||'');try{return W.speak(v,lang,key,btn)}catch(e){if(baseSpeakSafe114)return baseSpeakSafe114.apply(this,arguments)}};try{speakSafe=W.speakSafe}catch(e){}
var baseArabic=W.speakArabicSafe;
W.speakArabicSafe=function(encodedArabic,encodedRead,key,btn){
  var first=dec(encodedArabic||'').trim(),fallback=dec(encodedRead||'').trim();
  if(first&&!hasArabic(first))return W.speak(first,'tr-TR',key,btn);
  if(first&&hasArabic(first)){var rd=fallback||arabicReadFor(first);if(browserArabicSpeak(first,key,btn,rd))return true;if(rd)return W.speak(rd,'tr-TR',key,btn);return W.speak(first,'ar-SA',key,btn)}
  if(fallback)return W.speak(fallback,'tr-TR',key,btn);
  if(baseArabic)try{return baseArabic.apply(this,arguments)}catch(e){}
};try{speakArabicSafe=W.speakArabicSafe}catch(e){}


/* Archive complete card snapshots with examples, without blocking the list UI. */
function extrasKey(){return P+'archive_extras_v114_'+userKey()}
function extras(){try{var x=JSON.parse(localStorage.getItem(extrasKey())||'{}');return x&&typeof x==='object'?x:{}}catch(e){return {}}}
function saveExtras(x){try{localStorage.setItem(extrasKey(),JSON.stringify(x));return true}catch(e){return false}}
function emailRaw(){try{return text(profile&&profile.email||'').trim()}catch(e){return ''}}
function uniqIds(a){var s=Object.create(null),o=[];(a||[]).forEach(function(x){x=text(x);if(x&&!s[x]){s[x]=1;o.push(x)}});return o}
function storageNames(kind){var e=emailRaw(),low=e.toLowerCase(),safe=userKey(),out=[];if(kind==='archive'){if(e)out=['archive_'+safe,'archive_'+low,'archive_'+e];else out=['archive_guest']}else{if(e)out=['known_'+safe,'known_'+low,'known_'+e];else out=['known_guest','known_locked']}return uniqIds(out)}
function archiveStoreKey(){return P+storageNames('archive')[0]}
function readJsonName(name,def){try{var raw=localStorage.getItem(P+name);return raw?JSON.parse(raw):def}catch(e){return def}}
function readPrimaryArchive(){var order=[],snaps={};storageNames('archive').forEach(function(name){var x=readJsonName(name,{order:[],snapshots:{}})||{};order=order.concat(Array.isArray(x.order)?x.order:[]);Object.keys(x.snapshots||{}).forEach(function(id){if(!snaps[id])snaps[id]=x.snapshots[id]})});return {order:uniqIds(order),snapshots:snaps}}
function readAllKnown(st){var ids=[];storageNames('known').forEach(function(name){var x=readJsonName(name,[]);if(Array.isArray(x))ids=ids.concat(x)});ids=ids.concat(st&&st.order||[]);return uniqIds(ids)}
function examplesFor(w){
  var a=[];try{if(typeof W.__lexV15ExamplesFor==='function')a=W.__lexV15ExamplesFor(w)||[]}catch(e){}
  if(!a.length)try{if(typeof W.sourcePool==='function')a=W.sourcePool(w)||[]}catch(e){}
  if(!a.length)try{if(typeof sourcePool==='function')a=sourcePool(w)||[]}catch(e){}
  if(!a.length)try{var s=typeof W.sampleSource==='function'?W.sampleSource(w):(typeof sampleSource==='function'?sampleSource(w):null);if(s)a=[s]}catch(e){}
  var seen=Object.create(null),out=[];(Array.isArray(a)?a:[]).forEach(function(s){if(!s||typeof s!=='object')return;var k=idOf(s)||norm([s.ref,s.src,s.nl,s.tr,s.en,s.ar,s.ru].join('|'));if(!k||seen[k])return;seen[k]=1;out.push(clone(s))});return out.slice(0,6)
}
function makeSnapshot(w){if(!w)return null;var id=idOf(w);if(!id)return null;return {id:id,t:Date.now(),category:text(w.cat||w.source||''),direction:(function(){try{return text(settings&&settings.dir||'')}catch(e){return ''}})(),word:clone(w),examples:examplesFor(w)}}
function primaryShape(snap){return {t:snap.t||Date.now(),cat:snap.category||'',word:clone(snap.word||{}),examples:clone(snap.examples||[]),screen:{cat:snap.category||'',dir:snap.direction||''}}}
function writePrimaryArchive(st){try{localStorage.setItem(archiveStoreKey(),JSON.stringify(st));return true}catch(e){return false}}
function syncPrimaryArchiveSnapshots(snaps,force){
  snaps=(snaps||[]).filter(Boolean);if(!snaps.length)return true;var st=readPrimaryArchive(),added=[];
  snaps.forEach(function(snap){var exists=force||st.order.indexOf(snap.id)>=0||!!st.snapshots[snap.id];if(!exists)return;st.snapshots[snap.id]=primaryShape(snap);added.push(snap.id)});
  if(added.length)st.order=uniqIds(added.concat(st.order||[]));return writePrimaryArchive(st)
}
function primaryArchiveSnapshot(id){try{return readPrimaryArchive().snapshots[id]||null}catch(e){return null}}
function notify(v){try{(W.gold||W.msg||function(){})(v)}catch(e){}}
function scheduleSlice(fn){try{if(typeof W.requestIdleCallback==='function')return W.requestIdleCallback(fn,{timeout:80})}catch(e){}return setTimeout(fn,0)}
function setArchiveProgress(done,total){
  try{var bar=D.querySelector('.lexV110SelectBar');if(!bar)return;bar.classList.add('lexV114Busy');bar.setAttribute('aria-busy','true');var sp=bar.querySelector('span');if(sp)sp.textContent='Arşivleniyor: '+done+'/'+total;bar.querySelectorAll('button').forEach(function(b){b.disabled=true})}catch(e){}
}
function clearSelectionState(kind){var sel=W.__lexV110Select;if(sel&&sel.kind===kind){sel.active=false;sel.all=false;sel.ids=Object.create(null)}}
var archiveJob=null;
function archiveSelectionAsync(kind){
  if(archiveJob)return;var sel=W.__lexV110Select,data=activeWords();if(!sel||kind!=='list')return false;
  var targets=sel.all?data:data.filter(function(w){return sel.ids&&sel.ids[idOf(w)]});if(!targets.length){notify('Seçili kelime yok.');return true}
  var y=W.scrollY||0,startMode=modeNow(),st=readPrimaryArchive(),known=readAllKnown(st),knownMap=Object.create(null),added=[],pos=0,total=targets.length;
  known.forEach(function(id){knownMap[id]=1});archiveJob={kind:kind,total:total};setArchiveProgress(0,total);
  function step(){
    var began=Date.now(),count=0;
    while(pos<total&&count<5&&Date.now()-began<12){var w=targets[pos++],snap=makeSnapshot(w);count++;if(!snap)continue;if(!knownMap[snap.id]){knownMap[snap.id]=1;known.push(snap.id)}st.snapshots[snap.id]=primaryShape(snap);added.push(snap.id)}
    setArchiveProgress(pos,total);if(pos<total)return scheduleSlice(step);
    st.order=uniqIds(added.concat(st.order||[]));var ok=writePrimaryArchive(st);
    if(!ok){/* retry with only two examples on new snapshots if storage is tight */added.forEach(function(id){if(st.snapshots[id]&&Array.isArray(st.snapshots[id].examples))st.snapshots[id].examples=st.snapshots[id].examples.slice(0,2)});ok=writePrimaryArchive(st)}
    if(!ok){archiveJob=null;try{var bar=D.querySelector('.lexV110SelectBar');if(bar){bar.classList.remove('lexV114Busy');bar.removeAttribute('aria-busy');bar.querySelectorAll('button').forEach(function(b){b.disabled=false})}}catch(e){}notify('Arşiv kaydı için cihaz depolama alanı yetersiz. Hiçbir kart kaldırılmadı.');return}
    try{if(typeof W.saveKnown==='function')W.saveKnown(new Set(known));else localStorage.setItem(P+(userKey()==='guest'?'known_guest':'known_'+userKey()),JSON.stringify(known))}catch(e){}
    clearSelectionState(kind);archiveJob=null;
    try{filtered=activeWords();if(typeof idx!=='undefined'&&idx>=filtered.length)idx=Math.max(0,filtered.length-1)}catch(e){}
    notify(total+' kelime kartı örnek cümleleriyle arşive aktarıldı.');syncSoon();
    if(modeNow()===startMode&&!W.__lexArchiveMode){try{W.render()}catch(e){}}else restoreY(y)
  }
  scheduleSlice(step);return true
}
var baseMark=W.markKnown||(typeof markKnown==='function'?markKnown:null);
W.markKnown=function(){var snap=makeSnapshot(currentWord()),out=baseMark?baseMark.apply(this,arguments):undefined;if(snap)syncPrimaryArchiveSnapshots([snap],true);syncSoon();return out};try{markKnown=W.markKnown}catch(e){}
var baseApplySelection=W.lexV110ApplySelection;
if(typeof baseApplySelection==='function')W.lexV110ApplySelection=function(kind){if(kind==='list')return archiveSelectionAsync(kind);return baseApplySelection.apply(this,arguments)};
function deleteExtra(id){if(!id)return;var x=extras();if(x[id]){delete x[id];saveExtras(x)}}
var baseRestore=W.lexArchiveRestore;if(typeof baseRestore==='function')W.lexArchiveRestore=function(){var a=archiveWords(),w=a[Math.max(0,Number(W.__lexArchiveIdx)||0)];deleteExtra(idOf(w));var out=baseRestore.apply(this,arguments);syncSoon();return out};
var baseRestoreAll=W.lexArchiveRestoreAll;if(typeof baseRestoreAll==='function')W.lexArchiveRestoreAll=function(){try{localStorage.removeItem(extrasKey())}catch(e){}var out=baseRestoreAll.apply(this,arguments);syncSoon();return out};

function speakerHtml(value,lang,key,read){if(!value&&!read)return '';return '<button type="button" class="speaker" onclick="event.stopPropagation();lexV114Speak(\''+enc(value||read)+'\',\''+text(lang||'nl-NL')+'\',\''+enc(read||'')+'\',\''+text(key||'v114')+'\',this)">📣</button>'}
W.lexV114Speak=function(eText,lang,eRead,key,btn){var v=dec(eText),r=dec(eRead);if(/^ar/i.test(text(lang)))return W.speakArabicSafe(enc(v),enc(r),key,btn);try{return W.speakSafe(enc(v),lang,key,btn)}catch(e){return W.speak(v,lang,key,btn)}};
function archiveLine(label,value,lang,key,read){if(!value&&!read)return '';var rtl=/^ar/i.test(lang)&&hasArabic(value);return '<div class="lexV114ArchiveLine"><div>'+speakerHtml(value,lang,key,read)+'</div><div class="lexV114Label">'+esc(label)+'</div><div class="lexV114Value '+(rtl?'arabicText':'')+'" dir="'+(rtl?'rtl':'auto')+'">'+esc(value||read)+'</div></div>'}
function renderArchiveExtras(){
  try{
    if(!W.__lexArchiveMode||W.__lexArchiveView==='list')return;var card=byId('lexArchiveCard');if(!card||byId('lexV114ArchiveExamples'))return;
    var list=archiveWords(),w=list[Math.max(0,Number(W.__lexArchiveIdx)||0)];if(!w)return;var all=extras(),primary=primaryArchiveSnapshot(idOf(w)),legacy=all[idOf(w)],snap=primary||legacy||makeSnapshot(w);if(snap&&(!Array.isArray(snap.examples)||!snap.examples.length)&&legacy&&Array.isArray(legacy.examples)&&legacy.examples.length)snap.examples=legacy.examples;if(snap)syncPrimaryArchiveSnapshots([snap],true);var ex=snap&&Array.isArray(snap.examples)?snap.examples:[];
    var sec=D.createElement('section');sec.id='lexV114ArchiveExamples';sec.className='card example lexV114ArchiveExamples';
    var html='<span class="badge">Arşiv örnek cümleleri • '+ex.length+'</span>';
    if(!ex.length)html+='<div class="hint">Bu kart için kayıtlı örnek cümle bulunamadı.</div>';
    ex.forEach(function(s,i){var ref=s.ref||s.src||s.source||s.cat||'Kaynak';html+='<article class="lexV114ArchiveExample"><span class="badge">Örnek cümle '+(i+1)+'/'+ex.length+' • '+esc(ref)+'</span>';
      html+=archiveLine('Hollandaca',s.nl||'', 'nl-NL','v114nl'+i,s.read||'');
      if(s.read)html+=archiveLine('Okunuş',s.read,'nl-NL','v114read'+i,'');
      html+=archiveLine('Türkçe',s.tr||'', 'tr-TR','v114tr'+i,'');
      html+=archiveLine('İngilizce',s.en||'', 'en-US','v114en'+i,'');
      html+=archiveLine('Arapça',s.ar||'', 'ar-SA','v114ar'+i,s.ar_read||'');
      if(s.ar_read)html+=archiveLine('Arapça Okunuş',s.ar_read,'tr-TR','v114arr'+i,'');
      html+=archiveLine('Rusça',s.ru||'', 'ru-RU','v114ru'+i,s.ru_read||'');
      if(s.ru_read)html+=archiveLine('Rusça Okunuş',s.ru_read,'ru-RU','v114rur'+i,'');
      html+='</article>'});sec.innerHTML=html;card.insertAdjacentElement('afterend',sec)
  }catch(e){}
}
var baseRender=W.render;
W.render=function(){var sameMode=modeNow(),y=W.scrollY||0,hpos=[];try{D.querySelectorAll('.lexCQJump,.v9EbookMenu').forEach(function(n,i){hpos.push([i,n.scrollLeft])})}catch(e){}var out=baseRender?baseRender.apply(this,arguments):undefined;try{renderArchiveExtras()}catch(e){}raf(function(){try{if(modeNow()===sameMode){D.querySelectorAll('.lexCQJump,.v9EbookMenu').forEach(function(n,i){if(hpos[i])n.scrollLeft=hpos[i][1]})}}catch(e){}enforceTickerWeight()});return out};try{render=W.render}catch(e){}

function boot(){installCss();syncSoon();enforceTickerWeight();renderArchiveExtras();try{new MutationObserver(function(m){var ticker=false,archive=false;m.forEach(function(x){if(x.target===byId('tickerText')||(x.target&&x.target.closest&&x.target.closest('#tickerText')))ticker=true;if(x.target===byId('view')||(x.target&&x.target.closest&&x.target.closest('#view')))archive=true});if(ticker)enforceTickerWeight();if(archive)renderArchiveExtras()}).observe(D.body,{childList:true,subtree:true,characterData:true})}catch(e){}}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* ===== LexLingo V116: 100-word category-scoped list + non-blocking bulk archive ===== */
(function(){
'use strict';
if(window.__LEX_V116_LIST_ARCHIVE_CATEGORY_FIX__)return;
window.__LEX_V116_LIST_ARCHIVE_CATEGORY_FIX__='2026.07.15-v116-list-100-category-async-archive';
var W=window,D=document,P=(function(){try{return typeof LS!=='undefined'?LS:'lex_v3_'}catch(e){return 'lex_v3_'}})();
var PAGE_SIZE=100,archiveBusy=false;
function txt(v){return String(v==null?'':v)}
function modeNow116(){try{return txt(mode||'learn')}catch(e){return 'learn'}}
function norm116(v){try{return txt(v).toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}catch(e){return txt(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}}
function id116(w){if(!w)return '';return txt(w.id||('auto|'+norm116([w.cat,w.__origCat,w.source,w.nl,w.read,w.root,w.tr,w.en,w.ar,w.ar_read,w.ru,w.ru_read].join('|'))))}
function selectedCat116(){try{return txt(settings&&settings.cat||'ALL')}catch(e){return 'ALL'}}
function catOf116(w){return txt(w&&(w.cat||w.__origCat||w.source)||'')}
function canonCat116(v){try{if(typeof W.canonicalCatName==='function')return txt(W.canonicalCatName(v))}catch(e){}try{if(typeof canonicalCatName==='function')return txt(canonicalCatName(v))}catch(e){}try{if(typeof W.canon==='function')return txt(W.canon(v))}catch(e){}try{if(typeof canon==='function')return txt(canon(v))}catch(e){}return norm116(v)}
function catEq116(a,b){try{if(typeof W.catEq==='function')return !!W.catEq(a,b)}catch(e){}try{if(typeof catEq==='function')return !!catEq(a,b)}catch(e){}return canonCat116(a)===canonCat116(b)}
function categoryScope116(arr){arr=Array.isArray(arr)?arr:[];var c=selectedCat116();if(c==='ALL'||!c)return arr.slice();return arr.filter(function(w){return w&&catEq116(catOf116(w),c)})}
var baseSelected116=W.selectedWords||(typeof selectedWords==='function'?selectedWords:null);
W.selectedWords=function(){var a=[];try{a=baseSelected116?baseSelected116.apply(this,arguments):[]}catch(e){a=[]}a=Array.isArray(a)?a.slice():[];return modeNow116()==='list'?categoryScope116(a):a};
try{selectedWords=W.selectedWords}catch(e){}
function listWords116(){try{return categoryScope116((W.selectedWords?W.selectedWords():[])||[])}catch(e){return []}}
function getPage116(){try{return Math.max(0,Number(page)||0)}catch(e){return 0}}
function setPage116(v){try{page=Math.max(0,Number(v)||0)}catch(e){}}
function raf116(fn){try{return requestAnimationFrame(fn)}catch(e){return setTimeout(fn,0)}}
function restoreY116(y){raf116(function(){try{W.scrollTo(0,Math.max(0,Number(y)||0))}catch(e){}})}
function resetSelection116(){var s=W.__lexV110Select;if(s&&s.kind==='list'){s.active=false;s.all=false;s.ids=Object.create(null)}}
function categoryLabel116(){var c=selectedCat116();if(c==='ALL')return 'Tüm kategoriler';try{return typeof catName==='function'?txt(catName(c)):c}catch(e){return c}}
function fixListMeta116(){
  try{
    if(modeNow116()!=='list')return;
    var arr=listWords116(),pages=Math.max(1,Math.ceil(arr.length/PAGE_SIZE)),p=Math.min(getPage116(),pages-1);setPage116(p);
    var box=D.querySelector('.lexV110ListCard .listPage');if(box){var spans=box.querySelectorAll('span');if(spans[0])spans[0].textContent=(p+1)+'/'+pages+' • '+arr.length+' kelime';if(spans[1])spans[1].textContent="100'lü sayfa"}
    var badge=D.querySelector('.lexV110ListCard .badge');if(badge)badge.textContent='Liste • '+categoryLabel116();
  }catch(e){}
}
W.lexV112ListPageSize=PAGE_SIZE;W.lexV116ListPageSize=PAGE_SIZE;
var baseListPage116=W.lexV110ListPage;
W.lexV110ListPage=function(p){
  if(modeNow116()!=='list')return baseListPage116?baseListPage116.apply(this,arguments):undefined;
  var a=listWords116(),pages=Math.max(1,Math.ceil(a.length/PAGE_SIZE)),n=Math.max(0,Math.min(Number(p)||0,pages-1));setPage116(n);
  var out=baseListPage116?baseListPage116.call(this,n):(W.render?W.render():undefined);raf116(fixListMeta116);return out
};
var baseSelectPage116=W.lexV110SelectPage;
W.lexV110SelectPage=function(kind){
  if(kind!=='list')return baseSelectPage116?baseSelectPage116.apply(this,arguments):undefined;
  var y=W.scrollY||0,s=W.__lexV110Select||(W.__lexV110Select={kind:'list',active:false,ids:Object.create(null),all:false});
  if(s.kind!=='list'){s.kind='list';s.ids=Object.create(null);s.all=false}s.active=true;s.all=false;s.ids=Object.create(null);
  var a=listWords116(),p=getPage116();a.slice(p*PAGE_SIZE,p*PAGE_SIZE+PAGE_SIZE).forEach(function(w){s.ids[id116(w)]=1});
  var out=W.render?W.render():undefined;restoreY116(y);raf116(fixListMeta116);return out
};
var baseApplyFilter116=W.applyFilter||(typeof applyFilter==='function'?applyFilter:null);
W.applyFilter=function(){if(modeNow116()==='list'){setPage116(0);resetSelection116()}var out=baseApplyFilter116?baseApplyFilter116.apply(this,arguments):(W.render?W.render():undefined);raf116(fixListMeta116);return out};
try{applyFilter=W.applyFilter}catch(e){}
var baseSetCategory116=W.setCategory||(typeof setCategory==='function'?setCategory:null);
W.setCategory=function(c){if(modeNow116()==='list'){setPage116(0);resetSelection116()}var out=baseSetCategory116?baseSetCategory116.apply(this,arguments):undefined;raf116(fixListMeta116);return out};
try{setCategory=W.setCategory}catch(e){}
var baseRender116=W.render;
W.render=function(){var out=baseRender116?baseRender116.apply(this,arguments):undefined;if(modeNow116()==='list')raf116(fixListMeta116);return out};
try{render=W.render}catch(e){}
D.addEventListener('click',function(ev){try{var t=ev.target&&ev.target.closest?ev.target.closest('.modalOpt,[onclick*="settings.cat"],[onclick*="setCategory"]'):null;if(t)setTimeout(function(){if(modeNow116()==='list'){setPage116(0);resetSelection116();try{W.render()}catch(e){}fixListMeta116()}},90)}catch(e){}},false);

function userKey116(){try{var e=profile&&profile.email?txt(profile.email).toLowerCase().trim():'';return e?e.replace(/[^a-z0-9_.@-]/g,'_'):'guest'}catch(e){return 'guest'}}
function extrasKey116(){return P+'archive_extras_v114_'+userKey116()}
function readExtras116(){try{var x=JSON.parse(localStorage.getItem(extrasKey116())||'{}');return x&&typeof x==='object'?x:{}}catch(e){return {}}}
function writeExtras116(x){try{localStorage.setItem(extrasKey116(),JSON.stringify(x));return true}catch(e){return false}}
function cloneWord116(w){var o={};['id','cat','catCode','source','__origCat','sourceId','nl','read','root','en','tr','ar','ar_read','ru','ru_read'].forEach(function(k){if(w&&w[k]!=null)o[k]=w[k]});return o}
function compactSource116(s){var o={};['id','cat','source','ref','src','nl','read','en','tr','ar','ar_read','ru','ru_read'].forEach(function(k){if(s&&s[k]!=null)o[k]=s[k]});return o}
function sourceLength116(s){var n=0;['nl','read','en','tr','ar','ar_read','ru','ru_read'].forEach(function(k){n+=txt(s&&s[k]).length});return n}
function sourceKey116(s){return txt((s&&(s.id||s.ref||s.src))||'')+'|'+norm116(s&&s.nl)+'|'+canonCat116(catOf116(s))}
function isA0A2116(c){return /A0\s*[-–—/]?\s*A2|Temel\s*Kelimeler/i.test(txt(c))}
function exactKeys116(w){var v=txt(w&&w.sourceId).trim(),out=[];if(v)out.push(v);var m=v.match(/^(\d{1,3})[:\-](\d{1,3})$/);if(m){var a=('000'+m[1]).slice(-3),b=('000'+m[2]).slice(-3);out.push('QURALL-S'+a+'-A'+b);out.push('S'+a+'-A'+b)}return out}
function term116(w){var t=txt(w&&w.nl).trim();if(!t)try{var pc=typeof primaryCode==='function'?primaryCode():'NL';t=typeof fieldByLang==='function'?txt(fieldByLang(w,pc)):''}catch(e){}return norm116(t)}
function token116(t){var a=txt(t).split(' ').filter(function(x){return x.length>1});a.sort(function(x,y){return y.length-x.length});return a[0]||''}
function addCandidate116(ctx,s,exact){if(!ctx||!s)return;var k=sourceKey116(s);if(!k||ctx.seen[k])return;var len=sourceLength116(s);if(!exact&&len>14000)return;ctx.seen[k]=1;ctx.candidates.push({exact:!!exact,len:len,source:compactSource116(s)});ctx.candidates.sort(function(a,b){if(a.exact!==b.exact)return a.exact?-1:1;return a.len-b.len});if(ctx.candidates.length>10)ctx.candidates.length=10}
function finalExamples116(ctx){var out=[],budget=30000;ctx.candidates.sort(function(a,b){if(a.exact!==b.exact)return a.exact?-1:1;return a.len-b.len});for(var i=0;i<ctx.candidates.length&&out.length<6;i++){var c=ctx.candidates[i];if(out.length&&c.len>budget)continue;out.push(c.source);budget-=Math.min(c.len,budget)}return out}
function allSources116(){try{return (typeof W.allSources==='function'?W.allSources():(typeof allSources==='function'?allSources():[])).slice()}catch(e){try{return (typeof W.packSources==='function'?W.packSources():[]).slice()}catch(_){return []}}}
function schedule116(fn){try{if(typeof W.requestIdleCallback==='function')return W.requestIdleCallback(fn,{timeout:90})}catch(e){}return setTimeout(function(){fn(null)},0)}
function progress116(label,done,total){try{var bar=D.querySelector('.lexV110SelectBar');if(!bar)return;bar.classList.add('lexV114Busy');bar.setAttribute('aria-busy','true');var sp=bar.querySelector('span');if(sp)sp.textContent=label+': '+done+'/'+total;bar.querySelectorAll('button').forEach(function(b){b.disabled=true})}catch(e){}}
function unlock116(){try{var bar=D.querySelector('.lexV110SelectBar');if(bar){bar.classList.remove('lexV114Busy');bar.removeAttribute('aria-busy');bar.querySelectorAll('button').forEach(function(b){b.disabled=false})}}catch(e){}}
function notify116(v){try{(W.gold||W.msg||function(){})(v)}catch(e){}}
function knownSet116(){try{if(typeof W.knownSet==='function')return new Set(Array.from(W.knownSet()||[]))}catch(e){}return new Set()}
function bulkArchive116(){
  if(archiveBusy)return true;
  var sel=W.__lexV110Select,data=listWords116();if(!sel||sel.kind!=='list')return false;
  var targets=sel.all?data:data.filter(function(w){return sel.ids&&sel.ids[id116(w)]});if(!targets.length){notify116('Seçili kelime yok.');return true}
  archiveBusy=true;var y=W.scrollY||0,startMode=modeNow116(),category=selectedCat116(),sources=allSources116(),contexts=[],exactMap=Object.create(null),tokenMap=Object.create(null);
  targets.forEach(function(w){var c={id:id116(w),word:w,cat:canonCat116(catOf116(w)),term:term116(w),token:'',allowAll:isA0A2116(catOf116(w)),seen:Object.create(null),candidates:[]};c.token=token116(c.term);contexts.push(c);exactKeys116(w).forEach(function(k){(exactMap[k]||(exactMap[k]=[])).push(c)});if(c.token)(tokenMap[c.token]||(tokenMap[c.token]=[])).push(c)});
  var pos=0,total=sources.length,lastUi=0;
  progress116('Örnekler taranıyor',0,total);
  function scan(deadline){
    var began=Date.now(),handled=0;
    try{
      while(pos<total&&handled<55&&(handled<8||Date.now()-began<9)){var s=sources[pos++];handled++;if(!s)continue;var vals=[s.id,s.ref,s.src];for(var vi=0;vi<vals.length;vi++){var hit=exactMap[txt(vals[vi]).trim()];if(hit)hit.forEach(function(c){addCandidate116(c,s,true)})}
        var sc=canonCat116(catOf116(s)),sn=norm116(s.nl||'');if(!sn)continue;var parts=sn.split(' '),seenCtx=Object.create(null);for(var pi=0;pi<parts.length;pi++){var list=tokenMap[parts[pi]];if(!list)continue;for(var li=0;li<list.length;li++){var c=list[li];if(seenCtx[c.id]||c.candidates.length>=10)continue;if(!c.allowAll&&c.cat!==sc)continue;if((' '+sn+' ').indexOf(' '+c.term+' ')<0)continue;seenCtx[c.id]=1;addCandidate116(c,s,false)}}}
    }catch(e){archiveBusy=false;unlock116();notify116('Arşiv aktarımı sırasında örnek cümle taraması tamamlanamadı.');return}
    if(pos-lastUi>=250||pos>=total){lastUi=pos;progress116('Örnekler taranıyor',pos,total)}
    if(pos<total)return schedule116(scan);
    schedule116(save);
  }
  function save(){
    var extras=readExtras116(),now=Date.now(),direction='';try{direction=txt(settings&&settings.dir||'')}catch(e){}
    contexts.forEach(function(c){extras[c.id]={id:c.id,t:now,category:catOf116(c.word),direction:direction,word:cloneWord116(c.word),examples:finalExamples116(c)}});
    progress116('Arşive kaydediliyor',0,targets.length);
    var ok=writeExtras116(extras);
    if(!ok){contexts.forEach(function(c){if(extras[c.id]&&Array.isArray(extras[c.id].examples))extras[c.id].examples=extras[c.id].examples.slice(0,2)});ok=writeExtras116(extras)}
    if(!ok){archiveBusy=false;unlock116();notify116('Cihaz depolaması yetersiz olduğu için kartlar arşive aktarılmadı.');return}
    var known=knownSet116();contexts.forEach(function(c){known.add(c.id)});
    try{if(typeof W.saveKnown==='function')W.saveKnown(known);else localStorage.setItem(P+(userKey116()==='guest'?'known_guest':'known_'+userKey116()),JSON.stringify(Array.from(known)))}catch(e){archiveBusy=false;unlock116();notify116('Arşiv durumu kaydedilemedi.');return}
    sel.active=false;sel.all=false;sel.ids=Object.create(null);archiveBusy=false;unlock116();
    try{filtered=listWords116();if(typeof idx!=='undefined'&&idx>=filtered.length)idx=Math.max(0,filtered.length-1)}catch(e){}
    var withExamples=contexts.filter(function(c){return finalExamples116(c).length>0}).length;
    notify116(targets.length+' kelime kartı arşive aktarıldı; '+withExamples+' kartın örnek cümleleri kaydedildi.');
    raf116(function(){if(modeNow116()===startMode&&!W.__lexArchiveMode&&selectedCat116()===category){try{W.render()}catch(e){}}else restoreY116(y)});
  }
  schedule116(scan);return true
}
var baseApplySelection116=W.lexV110ApplySelection;
W.lexV110ApplySelection=function(kind){if(kind==='list')return bulkArchive116();return baseApplySelection116?baseApplySelection116.apply(this,arguments):undefined};
fixListMeta116();
})();
