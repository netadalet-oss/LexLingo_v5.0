(function(){
'use strict';
if(window.__LEX_V127_PREPAINT_ARABIC_ARCHIVE_PDF__)return;
window.__LEX_V127_PREPAINT_ARABIC_ARCHIVE_PDF__='2026.07.19-v127-prepaint-arabic-archive-pdf-ui';
var W=window,D=document,P='lex_v3_',BLUR_KEY=P+'cardDefaultBlurLang';
var ALLOWED={NONE:1,NL:1,EN:1,TR:1,AR:1,RU:1};

function byId(id){return D.getElementById(id)}
function text(v){return String(v==null?'':v)}
function enc(v){try{return encodeURIComponent(text(v)).replace(/'/g,'%27')}catch(e){return ''}}
function dec(v){try{return decodeURIComponent(text(v))}catch(e){return text(v)}}
function norm(v){return text(v).trim().replace(/\s+/g,' ').replace(/:$/,'').toLocaleLowerCase('tr-TR')}
function modeNow(){try{return text(typeof mode!=='undefined'?mode:W.mode||'learn').toLowerCase()}catch(e){return text(W.mode||'learn').toLowerCase()}}
function notify(v){try{return (W.gold||W.msg||W.toast||function(){})(v)}catch(e){}}
function blurLang(){var v='TR';try{v=text(localStorage.getItem(BLUR_KEY)||'TR').toUpperCase()}catch(e){}return ALLOWED[v]?v:'TR'}
function archiveList(){try{return typeof W.lexArchiveList==='function'?(W.lexArchiveList()||[]):[]}catch(e){return []}}

var LABEL_CODE={
  'tr':'TR','turkce':'TR','türkçe':'TR','turkish':'TR','turks':'TR','türkisch':'TR','турецкий':'TR','التركية':'TR',
  'en':'EN','ingilizce':'EN','i̇ngilizce':'EN','english':'EN','engels':'EN','английский':'EN','الإنجليزية':'EN',
  'nl':'NL','hollandaca':'NL','nederlands':'NL','dutch':'NL','голландский':'NL','нидерландский':'NL','الهولندية':'NL',
  'ar':'AR','arapca':'AR','arapça':'AR','arabic':'AR','arabisch':'AR','арабский':'AR','العربية':'AR',
  'ru':'RU','rusca':'RU','rusça':'RU','russian':'RU','russisch':'RU','русский':'RU','الروسية':'RU'
};
function rowCode(row){
  if(!row||row.classList.contains('pronLine'))return '';
  var label=row.querySelector('.label'),n=norm(label&&label.textContent);
  if(/okunuş|okunus|pronunciation|uitspraak|النطق|произношение/.test(n))return '';
  return LABEL_CODE[n]||'';
}
function blurCard(card){
  if(!card)return card;
  card.dataset.lexV127BlurApplied='1';
  card.dataset.lexV126BlurApplied='1';
  card.dataset.lexV125BlurApplied='1';
  var wanted=blurLang();if(wanted==='NONE')return card;
  var rows=card.querySelectorAll('.line');
  for(var i=0;i<rows.length;i++){
    if(rowCode(rows[i])!==wanted)continue;
    var value=rows[i].querySelector('.value');
    if(value){value.classList.add('hidden');value.dataset.lexV127DefaultBlur=wanted}
    break;
  }
  return card;
}
function blurCurrentCard(){
  if(modeNow()!=='learn'||W.__lexArchiveMode)return;
  var card=D.querySelector('#view #lexV111WordCard,#view #lexV110WordCard');
  if(card&&card.dataset.lexV127BlurApplied!=='1')blurCard(card);
}

/* Kelime kartı HTML'i DOM'a girmeden önce seçili çeviri buzlanır; böylece tek kare dahi açık görünmez. */
(function installPrepaintSetter(){
  try{
    var proto=W.Element&&W.Element.prototype,desc=proto&&Object.getOwnPropertyDescriptor(proto,'innerHTML');
    if(!desc||typeof desc.set!=='function'||!desc.configurable||proto.__lexV127InnerHtmlPatched)return;
    var originalSet=desc.set,originalGet=desc.get;
    Object.defineProperty(proto,'innerHTML',{configurable:true,enumerable:desc.enumerable,get:originalGet,set:function(v){
      var next=v;
      try{
        if(this&&this.id==='view'&&typeof v==='string'&&modeNow()==='learn'&&!W.__lexArchiveMode&&/id=["']lexV11(?:0|1)WordCard["']/.test(v)){
          var t=D.createElement('template');originalSet.call(t,v);
          var card=t.content.querySelector('#lexV111WordCard,#lexV110WordCard');
          if(card){blurCard(card);next=t.innerHTML}
        }
      }catch(e){next=v}
      return originalSet.call(this,next);
    }});
    try{Object.defineProperty(proto,'__lexV127InnerHtmlPatched',{value:true,configurable:false})}catch(e){proto.__lexV127InnerHtmlPatched=true}
  }catch(e){}
})();

function hasArabic(v){return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text(v))}
function lineLabel(row){var e=row&&row.querySelector&&row.querySelector('.label');return norm(e&&e.textContent)}
function valueText(row){var e=row&&row.querySelector&&row.querySelector('.value');return text(e&&e.textContent).trim()}
function arabicReadFromCard(btn){
  try{
    var row=btn&&btn.closest&&btn.closest('.line'),card=row&&row.closest&&row.closest('section.card');
    if(!card)return '';
    var rows=card.querySelectorAll('.line');
    for(var i=0;i<rows.length;i++){
      var l=lineLabel(rows[i]);
      if(/arapça\s+okunuş|arapca\s+okunus|arabic\s+pronunciation|arabische\s+uitspraak|араб.*произнош|النطق.*العرب/.test(l)){
        var v=valueText(rows[i]);if(v&&!hasArabic(v))return v;
      }
    }
  }catch(e){}
  return '';
}
function currentArabicRead(){
  var w=null;
  try{
    if(W.__lexArchiveMode&&typeof W.lexArchiveList==='function'){
      var a=W.lexArchiveList()||[],i=Math.max(0,Number(W.__lexArchiveIdx)||0);w=a[i]||null;
    }else if(typeof W.current==='function')w=W.current();
    else if(typeof current==='function')w=current();
  }catch(e){}
  return text(w&&(w.ar_read||w.arRead||w.arabic_read)).trim();
}
function transliterateArabic(v){
  var s=text(v).replace(/لا/g,'la'),map={
    'ا':'a','أ':'a','إ':'i','آ':'a','ب':'b','ت':'t','ث':'s','ج':'c','ح':'h','خ':'h','د':'d','ذ':'z','ر':'r','ز':'z','س':'s','ش':'ş','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'','غ':'ğ','ف':'f','ق':'k','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','ة':'e','و':'v','ؤ':'u','ي':'y','ى':'a','ئ':'i','ء':'','َ':'a','ُ':'u','ِ':'i','ً':'an','ٌ':'un','ٍ':'in','ْ':'','ّ':''
  },out='';
  for(var i=0;i<s.length;i++)out+=Object.prototype.hasOwnProperty.call(map,s[i])?map[s[i]]:s[i];
  return out.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g,'').replace(/\s+/g,' ').trim();
}
function turkishArabicRead(raw,btn,explicit){
  var r=text(explicit).trim();if(r&&!hasArabic(r))return r;
  r=text(raw).trim();if(r&&!hasArabic(r))return r;
  r=arabicReadFromCard(btn);if(r)return r;
  r=currentArabicRead();if(r&&!hasArabic(r))return r;
  return transliterateArabic(raw);
}

/* Arapça ses komutları Latince/Türk alfabesi okunuşuyla ve tr-TR TTS ile çalışır. */
var baseSpeak=W.speak;
if(typeof baseSpeak==='function'){
  W.speak=function(value,lang,key,btn){
    var raw=text(value),lg=text(lang||'');
    if(/^ar(?:-|$)/i.test(lg)){
      var rd=turkishArabicRead(raw,btn,'');
      if(rd)return baseSpeak.call(this,rd,'tr-TR',key,btn);
    }
    return baseSpeak.apply(this,arguments);
  };
  try{speak=W.speak}catch(e){}
}
var baseSpeakSafe=W.speakSafe;
if(typeof baseSpeakSafe==='function'){
  W.speakSafe=function(encoded,lang,key,btn){
    var raw=dec(encoded),lg=text(lang||'');
    if(/^ar(?:-|$)/i.test(lg)){
      var rd=turkishArabicRead(raw,btn,'');
      if(rd)return baseSpeakSafe.call(this,enc(rd),'tr-TR',key,btn);
    }
    return baseSpeakSafe.apply(this,arguments);
  };
  try{speakSafe=W.speakSafe}catch(e){}
}
var baseArabicSafe=W.speakArabicSafe;
W.speakArabicSafe=function(encodedArabic,encodedRead,key,btn){
  var raw=dec(encodedArabic),rd=turkishArabicRead(raw,btn,dec(encodedRead));
  if(rd&&typeof W.speakSafe==='function')return W.speakSafe(enc(rd),'tr-TR',key,btn);
  if(typeof baseArabicSafe==='function')return baseArabicSafe.apply(this,arguments);
};
try{speakArabicSafe=W.speakArabicSafe}catch(e){}

function withArchivePdfContext(fn){
  var list=archiveList(),hadSelected=Object.prototype.hasOwnProperty.call(W,'selectedWords'),oldSelected=W.selectedWords;
  var hadSettings=Object.prototype.hasOwnProperty.call(W,'settings'),oldSettings=W.settings,oldCat,hadCat=false;
  var oldPage=0,hadPage=false;
  try{oldPage=Number(page)||0;hadPage=true;page=Math.max(0,Number(W.__lexArchiveListPage)||0)}catch(e){}
  W.selectedWords=function(){return list.slice()};
  try{
    if(!W.settings||typeof W.settings!=='object')W.settings={};
    hadCat=Object.prototype.hasOwnProperty.call(W.settings,'cat');oldCat=W.settings.cat;W.settings.cat='Arşiv listesi';
  }catch(e){}
  function restore(){
    try{if(hadSelected)W.selectedWords=oldSelected;else delete W.selectedWords}catch(e){}
    try{
      if(hadSettings){W.settings=oldSettings;if(oldSettings&&typeof oldSettings==='object'){if(hadCat)oldSettings.cat=oldCat;else delete oldSettings.cat}}
      else delete W.settings;
    }catch(e){}
    if(hadPage)try{page=oldPage}catch(e){}
  }
  try{
    var r=fn(list);
    if(r&&typeof r.then==='function')return r.then(function(v){restore();return v},function(e){restore();throw e});
    restore();return r;
  }catch(e){restore();throw e}
}
W.lexV127OpenArchivePdf=function(){
  if(typeof W.lexV124OpenPdf!=='function'){notify('PDF motoru kullanılamıyor.');return}
  withArchivePdfContext(function(){W.lexV124OpenPdf('list')});
  var p=Math.max(0,Number(W.__lexArchiveListPage)||0),from=byId('lexV124PdfFrom'),to=byId('lexV124PdfTo'),name=byId('lexV124PdfName');
  if(from)from.value=p+1;if(to)to.value=p+1;
  if(name)name.value='LexLingo_Arsiv_Listesi_'+new Date().toISOString().slice(0,10)+'.pdf';
  var box=D.querySelector('.lexV124PdfBox'),button=box&&box.querySelector('button:last-child');
  if(button){button.setAttribute('onclick','lexV127GenerateArchivePdf()');button.textContent='Arşiv PDF oluştur ve kaydet'}
};
W.lexV127GenerateArchivePdf=function(){
  if(typeof W.lexV124GeneratePdf!=='function'){notify('PDF motoru kullanılamıyor.');return}
  return withArchivePdfContext(function(){return W.lexV124GeneratePdf('list')});
};
W.lexV126OpenArchivePdf=W.lexV127OpenArchivePdf;
W.lexV126GenerateArchivePdf=W.lexV127GenerateArchivePdf;

function injectArchivePdf(){
  if(!W.__lexArchiveMode||W.__lexArchiveView!=='list')return;
  var card=D.querySelector('#view .lexV110ArchiveList,#view .lexArchiveListCard');if(!card)return;
  var b=byId('lexV126ArchivePdf')||byId('lexV127ArchivePdf');
  if(!b){b=D.createElement('button');b.id='lexV127ArchivePdf';b.type='button';b.className='ghost lexV127PdfTrigger';b.textContent='PDF'}
  b.onclick=function(e){e.preventDefault();e.stopPropagation();W.lexV127OpenArchivePdf()};
  if(b.parentNode!==card)card.appendChild(b);
}
function normalizePdfButtons(){
  var list=byId('lexV124ListPdf'),book=byId('lexV124EbookPdf'),archive=byId('lexV126ArchivePdf')||byId('lexV127ArchivePdf');
  [list,book,archive].forEach(function(b){if(b)b.classList.add('lexV127PdfTrigger')});
  injectArchivePdf();
}
function installCss(){
  if(byId('lexV127Css'))return;
  var s=D.createElement('style');s.id='lexV127Css';
  s.textContent='\
#view .lexV110ListCard,#view .lexV110ArchiveList,#view .lexArchiveListCard{position:relative!important}\
.lexV127PdfTrigger{font-size:8px!important;font-weight:600!important;letter-spacing:.02em!important;line-height:1!important;min-width:0!important;width:auto!important;min-height:22px!important;height:22px!important;padding:2px 7px!important;border-radius:8px!important;opacity:.68!important;white-space:nowrap!important;box-shadow:none!important}\
.lexV127PdfTrigger:focus,.lexV127PdfTrigger:active,.lexV127PdfTrigger:hover{opacity:1!important}\
#lexV124ListPdf,#lexV126ArchivePdf,#lexV127ArchivePdf{position:absolute!important;top:8px!important;right:8px!important;margin:0!important;z-index:3!important}\
#lexV124EbookPdf{margin-left:auto!important;align-self:center!important}\
';
  D.head.appendChild(s);
}
function sync(){installCss();blurCurrentCard();normalizePdfButtons()}
function boot(){
  sync();
  var v=byId('view');
  if(v&&W.MutationObserver){try{new MutationObserver(function(){sync()}).observe(v,{childList:true,subtree:true})}catch(e){}}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
