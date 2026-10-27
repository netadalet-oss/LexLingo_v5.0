(function(){
  var W=window,D=document,DATA=W.LEX_CURRICULUM_DATA;
  if(!DATA||!Array.isArray(DATA.questions)||!DATA.questions.length)return;

  var SECTION_KEYS=['knowledge','vocabulary','pronunciation','grammar','writing','listening','comprehension','reading'];
  var SECTION_META={
    knowledge:{title:'Bilgi',icon:'◆',hint:'Soruyu okuyun ve doğru seçeneği işaretleyin.'},
    vocabulary:{title:'Kelime öğrenme',icon:'Aa',hint:'Doğru cevabın anahtar ifadesini seçin.'},
    pronunciation:{title:'Telaffuz',icon:'◉',hint:'Doğru cevabı sesli okuyun; sistem yaklaşık eşleşmeyi ölçer.'},
    grammar:{title:'Gramer',icon:'§',hint:'Kaynak cümlenin dil yapısını belirleyin.'},
    writing:{title:'Yazma',icon:'✎',hint:'Doğru cevabı eksiksiz yazın.'},
    listening:{title:'Dinleme',icon:'♫',hint:'Metni dinleyin; ekrandaki harflerden doğru seçeneği işaretleyin.'},
    comprehension:{title:'Anlama',icon:'◎',hint:'Durumu anlayıp en uygun cevabı seçin.'},
    reading:{title:'Okuma',icon:'▤',hint:'Metni dikkatle okuyup cevaplayın.'}
  };
  var qById=Object.create(null); DATA.questions.forEach(function(q){qById[q.id]=q});
  var STORE_KEY='lex_v3_curriculum_progress_v1';
  var state={cat:'',selected:Object.create(null),checked:Object.create(null),input:Object.create(null),speech:Object.create(null),anim:Object.create(null)};
  var progress=readStore();

  function readStore(){
    try{var x=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');return x&&typeof x==='object'?x:{}}catch(e){return {}}
  }
  function saveStore(){try{localStorage.setItem(STORE_KEY,JSON.stringify(progress))}catch(e){}}
  function h(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function attr(v){return h(v).replace(/\n/g,'&#10;')}
  function nrm(v){return String(v==null?'':v).toLocaleLowerCase('nl-NL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
  function modeNow(){try{return String(mode||'')}catch(e){return String(W.mode||'')}}
  function setModeVar(v){try{mode=v}catch(e){W.mode=v}}
  function catNow(){
    try{if(settings&&settings.cat)return settings.cat}catch(e){}
    try{return localStorage.getItem('lex_v3_cat')||'ALL'}catch(e){return 'ALL'}
  }
  function catLabel(c){try{return typeof catName==='function'?catName(c):c}catch(e){return c}}
  function poolFor(cat){
    var ids=(cat&&cat!=='ALL'&&DATA.pools[cat])?DATA.pools[cat]:DATA.questions.map(function(q){return q.id});
    var arr=[]; for(var i=0;i<ids.length;i++){if(qById[ids[i]])arr.push(qById[ids[i]])}
    return arr.length?arr:DATA.questions;
  }
  function catProgress(cat){
    progress.byCat=progress.byCat||{};
    var p=progress.byCat[cat]||(progress.byCat[cat]={idx:{},score:{}});
    p.idx=p.idx||{};p.score=p.score||{};
    SECTION_KEYS.forEach(function(k,i){
      if(!Number.isFinite(Number(p.idx[k])))p.idx[k]=(i*13)%Math.max(1,poolFor(cat).length);
      p.score[k]=p.score[k]||{right:0,total:0};
    });
    return p;
  }
  function syncCat(){
    var c=catNow()||'ALL';
    if(c!==state.cat){
      state.cat=c;state.selected=Object.create(null);state.checked=Object.create(null);state.input=Object.create(null);state.speech=Object.create(null);
      catProgress(c);saveStore();
    }
    return c;
  }
  function qFor(sec){
    var c=syncCat(),pool=poolFor(c),p=catProgress(c),i=Math.max(0,Number(p.idx[sec])||0)%pool.length;
    return pool[i];
  }
  function acceptedLetters(q){return Array.isArray(q.correct_letters)&&q.correct_letters.length?q.correct_letters:[q.correct_letter]}
  function acceptedAnswers(q){
    var out=[];acceptedLetters(q).forEach(function(k){if(q.options&&q.options[k])out.push(q.options[k])});
    return out;
  }
  function firstAnswer(q){return acceptedAnswers(q)[0]||q.answer||''}
  function isCorrectLetter(q,k){return acceptedLetters(q).indexOf(String(k||''))>=0}
  function optionEntries(q){return Object.keys(q.options||{}).map(function(k){return [k,q.options[k]]})}
  function sourceMark(){return '<span class="lexCQSourceMark">KNM</span>'}
  function questionBlock(q,showOptions,selected,checked){
    var html='<div class="lexCQQuestion">'+h(q.question)+'</div>';
    if(showOptions){
      html+='<div class="lexCQOptions">';
      optionEntries(q).forEach(function(o){
        var k=o[0],cl='lexCQOption';
        if(selected===k)cl+=' selected';
        if(checked){if(isCorrectLetter(q,k))cl+=' good';else if(selected===k)cl+=' wrong'}
        html+='<button class="'+cl+'" onclick="lexCQSelect(\''+k+'\')"><b>'+h(k)+'</b><span>'+h(o[1])+'</span></button>';
      });
      html+='</div>';
    }
    return html;
  }
  function grammarClass(text){
    var s=nrm(text),raw=String(text||'').trim();
    if(/\b(niet|geen|nooit|niemand|niets)\b/.test(s))return 'Ontkenning';
    if(/\b(moet|moeten|mag|mogen|kan|kunnen|kunt|wil|wilt|willen|hoeft|zullen|zou|zouden)\b/.test(s))return 'Modale zin';
    if(/^(wat|wie|waar|wanneer|waarom|hoe|welk|welke|waarmee|waarvoor|vanaf welke|met wie|naar welke)\b/.test(s))return 'W-vraag';
    if(/\?$/.test(raw)||/^(is|zijn|heeft|hebben|doet|doen|gaat|gaan|moet|mag|kan|kunt|wil|wilt|wordt|was|waren|bent|heb|kun|komt|krijgt|betaalt|kiezen)\b/.test(s))return 'Ja/nee-vraag';
    if(/\b(was|waren|had|hadden|ging|gingen|werd|werden|kwam|kwamen|kreeg|kregen|moest|moesten|begon|gebeurde)\b/.test(s))return 'Verleden tijd';
    return 'Mededelende zin';
  }
  var GRAMMAR_CHOICES=['W-vraag','Ja/nee-vraag','Ontkenning','Modale zin','Verleden tijd','Mededelende zin'];
  var STOP={de:1,het:1,een:1,en:1,of:1,van:1,voor:1,naar:1,met:1,op:1,bij:1,dat:1,die:1,dit:1,zijn:1,haar:1,hij:1,zij:1,u:1,je:1,er:1,als:1,om:1,te:1,wat:1,waar:1,niet:1,geen:1};
  function keyPhrase(text){
    var words=String(text||'').replace(/[.,;:!?()“”"']/g,' ').split(/\s+/).filter(Boolean);
    var chosen=words.filter(function(w){return !STOP[nrm(w)]&&nrm(w).length>2}).slice(0,4);
    if(!chosen.length)chosen=words.slice(0,4);
    return chosen.join(' ')||String(text||'');
  }
  function vocabEntries(q){
    var seen=Object.create(null),arr=[];
    optionEntries(q).forEach(function(o){
      var phrase=keyPhrase(o[1]),k=nrm(phrase);
      if(!seen[k]){seen[k]=1;arr.push({letter:o[0],phrase:phrase})}
    });
    if(arr.length<2)return optionEntries(q).map(function(o){return {letter:o[0],phrase:o[1]}});
    return arr;
  }
  function scoreText(sec){
    var s=catProgress(syncCat()).score[sec];return s.right+'/'+s.total;
  }
  function navHeader(sec,q){
    var c=syncCat(),pool=poolFor(c),p=catProgress(c),i=(Number(p.idx[sec])||0)%pool.length,m=SECTION_META[sec];
    return '<div class="lexCQHead"><div class="lexCQTitle"><span>'+h(m.icon)+'</span><div><b>'+h(m.title)+'</b><small>'+h(q.task||q.topic_title||'')+'</small></div></div><div class="lexCQCount">'+(i+1)+'/'+pool.length+' · '+scoreText(sec)+'</div></div>'+
      '<div class="lexCQLeafNav"><button class="ghost" aria-label="Önceki soru" onclick="lexCQMove(\''+sec+'\',-1)">‹</button><span>'+h(m.hint)+'</span><button class="ghost" aria-label="Sonraki soru" onclick="lexCQMove(\''+sec+'\',1)">›</button></div>';
  }
  function feedback(sec,q,correctText){
    if(!state.checked[sec])return '';
    var ok=state.checked[sec].ok;
    return '<div class="note '+(ok?'goodText':'badText')+'">'+(ok?'✅ Doğru':'❌ Yanlış')+(ok?'':' · Doğru: '+h(correctText||firstAnswer(q)))+'</div>';
  }
  function renderKnowledge(sec,q){
    var sel=state.selected[sec],checked=state.checked[sec];
    return questionBlock(q,true,sel,checked)+feedback(sec,q,firstAnswer(q))+'<div class="lexCQActions"><button onclick="lexCQCheck(\''+sec+'\')">Kontrol et</button><button class="ghost" onclick="lexCQSpeak(\''+sec+'\',\'question\')">🔊 Oku</button></div>';
  }
  function renderVocabulary(sec,q){
    var entries=vocabEntries(q),sel=state.selected[sec],checked=state.checked[sec];
    var html='<div class="lexCQQuestion">'+h(q.question)+'</div><div class="lexCQMiniSource">'+h(optionEntries(q).map(function(o){return o[0]+') '+o[1]}).join(' · '))+'</div><div class="lexCQOptions">';
    entries.forEach(function(e){
      var cl='lexCQOption';if(sel===e.letter)cl+=' selected';if(checked){if(isCorrectLetter(q,e.letter))cl+=' good';else if(sel===e.letter)cl+=' wrong'}
      html+='<button class="'+cl+'" onclick="lexCQSelect(\''+e.letter+'\')"><b>'+h(e.letter)+'</b><span>'+h(e.phrase)+'</span></button>';
    });
    html+='</div>'+feedback(sec,q,keyPhrase(firstAnswer(q)))+'<div class="lexCQActions"><button onclick="lexCQCheck(\''+sec+'\')">Kontrol et</button><button class="ghost" onclick="lexCQSpeak(\''+sec+'\',\'answer\')">🔊 İfadeyi oku</button></div>';
    return html;
  }
  function renderPronunciation(sec,q){
    var result=state.speech[sec]||null,ans=firstAnswer(q);
    var html='<div class="lexCQQuestion">'+h(q.question)+'</div><div class="lexCQPronTarget">'+h(ans)+'</div><div class="lexCQActions"><button class="ghost" onclick="lexCQSpeak(\''+sec+'\',\'answer\')">🔊 Örneği dinle</button><button onclick="lexCQRecognize(\''+sec+'\')">🎙 Telaffuzumu ölç</button></div>';
    if(result)html+='<div class="note '+(result.ok?'goodText':'badText')+'">'+(result.ok?'✅ Yakın eşleşme':'❌ Tekrar deneyin')+' · Duyulan: '+h(result.heard)+'</div>';
    return html;
  }
  function renderGrammar(sec,q){
    var target=grammarClass(q.question),sel=state.selected[sec],checked=state.checked[sec];
    var html='<div class="lexCQQuestion">'+h(q.question)+'</div><div class="lexCQOptions lexCQGrammar">';
    GRAMMAR_CHOICES.forEach(function(x,i){var cl='lexCQOption';if(sel===x)cl+=' selected';if(checked){if(x===target)cl+=' good';else if(sel===x)cl+=' wrong'}html+='<button class="'+cl+'" onclick="lexCQSelect('+JSON.stringify(x)+')"><b>'+(i+1)+'</b><span>'+h(x)+'</span></button>'});
    html+='</div>'+feedback(sec,q,target)+'<div class="lexCQActions"><button onclick="lexCQCheck(\''+sec+'\')">Kontrol et</button><button class="ghost" onclick="lexCQSpeak(\''+sec+'\',\'question\')">🔊 Cümleyi oku</button></div>';
    return html;
  }
  function renderWriting(sec,q){
    var checked=state.checked[sec],val=state.input[sec]||'';
    var html='<div class="lexCQQuestion">'+h(q.question)+'</div><div class="lexCQMiniSource">'+h(optionEntries(q).map(function(o){return o[0]+') '+o[1]}).join(' · '))+'</div><textarea id="lexCQWriteInput" placeholder="Doğru cevabı yazın...">'+h(val)+'</textarea>';
    html+=feedback(sec,q,firstAnswer(q))+'<div class="lexCQActions"><button onclick="lexCQCheck(\''+sec+'\')">Kontrol et</button><button class="ghost" onclick="lexCQSpeak(\''+sec+'\',\'question\')">🔊 Soruyu oku</button></div>';
    return html;
  }
  function renderListening(sec,q){
    var sel=state.selected[sec],checked=state.checked[sec],html='<div class="lexCQListenPrompt">♫ Metni dinleyin</div><div class="lexCQActions"><button onclick="lexCQSpeak(\''+sec+'\',\'full\')">🔊 Soruyu ve seçenekleri dinle</button><button class="ghost" onclick="lexCQSpeak(\''+sec+'\',\'question\')">🔁 Soruyu tekrar et</button></div><div class="lexCQLetterOptions">';
    optionEntries(q).forEach(function(o){var k=o[0],cl='ghost';if(sel===k)cl+=' selected';if(checked){if(isCorrectLetter(q,k))cl+=' good';else if(sel===k)cl+=' wrong'}html+='<button class="'+cl+'" onclick="lexCQSelect(\''+k+'\')">'+h(k)+'</button>'});
    html+='</div><div class="lexCQActions"><button onclick="lexCQCheck(\''+sec+'\')">Kontrol et</button></div>';
    if(checked)html+='<div class="lexCQTranscript">'+questionBlock(q,true,sel,checked)+'</div>'+feedback(sec,q,firstAnswer(q));
    return html;
  }
  function sectionBody(sec,q){
    if(sec==='knowledge'||sec==='comprehension'||sec==='reading')return renderKnowledge(sec,q);
    if(sec==='vocabulary')return renderVocabulary(sec,q);
    if(sec==='pronunciation')return renderPronunciation(sec,q);
    if(sec==='grammar')return renderGrammar(sec,q);
    if(sec==='writing')return renderWriting(sec,q);
    if(sec==='listening')return renderListening(sec,q);
    return renderKnowledge(sec,q);
  }
  function renderSection(sec){
    var q=qFor(sec),dir=state.anim[sec]||'';
    return '<section class="card lexCQSection" id="lexCQ-'+sec+'">'+navHeader(sec,q)+'<div class="lexCQLeaf '+(dir==='left'?'fromLeft':dir==='right'?'fromRight':'')+'" data-sec="'+sec+'">'+sectionBody(sec,q)+sourceMark()+'</div></section>';
  }
  function renderQuizCenter(){
    syncCat();
    try{if(typeof updateHeaderMetrics==='function')updateHeaderMetrics()}catch(e){}
    try{if(typeof setActiveTab==='function')setActiveTab()}catch(e){}
    var cat=syncCat(),pool=poolFor(cat);
    var jumps=SECTION_KEYS.map(function(k){return '<button class="ghost" onclick="lexCQJump(\''+k+'\')">'+h(SECTION_META[k].title)+'</button>'}).join('');
    var html='<section class="card lexCQIntro"><span class="badge">Quiz · '+h(cat==='ALL'?'Tüm kategoriler':catLabel(cat))+'</span><div class="lexCQIntroLine"><b>'+pool.length+' kaynak soru</b><span>Kategori değiştiğinde bu alan otomatik yenilenir.</span></div><div class="lexCQJump">'+jumps+'</div></section>';
    SECTION_KEYS.forEach(function(k){html+=renderSection(k)});
    var v=D.getElementById('view');if(v)v.innerHTML=html;
    bindSwipes();
  }
  function bindSwipes(){
    Array.prototype.forEach.call(D.querySelectorAll('.lexCQLeaf[data-sec]'),function(el){
      var x=0,y=0,active=false;
      el.addEventListener('pointerdown',function(e){active=true;x=e.clientX;y=e.clientY},{passive:true});
      el.addEventListener('pointerup',function(e){if(!active)return;active=false;var dx=e.clientX-x,dy=e.clientY-y;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.25)move(el.getAttribute('data-sec'),dx<0?1:-1)},{passive:true});
      el.addEventListener('pointercancel',function(){active=false},{passive:true});
    });
  }
  function move(sec,delta){
    var c=syncCat(),p=catProgress(c),pool=poolFor(c),oldY=W.scrollY||0;
    p.idx[sec]=((Number(p.idx[sec])||0)+delta+pool.length)%pool.length;
    state.selected[sec]=null;state.checked[sec]=null;state.input[sec]='';state.speech[sec]=null;state.anim[sec]=delta>0?'right':'left';
    saveStore();renderQuizCenter();requestAnimationFrame(function(){W.scrollTo(0,oldY)});
  }
  function select(value){
    var sec=W.__lexCQActiveSection;if(!sec)return;
    state.selected[sec]=value;state.checked[sec]=null;
    var y=W.scrollY||0;renderQuizCenter();requestAnimationFrame(function(){W.scrollTo(0,y)});
  }
  function sectionFromButton(){
    var el=D.activeElement&&D.activeElement.closest?D.activeElement.closest('.lexCQSection'):null;
    return el?String(el.id||'').replace('lexCQ-',''):'';
  }
  function check(sec){
    sec=sec||sectionFromButton();if(!sec)return;
    var q=qFor(sec),ok=false;
    if(sec==='writing'){
      var inp=D.getElementById('lexCQWriteInput'),val=inp?inp.value:(state.input[sec]||'');state.input[sec]=val;
      ok=acceptedAnswers(q).some(function(a){return nrm(a)===nrm(val)});
    }else if(sec==='grammar')ok=state.selected[sec]===grammarClass(q.question);
    else ok=isCorrectLetter(q,state.selected[sec]);
    state.checked[sec]={ok:ok};
    var sc=catProgress(syncCat()).score[sec];sc.total++;if(ok)sc.right++;
    saveStore();var y=W.scrollY||0;renderQuizCenter();requestAnimationFrame(function(){W.scrollTo(0,y)});
  }
  function speak(sec,kind){
    var q=qFor(sec),text='';
    if(kind==='answer')text=firstAnswer(q);
    else if(kind==='full')text=q.question+'. '+optionEntries(q).map(function(o){return o[0]+'. '+o[1]}).join('. ');
    else text=q.question;
    try{
      speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang='nl-NL';u.rate=.88;speechSynthesis.speak(u);
    }catch(e){try{if(typeof speakSafe==='function')speakSafe(text,'nl-NL','lexcq-'+sec,null)}catch(_){} }
  }
  function recognize(sec){
    var q=qFor(sec),target=firstAnswer(q),R=W.SpeechRecognition||W.webkitSpeechRecognition;
    if(!R){state.speech[sec]={ok:false,heard:'Mikrofonlu konuşma tanıma bu cihazda desteklenmiyor.'};renderQuizCenter();return}
    try{
      var r=new R();r.lang='nl-NL';r.interimResults=false;r.maxAlternatives=3;
      r.onresult=function(e){var alts=[];for(var i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript);var ok=alts.some(function(x){var a=nrm(x),b=nrm(target);return a===b||a.indexOf(b)>=0||b.indexOf(a)>=0||(a&&b&&similarity(a,b)>=.72)});state.speech[sec]={ok:ok,heard:alts[0]||''};var sc=catProgress(syncCat()).score[sec];sc.total++;if(ok)sc.right++;saveStore();renderQuizCenter()};
      r.onerror=function(e){state.speech[sec]={ok:false,heard:'Tanıma hatası: '+(e.error||'bilinmiyor')};renderQuizCenter()};r.start();
    }catch(e){state.speech[sec]={ok:false,heard:'Mikrofon başlatılamadı.'};renderQuizCenter()}
  }
  function similarity(a,b){
    var A=a.split(' '),B=b.split(' '),hit=0;A.forEach(function(x){if(B.indexOf(x)>=0)hit++});return hit/Math.max(A.length,B.length,1)
  }
  function jump(sec){var el=D.getElementById('lexCQ-'+sec);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}

  function bookFile(page){
    var n=String(Math.max(1,Number(page)||1));while(n.length<3)n='0'+n;
    return String(DATA.book_path_pattern||'knm_revision/book/page-{page}.jpg').replace('{page}',n);
  }
  function bookMarkup(q){
    var r=(DATA.book_ranges&&DATA.book_ranges[q.topic])||[1,Number(DATA.book_total_pages)||188];
    W.__lexCQBook={topic:q.topic,topicTitle:q.topic_title||q.task||'Kaynak',topicStart:r[0],topicEnd:r[1],start:r[0],end:r[1],page:r[0],all:false};
    return '<details class="lexCQBook" open><summary>Kaynak kitabı · '+h(q.topic_title||q.task||'Konu')+'</summary><div class="lexCQBookToolbar"><button class="ghost" onclick="lexCQBookMove(-1)">‹</button><span id="lexCQBookCount">'+r[0]+'/'+r[1]+'</span><button class="ghost" onclick="lexCQBookMove(1)">›</button></div><img id="lexCQBookImage" loading="lazy" src="'+attr(bookFile(r[0]))+'" alt="Kaynak kitabı sayfası '+r[0]+'"><div class="lexCQBookSwitch"><button class="ghost" onclick="lexCQBookTopic()">Konu bölümü</button><button class="ghost" onclick="lexCQBookAll()">Tam kaynak</button></div></details>';
  }
  function bookRefresh(){
    var st=W.__lexCQBook;if(!st)return;var img=D.getElementById('lexCQBookImage'),cnt=D.getElementById('lexCQBookCount');
    if(img){img.src=bookFile(st.page);img.alt='Kaynak kitabı sayfası '+st.page}
    if(cnt)cnt.textContent=st.page+'/'+st.end;
  }
  function bookMove(delta){var st=W.__lexCQBook;if(!st)return;var len=st.end-st.start+1;st.page=st.start+((st.page-st.start+Number(delta||0)+len)%len);bookRefresh()}
  function bookAll(){var st=W.__lexCQBook;if(!st)return;st.all=true;st.start=1;st.end=Number(DATA.book_total_pages)||188;st.page=1;bookRefresh()}
  function bookTopic(){var st=W.__lexCQBook;if(!st)return;st.all=false;st.start=st.topicStart;st.end=st.topicEnd;st.page=st.start;bookRefresh()}

  // Keep the existing interface and module order; only append category-related study material.
  function appendEnrichment(m){
    if(m==='quiz'||m==='manage'||!D.getElementById('view'))return;
    var v=D.getElementById('view');if(!v||v.querySelector('.lexCQEnrich'))return;
    var pool=poolFor(syncCat()),seed=0;
    try{seed=Number(idx)||0}catch(e){}
    var q=pool[Math.abs(seed)%pool.length],title='Konu bağlantısı',body='';
    if(m==='read'){
      title='Dinleme ve okuma çalışma yolu';
      var lessons=(DATA.listening_lessons||[]).map(function(x){return '<div class="lexCQLesson"><b>'+h(x.level)+' · '+h(x.title)+'</b><span>'+h(x.text)+'</span></div>'}).join('');
      body='<div class="lexCQLessons">'+lessons+'</div><details class="lexCQGuide"><summary>10 sayfalık görsel rehber</summary><div class="lexCQGuidePages">'+(DATA.listening_pages||[]).map(function(src,i){return '<img loading="lazy" src="'+attr(src)+'" alt="Dinleme rehberi '+(i+1)+'">'}).join('')+'</div></details>'+bookMarkup(q);
    }else if(m==='write'){
      title='Kaynaklı yazma çalışması';
      body='<div class="lexCQQuestion">'+h(q.question)+'</div><div class="lexCQMiniSource">'+h(optionEntries(q).map(function(o){return o[0]+') '+o[1]}).join(' · '))+'</div><textarea placeholder="Cevabı kendi el yazınızla veya klavyeyle tekrar edin..."></textarea><details><summary>Cevabı göster</summary><div class="note goodText">'+h(firstAnswer(q))+'</div></details>'+sourceMark();
    }else if(m==='paragraph'){
      title='Gramer bağlantısı · '+grammarClass(q.question);
      body='<div class="lexCQQuestion">'+h(q.question)+'</div><div class="note">'+h(q.task)+'</div>'+sourceMark();
    }else{
      body='<div class="lexCQQuestion">'+h(q.question)+'</div><details><summary>Cevabı göster</summary><div class="note goodText">'+h(firstAnswer(q))+'</div></details><div class="lexCQActions"><button class="ghost" onclick="lexCQEnrichSpeak()">🔊 Oku</button></div>'+sourceMark();
    }
    var s=D.createElement('section');s.className='card lexCQEnrich';s.innerHTML='<span class="badge">'+h(title)+'</span>'+body;v.appendChild(s);
    W.__lexCQEnrichQuestion=q;
  }
  function enrichSpeak(){var q=W.__lexCQEnrichQuestion;if(!q)return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(q.question);u.lang='nl-NL';u.rate=.9;speechSynthesis.speak(u)}catch(e){}}

  var baseRender=null,baseSetMode=null;
  function renderWrapper(){
    var m=modeNow();
    if(m==='quiz'){renderQuizCenter();return}
    var r=baseRender?baseRender.apply(this,arguments):undefined;
    try{appendEnrichment(modeNow())}catch(e){try{console.warn('curriculum enrichment',e)}catch(_){}}
    return r;
  }
  function setModeWrapper(m){
    var target=String(m||'');
    if(target==='quiz'){
      setModeVar('quiz');try{page=0}catch(e){};renderQuizCenter();try{W.scrollTo({top:0,behavior:'smooth'})}catch(e){W.scrollTo(0,0)};return;
    }
    return baseSetMode?baseSetMode.apply(this,arguments):undefined;
  }
  function installHooks(){
    var r=null,s=null;
    try{r=W.render||(typeof render==='function'?render:null)}catch(e){r=W.render}
    try{s=W.setMode||(typeof setMode==='function'?setMode:null)}catch(e){s=W.setMode}
    if(r&&r!==renderWrapper)baseRender=r;
    if(s&&s!==setModeWrapper)baseSetMode=s;
    W.render=renderWrapper;W.setMode=setModeWrapper;
    try{render=renderWrapper}catch(e){}try{setMode=setModeWrapper}catch(e){}
    if(modeNow()==='quiz')renderQuizCenter();
  }

  W.lexCQMove=move;
  W.lexCQCheck=check;
  W.lexCQSpeak=speak;
  W.lexCQRecognize=recognize;
  W.lexCQJump=jump;
  W.lexCQEnrichSpeak=enrichSpeak;
  W.lexCQBookMove=bookMove;
  W.lexCQBookAll=bookAll;
  W.lexCQBookTopic=bookTopic;
  W.lexCQSelect=function(v){var sec=sectionFromButton();if(!sec)return;W.__lexCQActiveSection=sec;select(v)};

  function addCss(){
    if(D.getElementById('lexCQCss'))return;
    var s=D.createElement('style');s.id='lexCQCss';s.textContent='\
.lexCQIntro{padding-bottom:10px}.lexCQIntroLine{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:calc(12px * var(--ui));color:var(--muted)}.lexCQIntroLine b{color:var(--gold2)}\
.lexCQJump{display:flex;gap:6px;overflow-x:auto;padding:8px 0 1px;scrollbar-width:thin}.lexCQJump button{flex:0 0 auto;font-size:calc(10.5px * var(--ui));padding:7px 9px}\
.lexCQSection{scroll-margin-top:calc(var(--headerH) + 8px);overflow:hidden}.lexCQHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.lexCQTitle{display:flex;align-items:center;gap:9px;min-width:0}.lexCQTitle>span{width:34px;height:34px;display:grid;place-items:center;border-radius:12px;border:1px solid rgba(216,179,95,.45);color:var(--gold2);background:rgba(216,179,95,.10);font-weight:950}.lexCQTitle b{display:block;color:var(--gold2);font-size:calc(16px * var(--ui))}.lexCQTitle small{display:block;color:var(--muted);font-size:calc(10.5px * var(--ui));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:48vw}.lexCQCount{font-size:calc(10.5px * var(--ui));color:#d9e2ef;white-space:nowrap}\
.lexCQLeafNav{display:grid;grid-template-columns:42px 1fr 42px;gap:7px;align-items:center;margin-bottom:8px}.lexCQLeafNav button{width:42px;height:38px;padding:0;font-size:25px}.lexCQLeafNav span{text-align:center;color:var(--muted);font-size:calc(10.8px * var(--ui));line-height:1.3}\
.lexCQLeaf{position:relative;min-height:160px;border:1px solid rgba(216,179,95,.22);border-radius:18px;padding:12px 12px 22px;background:linear-gradient(135deg,rgba(255,255,255,.035),rgba(216,179,95,.045));box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}.lexCQLeaf.fromRight{animation:lexCQRight .2s ease-out}.lexCQLeaf.fromLeft{animation:lexCQLeft .2s ease-out}@keyframes lexCQRight{from{opacity:.35;transform:translateX(24px) rotateY(-5deg)}to{opacity:1;transform:none}}@keyframes lexCQLeft{from{opacity:.35;transform:translateX(-24px) rotateY(5deg)}to{opacity:1;transform:none}}\
.lexCQQuestion{font-size:calc(16px * var(--ui));font-weight:800;line-height:1.42;color:#f8fbff;user-select:text;-webkit-user-select:text;margin:2px 0 10px}.lexCQMiniSource{font-size:calc(11px * var(--ui));line-height:1.4;color:#c9d3e2;padding:8px;border-radius:12px;background:rgba(2,7,17,.28);user-select:text;-webkit-user-select:text;margin-bottom:8px}\
.lexCQOptions{display:grid;gap:7px}.lexCQOption{display:grid!important;grid-template-columns:30px minmax(0,1fr);gap:7px;align-items:center;text-align:left!important;background:linear-gradient(180deg,rgba(16,42,86,.96),rgba(5,19,45,.96))!important;color:#f7f9ff!important;border:1px solid rgba(216,179,95,.28)!important;box-shadow:none!important;padding:8px 9px!important}.lexCQOption b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;background:rgba(216,179,95,.12);color:var(--gold2)}.lexCQOption span{font-weight:700;line-height:1.3;user-select:text;-webkit-user-select:text}.lexCQOption.selected,.lexCQLetterOptions button.selected{border-color:rgba(255,230,163,.85)!important;box-shadow:0 0 0 2px rgba(216,179,95,.14)!important}.lexCQOption.good,.lexCQLetterOptions button.good{border-color:rgba(37,196,107,.78)!important;background:rgba(37,196,107,.13)!important}.lexCQOption.wrong,.lexCQLetterOptions button.wrong{border-color:rgba(242,91,116,.78)!important;background:rgba(242,91,116,.13)!important}\
.lexCQGrammar{grid-template-columns:1fr 1fr}.lexCQActions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.lexCQActions button{font-size:calc(11.5px * var(--ui));padding:8px 6px}.lexCQSourceMark{position:absolute;right:7px;bottom:5px;font-size:7px;line-height:1;color:rgba(203,213,225,.42);letter-spacing:.7px;font-weight:600;pointer-events:none}.lexCQPronTarget{font-size:calc(19px * var(--ui));font-weight:900;line-height:1.35;text-align:center;padding:13px;border-radius:16px;background:rgba(216,179,95,.10);border:1px solid rgba(216,179,95,.25);user-select:text;-webkit-user-select:text}.lexCQListenPrompt{text-align:center;font-size:calc(20px * var(--ui));font-weight:900;color:var(--gold2);padding:10px}.lexCQLetterOptions{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}.lexCQLetterOptions button{font-size:calc(18px * var(--ui));min-height:44px}.lexCQTranscript{margin-top:10px;padding-top:10px;border-top:1px solid rgba(148,163,184,.18)}\
.lexCQLessons{display:grid;gap:7px}.lexCQLesson{display:grid;gap:2px;padding:9px 10px;border-radius:14px;border:1px solid rgba(216,179,95,.2);background:rgba(2,7,17,.24)}.lexCQLesson b{font-size:calc(12px * var(--ui));color:var(--gold2)}.lexCQLesson span{font-size:calc(11px * var(--ui));color:#d6deea;line-height:1.35}.lexCQGuide{margin-top:10px}.lexCQGuide summary,.lexCQEnrich summary,.lexCQBook summary{cursor:pointer;color:var(--gold2);font-weight:800;font-size:calc(12px * var(--ui))}.lexCQGuidePages{display:grid;gap:10px;margin-top:10px}.lexCQGuidePages img{width:100%;height:auto;border-radius:14px;border:1px solid rgba(216,179,95,.28);display:block}.lexCQBook{margin-top:12px;padding-top:9px;border-top:1px solid rgba(216,179,95,.2)}.lexCQBookToolbar{display:grid;grid-template-columns:48px 1fr 48px;gap:7px;align-items:center;margin:9px 0 7px}.lexCQBookToolbar span{text-align:center;color:var(--gold2);font-weight:900}.lexCQBookToolbar button{font-size:23px;padding:5px}.lexCQBook img{display:block;width:100%;height:auto;max-height:72vh;object-fit:contain;border-radius:14px;border:1px solid rgba(216,179,95,.3);background:#fff}.lexCQBookSwitch{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:7px}.lexCQEnrich{overflow:hidden}.lexCQEnrich textarea{margin-top:7px}\
@media(max-width:520px){.lexCQGrammar{grid-template-columns:1fr}.lexCQTitle small{max-width:42vw}.lexCQIntroLine{align-items:flex-start;flex-direction:column;gap:2px}.lexCQLeaf{padding:10px 9px 21px}.lexCQQuestion{font-size:calc(15px * var(--ui))}}';D.head.appendChild(s)
  }
  function boot(){
    addCss();installHooks();
    if(modeNow()==='quiz')renderQuizCenter();else try{appendEnrichment(modeNow())}catch(e){}
    try{
      if(!W.__lexCQObserver){
        W.__lexCQObserver=new MutationObserver(function(){
          if(modeNow()==='quiz'&&!D.querySelector('.lexCQSection'))setTimeout(function(){try{renderQuizCenter()}catch(e){}},0);
        });
        W.__lexCQObserver.observe(D.getElementById('view')||D.body,{childList:true,subtree:false});
      }
    }catch(e){}
  }
  if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
