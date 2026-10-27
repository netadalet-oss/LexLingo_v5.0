(function(){
  'use strict';
  if(window.__LEX_V113_RESUME_PERFORMANCE__)return;
  window.__LEX_V113_RESUME_PERFORMANCE__='2026.07.15-v113-module-resume-single-boot';

  var W=window,D=document,P='lex_v3_',saveTimer=0,scrollTimer=0,transitioning=false,rendering=false,lastRestored=null;

  function modeNow(){try{return String(typeof mode!=='undefined'?mode:'learn')}catch(e){return 'learn'}}
  function setModeVar(v){try{mode=v}catch(e){try{W.mode=v}catch(_){}}}
  function num(v,d){v=Number(v);return Number.isFinite(v)?v:(d||0)}
  function getIdx(){try{return Math.max(0,num(idx,0))}catch(e){return 0}}
  function setIdx(v){try{idx=Math.max(0,num(v,0))}catch(e){}}
  function getPage(){try{return Math.max(0,num(page,0))}catch(e){return 0}}
  function setPage(v){try{page=Math.max(0,num(v,0))}catch(e){}}
  function getReadPage(){try{return Math.max(0,num(readPage,0))}catch(e){return 0}}
  function setReadPage(v){try{readPage=Math.max(0,num(v,0))}catch(e){}}
  function setExpanded(v){try{expanded=!!v}catch(e){}}
  function email(){try{return String((profile&&profile.email)||localStorage.getItem(P+'email')||'').trim()}catch(e){return ''}}
  function safeUser(){var s=email().toLowerCase();return s?s.replace(/[^a-z0-9_.@-]/g,'_'):'guest'}
  function rootKey(user){return P+'resume_v113_'+(user||safeUser())}
  function legacyKey(user){return P+'last_card_v110_'+(user||safeUser())}
  function readJSON(key,d){try{var x=localStorage.getItem(key);return x?JSON.parse(x):d}catch(e){return d}}
  function writeJSON(key,v){try{localStorage.setItem(key,JSON.stringify(v));return true}catch(e){return false}}
  function normalize(s){try{if(typeof W.norm==='function')return W.norm(s)}catch(e){}try{return String(s||'').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}catch(e){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}}
  function cardId(x){if(!x)return '';var id=x.id!=null?String(x.id):'';return id||('auto|'+normalize([x.cat,x.__origCat,x.source,x.nl,x.read,x.root,x.tr,x.en,x.ar,x.ar_read,x.ru,x.ru_read].join('|')))}
  function currentWord(){try{if(typeof W.current==='function')return W.current()}catch(e){}try{if(typeof current==='function')return current()}catch(e){}return null}
  function activeWords(){try{if(typeof selectedWords==='function')return selectedWords().slice()}catch(e){}try{if(typeof allWords==='function')return allWords().slice()}catch(e){}return []}
  function queryValue(){var q=D.getElementById('q');return q?String(q.value||''):''}
  function setQuery(v){var q=D.getElementById('q');if(q)q.value=String(v||'')}
  function category(){try{return String(settings&&settings.cat||localStorage.getItem(P+'cat')||'ALL')}catch(e){return 'ALL'}}
  function direction(){try{return String(settings&&settings.dir||localStorage.getItem(P+'dir')||'NL_TR_EN')}catch(e){return 'NL_TR_EN'}}
  function canonicalMode(m){m=String(m||'learn').toLowerCase();if(m==='card'||m==='kart')return 'learn';return m}
  function stateRoot(){var r=readJSON(rootKey(),null);if(!r||typeof r!=='object')r={version:113,modules:{}};if(!r.modules||typeof r.modules!=='object')r.modules={};return r}
  function nearestQuizSection(){try{var a=[].slice.call(D.querySelectorAll('.lexCQSection'));var best='',dist=Infinity;a.forEach(function(el){var d=Math.abs(el.getBoundingClientRect().top-(D.getElementById('appHeader')||{offsetHeight:0}).offsetHeight);if(d<dist){dist=d;best=String(el.id||'').replace(/^lexCQ-/,'')}});return best}catch(e){return ''}}

  function snapshot(m){
    m=canonicalMode(m||modeNow());
    var w=currentWord(),st={
      mode:m,cat:category(),dir:direction(),cardId:cardId(w),idx:getIdx(),page:getPage(),readPage:getReadPage(),
      expanded:(function(){try{return !!expanded}catch(e){return false}})(),query:queryValue(),scrollY:Math.max(0,num(W.scrollY,0)),t:Date.now()
    };
    st.exampleIndex=num(W.__v9Ex,0);
    st.writeTask=num(W.__v9WriteTask,0);
    st.grammarTopic=num(W.__v9GrammarTopic,0);
    st.ebookKey=String(W.__v9Ebook||'');
    st.ebookPage=num(W.__v9EbookPage,0);
    st.trafficSection=num(W.__v9TrafficSec,0);
    st.trafficPage=num(W.__v9TrafficPage,0);
    st.quizPoolIndex=num(W.__lexPoolIndex,0);
    if(m==='quiz'){
      st.quizSection=nearestQuizSection()||String(W.__lexCQActiveSection||'');
      try{if(W.__lexCQBook)st.bookPage=num(W.__lexCQBook.page,0)}catch(e){}
    }
    if(W.__lexArchiveMode){st.archive=true;st.archiveView=String(W.__lexArchiveView||'card');st.archiveIdx=num(W.__lexArchiveIdx,0);st.archiveListPage=num(W.__lexArchiveListPage,0)}
    return st;
  }

  function saveNow(m){
    try{
      m=canonicalMode(m||modeNow());
      var root=stateRoot();root.version=113;root.modules[m]=snapshot(m);root.updatedAt=Date.now();writeJSON(rootKey(),root);
      if(safeUser()!=='guest')writeJSON(rootKey('guest'),root);
      return root.modules[m];
    }catch(e){return null}
  }
  function scheduleSave(m){clearTimeout(saveTimer);saveTimer=setTimeout(function(){saveNow(m)},90)}

  function legacyLearnState(){
    var users=[safeUser(),'guest'];
    for(var i=0;i<users.length;i++){var x=readJSON(legacyKey(users[i]),null);if(x&&x.id)return {mode:'learn',cat:x.cat||category(),cardId:String(x.id),idx:num(x.idx,0),page:0,readPage:0,query:'',scrollY:0,t:num(x.t,0)}}
    return null;
  }
  function moduleState(m){
    m=canonicalMode(m);var root=stateRoot(),st=root.modules[m];
    if(!st&&safeUser()!=='guest'){var g=readJSON(rootKey('guest'),null);st=g&&g.modules&&g.modules[m]}
    if(!st&&m==='learn')st=legacyLearnState();
    return st&&typeof st==='object'?st:null;
  }

  function applyState(st,m){
    if(!st)return false;m=canonicalMode(m||st.mode||'learn');
    try{
      if(st.cat&&settings){settings.cat=st.cat;localStorage.setItem(P+'cat',st.cat)}
      if(st.dir&&settings){settings.dir=st.dir;localStorage.setItem(P+'dir',st.dir)}
      setQuery(st.query||'');setModeVar(m);setPage(st.page);setReadPage(st.readPage);setExpanded(st.expanded);
      W.__v9Ex=num(st.exampleIndex,0);
      W.__v9WriteTask=num(st.writeTask,0);
      W.__v9GrammarTopic=num(st.grammarTopic,0);
      if(st.ebookKey!=null)W.__v9Ebook=String(st.ebookKey||'');
      W.__v9EbookPage=num(st.ebookPage,0);
      W.__v9TrafficSec=num(st.trafficSection,0);
      W.__v9TrafficPage=num(st.trafficPage,0);
      W.__lexPoolIndex=num(st.quizPoolIndex,0);
      var arr=activeWords();try{filtered=arr}catch(e){}
      var pos=-1,id=String(st.cardId||'');if(id){for(var i=0;i<arr.length;i++){if(cardId(arr[i])===id){pos=i;break}}}
      if(arr.length)setIdx(pos>=0?pos:Math.max(0,Math.min(num(st.idx,0),arr.length-1)));else setIdx(0);
      if(m==='learn'){try{W.__lexArchiveMode=false;W.__lexArchiveView='card'}catch(e){}}
      lastRestored={mode:m,scrollY:num(st.scrollY,0),quizSection:st.quizSection||'',bookPage:num(st.bookPage,0)};
      return true;
    }catch(e){return false}
  }

  function restoreScroll(st){
    if(!st)return;
    var run=function(){
      try{
        if(st.mode==='quiz'&&st.quizSection){var el=D.getElementById('lexCQ-'+st.quizSection);if(el)el.scrollIntoView({behavior:'auto',block:'start'})}
        if(st.bookPage&&W.__lexCQBook){W.__lexCQBook.page=Math.max(W.__lexCQBook.start||1,Math.min(st.bookPage,W.__lexCQBook.end||st.bookPage));if(typeof W.lexCQBookMove==='function')W.lexCQBookMove(0)}
        W.scrollTo(0,Math.max(0,num(st.scrollY,0)));
      }catch(e){}
    };
    requestAnimationFrame(function(){requestAnimationFrame(run)});
  }

  function installStyle(){
    if(D.getElementById('lexV113Css'))return;
    var s=D.createElement('style');s.id='lexV113Css';
    s.textContent='.ticker,.ticker span,.ticker span.tickerNews,.ticker span.tickerLocal,#tickerText{font-weight:400!important;text-shadow:none!important}.ticker{font-synthesis:none!important}.lexV111FastCard,.lexV110FastCard{will-change:auto!important}';
    D.head.appendChild(s);
  }

  function installWrappers(){
    if(W.__lexV113WrappersInstalled)return;
    W.__lexV113WrappersInstalled=true;

    var priorRender=W.render||(typeof render==='function'?render:null);
    W.render=function(){
      if(transitioning||rendering)return;
      rendering=true;var out;
      try{out=priorRender?priorRender.apply(this,arguments):undefined}
      finally{rendering=false;scheduleSave(modeNow())}
      return out;
    };
    try{render=W.render}catch(e){}

    var priorSetMode=W.setMode||(typeof setMode==='function'?setMode:null);
    W.setMode=function(target){
      var before=canonicalMode(modeNow());saveNow(before);target=canonicalMode(target);
      var direct=/^(learn|list|quiz|sentences|paragraph|read|manage|ebook|traffic)$/.test(target);
      if(direct){
        setModeVar(target);try{expanded=false;if(target==='learn'){W.__lexArchiveMode=false;W.__lexArchiveView='card'}}catch(e){}
      }else{
        transitioning=true;
        try{if(priorSetMode)priorSetMode.apply(this,arguments);else setModeVar(target)}catch(e){setModeVar(target)}
        finally{transitioning=false}
        target=canonicalMode(modeNow()||target);
      }
      var st=moduleState(target);applyState(st,target);
      try{W.render()}catch(e){}
      restoreScroll(lastRestored);
    };
    try{setMode=W.setMode}catch(e){}

    var priorApply=W.applyFilter||(typeof applyFilter==='function'?applyFilter:null);
    W.applyFilter=function(){
      saveNow(modeNow());var out=priorApply?priorApply.apply(this,arguments):undefined;scheduleSave(modeNow());return out;
    };
    try{applyFilter=W.applyFilter}catch(e){}
  }

  function captureBeforeNavigation(ev){
    try{var t=ev.target&&ev.target.closest?ev.target.closest('button,[onclick],.tabBtn,.listItem,.lexCQLeafNav'):null;if(t)saveNow(modeNow())}catch(e){}
  }
  D.addEventListener('pointerdown',captureBeforeNavigation,true);
  D.addEventListener('click',captureBeforeNavigation,true);
  W.addEventListener('scroll',function(){clearTimeout(scrollTimer);scrollTimer=setTimeout(function(){saveNow(modeNow())},220)},{passive:true});
  ['pagehide','beforeunload','blur'].forEach(function(n){W.addEventListener(n,function(){saveNow(modeNow())},{capture:true,passive:true})});
  D.addEventListener('visibilitychange',function(){if(D.hidden)saveNow(modeNow())},true);

  function oneTimeCleanup(){
    try{
      var marker=P+'cleanup_v113';if(localStorage.getItem(marker)==='1')return;
      Object.keys(localStorage).forEach(function(k){
        if(k.indexOf(P)!==0)return;
        var tail=k.slice(P.length);
        if(/^(stateV20_|normalStateV20_|stateV7[0-9]_|normalStateV7[0-9]_|transientReturnStateV20|archiveReturnStateV20|transientActiveV20|marketFocusV20)$/.test(tail))localStorage.removeItem(k);
      });
      localStorage.setItem(marker,'1');
    }catch(e){}
  }

  function boot(){
    installWrappers();installStyle();oneTimeCleanup();
    var st=moduleState('learn');applyState(st,'learn');setModeVar('learn');
    try{W.__lexArchiveMode=false;W.__lexArchiveView='card'}catch(e){}
    try{W.render()}catch(e){}
    restoreScroll(lastRestored);
    setTimeout(function(){try{if(W.lexV109ClearHeavyIntervals)W.lexV109ClearHeavyIntervals()}catch(e){}},180);
  }
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

  W.lexV113SaveState=saveNow;
  W.lexV113RestoreModule=function(m){var x=moduleState(canonicalMode(m));applyState(x,m);W.render();restoreScroll(lastRestored)};
})();
