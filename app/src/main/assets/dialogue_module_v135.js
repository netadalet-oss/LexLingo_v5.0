/* LexLingo Diyalog module v135 */
(function(W,D){
'use strict';
if(W.__LEX_DIALOG_V135__)return; W.__LEX_DIALOG_V135__=true;
var CAT='Diyalog',DATA=W.LEXLINGO_DIALOGUE_DATA||[],nativeSeq=0,currentNative=null;
function id(x){return D.getElementById(x)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function attr(s){return esc(s).replace(/\n/g,' ')}
function enc(s){try{return encodeURIComponent(String(s==null?'':s)).replace(/'/g,'%27')}catch(e){return ''}}
function nrm(s){try{return String(s||'').toLocaleLowerCase('nl-NL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9à-öø-ÿ'’-]+/gi,' ').replace(/’/g,"'").trim().split(/\s+/).filter(Boolean)}catch(e){return String(s||'').toLowerCase().split(/\s+/)}}
function modeNow(){try{return typeof mode!=='undefined'?mode:(W.mode||'learn')}catch(e){return W.mode||'learn'}}
function catNow(){try{return settings&&settings.cat?settings.cat:'ALL'}catch(e){return 'ALL'}}
function isDialog(){return catNow()===CAT}
function rate(){try{var x=localStorage.getItem((typeof LS!=='undefined'?LS:'lex_v3_')+'dialogRate');return x?Number(x):.85}catch(e){return .85}}
function say(text,r,btn){
  text=String(text||''); if(!text)return;
  try{if(typeof W.speakSafe==='function'&&(!r||Math.abs(r-rate())<.001)){W.speakSafe(enc(text),'nl-NL','dialog_'+Date.now(),btn||null);return}}catch(e){}
  try{var u=new SpeechSynthesisUtterance(text);u.lang='nl-NL';u.rate=r||rate();speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}
}
function doneKey(){try{return (typeof LS!=='undefined'?LS:'lex_v3_')+'dialogDone'}catch(e){return 'lex_v3_dialogDone'}}
function getDone(){try{return new Set(JSON.parse(localStorage.getItem(doneKey())||'[]'))}catch(e){return new Set()}}
function saveDone(s){try{localStorage.setItem(doneKey(),JSON.stringify(Array.from(s)))}catch(e){}}
function align(t,h){
 var n=t.length,m=h.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0)),op=Array.from({length:n+1},()=>Array(m+1).fill(''));
 for(var i=0;i<=n;i++){dp[i][0]=i;op[i][0]='del'} for(var j=0;j<=m;j++){dp[0][j]=j;op[0][j]='ins'} op[0][0]='';
 for(i=1;i<=n;i++)for(j=1;j<=m;j++){var same=t[i-1]===h[j-1],sub=dp[i-1][j-1]+(same?0:1),del=dp[i-1][j]+1,ins=dp[i][j-1]+1,b=Math.min(sub,del,ins);dp[i][j]=b;op[i][j]=b===sub?(same?'ok':'sub'):b===del?'del':'ins'}
 i=n;j=m;var a=[];while(i>0||j>0){var o=op[i][j];if(o==='ok'||o==='sub'){a.push({op:o,t:t[i-1],h:h[j-1]});i--;j--}else if(o==='del'){a.push({op:o,t:t[i-1],h:null});i--}else{a.push({op:'ins',t:null,h:h[j-1]});j--}}a.reverse();return {d:dp[n][m],a:a}
}
function css(){
 if(id('lexDialogCss'))return;var st=D.createElement('style');st.id='lexDialogCss';st.textContent=
 '.lexDialogHero .lexDialogTop{display:flex;align-items:center;justify-content:space-between;gap:8px}.lexDialogSearch{margin:8px 0}.lexDialogMeta{font-size:12px;color:var(--muted);margin:4px 0 8px}.lexDialogCard{margin-top:8px;padding:10px}.lexDialogCard[data-sp="Murat"]{border-left:4px solid #38bdf8}.lexDialogCard[data-sp="Martine"]{border-left:4px solid #f59e0b}.lexDialogCard[data-sp="Celine"]{border-left:4px solid #22c55e}.lexDialogCard[data-sp="Jolanda"]{border-left:4px solid #a855f7}.lexDialogSpeaker{font-weight:900;color:var(--gold2);font-size:12px}.lexDialogWords{display:flex;flex-wrap:wrap;gap:5px;margin:7px 0}.lexDialogWord{padding:5px 8px!important;border-radius:999px!important;font-size:12px!important;min-height:30px!important}.lexDialogWord.good{border-color:#22c55e!important;color:#86efac!important}.lexDialogWord.bad{border-color:#fb7185!important;color:#fda4af!important}.lexDialogSentence{font-size:calc(17px * var(--bodyUi,var(--ui,1)));line-height:1.48;font-weight:760;user-select:text;-webkit-user-select:text}.lexDialogSentenceRow{display:grid;grid-template-columns:1fr 34px 34px;gap:6px;align-items:start}.lexDialogMini{width:34px;height:34px;padding:0!important;border-radius:11px!important}.lexDialogTrans{margin-top:7px;padding:8px;border:1px dashed rgba(148,163,184,.3);border-radius:12px;cursor:pointer}.lexDialogTrans span{filter:blur(6px);opacity:.58;user-select:none}.lexDialogTrans.open span{filter:none;opacity:1;user-select:text}.lexDialogFeedback{display:none;margin-top:7px;padding:8px;border-radius:10px;font-size:12px}.lexDialogFeedback.show{display:block}.lexDialogFeedback.good{background:rgba(34,197,94,.12);color:#86efac}.lexDialogFeedback.warn{background:rgba(245,158,11,.12);color:#fcd34d}.lexDialogFeedback.bad{background:rgba(244,63,94,.12);color:#fda4af}.lexDialogHeard{margin-top:4px;color:#cbd5e1}.lexDialogReadControls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:7px}.lexDialogReadControls button{font-size:11px;padding:7px 4px}.lexDialogDone{opacity:.82}.lexDialogProgress{height:5px;background:rgba(148,163,184,.22);border-radius:999px;overflow:hidden;margin:6px 0 10px}.lexDialogProgress span{display:block;height:100%;background:linear-gradient(90deg,var(--cyan),var(--gold2))}@media(max-width:420px){.lexDialogSentence{font-size:15.5px}.lexDialogWord{font-size:11px!important}}';
 D.head.appendChild(st);
}
function wordsHtml(c){return (c.words||[]).map(function(w,i){return '<button class="ghost lexDialogWord" data-wi="'+i+'" onclick="lexDialogSayWord('+c.id+','+i+',this)">🔊 '+esc(w)+'</button>'}).join('')}
function card(c){
 return '<section class="card lexDialogCard'+(getDone().has(c.id)?' lexDialogDone':'')+'" id="lexDialog_'+c.id+'" data-sp="'+attr(c.speaker||'')+'"><div class="lexDialogSpeaker">'+esc(c.speaker||'')+' · '+c.id+'/'+DATA.length+'</div><div class="lexDialogWords">'+wordsHtml(c)+'</div><div class="lexDialogSentenceRow"><div class="lexDialogSentence" lang="nl-NL">'+esc(c.text)+'</div><button class="speaker lexDialogMini" onclick="lexDialogSay('+c.id+',this)" title="Cümleyi dinle"></button><button class="ghost lexDialogMini" onclick="lexDialogListen('+c.id+',this)" title="Ben okuyayım">🎙</button></div><div class="lexDialogReadControls"><button class="ghost" onclick="lexDialogSaySlow('+c.id+')">🐢 Yavaş</button><button class="ghost" onclick="lexDialogListen('+c.id+',this)">🎙 Ben okuyayım</button><button class="ghost" onclick="this.closest(\'.lexDialogCard\').querySelector(\'.lexDialogTrans\').classList.toggle(\'open\')">🇹🇷 Çeviri</button></div><div class="lexDialogTrans" onclick="this.classList.toggle(\'open\')">🇹🇷 <span>'+esc(c.tr||'')+'</span></div><div class="lexDialogFeedback" id="lexDialogFb_'+c.id+'"></div></section>'
}
function renderDialog(){
 css();var v=id('view');if(!v)return;var q='',onlyM=!!W.__lexDialogOnlyMurat;try{q=nrm((id('q')||{}).value||'').join(' ')}catch(e){}
 var arr=DATA.filter(function(c){if(onlyM&&c.speaker!=='Murat')return false;if(!q)return true;return nrm([c.text,c.tr,(c.words||[]).join(' ')].join(' ')).join(' ').indexOf(q)>=0});
 var done=getDone(),pct=Math.round(done.size/Math.max(1,DATA.length)*100);
 var h='<section class="card lexDialogHero"><span class="badge">Diyalog • Boekelo</span><div class="lexDialogTop"><div><b>Tanışma görüşmesi</b><div class="lexDialogMeta">'+DATA.length+' cümle • 506 kelime • nl-NL seslendirme ve okuma kontrolü</div></div><button class="ghost" onclick="lexDialogToggleMurat()">'+(onlyM?'Tümü':'Sadece Murat')+'</button></div><div class="lexDialogProgress"><span style="width:'+pct+'%"></span></div><div class="hint">'+done.size+'/'+DATA.length+' cümle doğru okundu. Her kelimeyi ayrı dinleyebilir, cümleyi dinleyebilir ve mikrofonla okuyabilirsiniz.</div></section>'+arr.map(card).join('');
 try{if(typeof moduleNav==='function')h+=moduleNav()}catch(e){}
 v.innerHTML=h;try{if(typeof updateHeaderMetrics==='function')updateHeaderMetrics()}catch(e){}
}
function feedback(cid,kind,msg){var e=id('lexDialogFb_'+cid);if(!e)return;e.className='lexDialogFeedback show '+kind;e.innerHTML=msg}
function evaluate(cid,heard){
 var c=DATA[cid-1];if(!c)return;var target=nrm(c.text),got=nrm(heard),r=align(target,got),card=id('lexDialog_'+cid);if(!card)return;
 card.querySelectorAll('.lexDialogWord').forEach(function(b){b.classList.remove('good','bad')});
 var ti=0,wrong=[];r.a.forEach(function(x){if(x.t!=null){var b=card.querySelector('.lexDialogWord[data-wi="'+ti+'"]');if(b){if(x.op==='ok')b.classList.add('good');else{b.classList.add('bad');wrong.push({w:x.t,b:b})}}ti++}});
 var score=Math.max(0,Math.round((1-r.d/Math.max(1,target.length))*100)),heardHtml='<div class="lexDialogHeard">Duyulan: <b>'+esc(heard||'-')+'</b> · '+score+'%</div>';
 if(r.d===0){var d=getDone();d.add(cid);saveDone(d);feedback(cid,'good','✅ Cümle doğru tanındı.'+heardHtml);card.classList.add('lexDialogDone')}
 else if(wrong.length===1&&r.d===1){feedback(cid,'warn','🟡 Tek kelimede fark algılandı: <b>'+esc(wrong[0].w)+'</b>. Doğrusu tekrar ediliyor.'+heardHtml);setTimeout(function(){say(wrong[0].w,.72,wrong[0].b)},300)}
 else feedback(cid,'bad','🔁 Birkaç fark algılandı. Kırmızı kelimeleri tek tek dinleyip tekrar deneyin.'+heardHtml)
}
W.lexDialogSayWord=function(cid,wi,btn){var c=DATA[cid-1],w=c&&c.words&&c.words[wi];if(w)say(w,.82,btn)};
W.lexDialogSay=function(cid,btn){var c=DATA[cid-1];if(c)say(c.text,rate(),btn)};
W.lexDialogSaySlow=function(cid){var c=DATA[cid-1];if(c)say(c.text,.68,null)};
W.lexDialogSpeechResult=function(cid,txt){evaluate(Number(cid),String(txt||''))};
W.lexDialogListen=function(cid,btn){
 feedback(cid,'warn','🎙 Dinliyorum… Cümleyi doğal şekilde Hollandaca okuyun.');
 var cb='lexDialogNativeResult'+(++nativeSeq);W[cb]=function(txt){try{evaluate(cid,String(txt||''))}finally{try{delete W[cb]}catch(e){}}};
 try{if(W.AndroidBridge&&typeof AndroidBridge.listen==='function'){AndroidBridge.listen('nl-NL',cb);return}}catch(e){}
 var R=W.SpeechRecognition||W.webkitSpeechRecognition;if(!R){feedback(cid,'bad','Bu cihazda konuşma tanıma desteği yok.');return}
 try{var r=new R();r.lang='nl-NL';r.interimResults=false;r.maxAlternatives=3;r.onresult=function(e){var best=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:'';evaluate(cid,best)};r.onerror=function(){feedback(cid,'bad','Konuşma tanıma çalışmadı. Mikrofon iznini kontrol edin.')};r.start()}catch(e){feedback(cid,'bad','Mikrofon başlatılamadı.')}
};
W.lexDialogToggleMurat=function(){W.__lexDialogOnlyMurat=!W.__lexDialogOnlyMurat;renderDialog()};
W.lexDialogRender=renderDialog;
function patch(){
 css();var oldCats=W.categories||(typeof categories==='function'?categories:null),oldRender=W.render||(typeof render==='function'?render:null),oldSet=W.setMode||(typeof setMode==='function'?setMode:null),oldCat=W.setCategory||(typeof setCategory==='function'?setCategory:null);
 if(oldCats&&!oldCats.__dialogWrapped){var f=function(){var a=[];try{a=oldCats.apply(this,arguments)||[]}catch(e){};if(a.indexOf(CAT)<0)a.push(CAT);return a};f.__dialogWrapped=1;W.categories=f;try{categories=f}catch(e){}}
 if(oldRender&&!oldRender.__dialogWrapped){var rr=function(){if(isDialog()&&modeNow()==='read'){renderDialog();try{if(typeof setActiveTab==='function')setActiveTab()}catch(e){};return}return oldRender.apply(this,arguments)};rr.__dialogWrapped=1;W.render=rr;try{render=rr}catch(e){}}
 if(oldSet&&!oldSet.__dialogWrapped){var ss=function(m){var r=oldSet.apply(this,arguments);if(isDialog()&&m==='read'){try{if(typeof mode!=='undefined')mode='read';else W.mode='read'}catch(e){};renderDialog()}return r};ss.__dialogWrapped=1;W.setMode=ss;try{setMode=ss}catch(e){}}
 if(oldCat&&!oldCat.__dialogWrapped){var cc=function(c){var r=oldCat.apply(this,arguments);if(c===CAT){setTimeout(function(){try{filtered=selectedWords();idx=0;page=0;readPage=0}catch(e){};try{W.render()}catch(e){}},0)}return r};cc.__dialogWrapped=1;W.setCategory=cc;try{setCategory=cc}catch(e){}}
 try{if(typeof applyFilter==='function')applyFilter();else if(W.applyFilter)W.applyFilter()}catch(e){}
}
function boot(){patch();setTimeout(patch,250);setTimeout(patch,900)}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window,document);
