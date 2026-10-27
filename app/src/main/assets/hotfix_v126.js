(function(){
'use strict';
if(window.__LEX_V126_CARD_AUDIO_ARCHIVE_PDF__)return;
window.__LEX_V126_CARD_AUDIO_ARCHIVE_PDF__='2026.07.19-v126-card-audio-archive-pdf';
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
  if(/okunuş|pronunciation|uitspraak|النطق|произношение/.test(n))return '';
  return LABEL_CODE[n]||'';
}
function mainWordCard(){
  var v=byId('view');if(!v)return null;
  return v.querySelector('#lexV111WordCard,#lexV110WordCard')||[].slice.call(v.children).find(function(n){return n.matches&&n.matches('section.card:not(.example)')})||null;
}

/* Kart aynı görev içinde hazırlanır: tarayıcı ilk kareyi çizmeden önce buzlama sınıfı eklenir. */
function applyBlurBeforePaint(){
  if(modeNow()!=='learn'||W.__lexArchiveMode)return;
  var card=mainWordCard();if(!card||card.dataset.lexV126BlurApplied==='1')return;
  card.dataset.lexV126BlurApplied='1';
  card.dataset.lexV125BlurApplied='1';
  var wanted=blurLang();if(wanted==='NONE')return;
  var rows=card.querySelectorAll('.line');
  for(var i=0;i<rows.length;i++){
    if(rowCode(rows[i])!==wanted)continue;
    var value=rows[i].querySelector('.value');
    if(value){value.classList.add('hidden');value.dataset.lexV126DefaultBlur=wanted}
    break;
  }
}

function hasArabic(v){return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text(v))}
function lineLabel(row){var e=row&&row.querySelector&&row.querySelector('.label');return norm(e&&e.textContent)}
function valueText(row){var e=row&&row.querySelector&&row.querySelector('.value');return text(e&&e.textContent).trim()}
function arabicReadFromCard(btn){
  try{
    var row=btn&&btn.closest&&btn.closest('.line'),card=row&&row.closest&&row.closest('section.card');
    if(card){
      var rows=card.querySelectorAll('.line');
      for(var i=0;i<rows.length;i++){
        var l=lineLabel(rows[i]);
        if(/arapça\s+okunuş|arapca\s+okunus|arabic\s+pronunciation|arabische\s+uitspraak|араб.*произнош|النطق.*العرب/.test(l)){
          var v=valueText(rows[i]);if(v&&!hasArabic(v))return v;
        }
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
    'ا':'a','أ':'a','إ':'i','آ':'â','ب':'b','ت':'t','ث':'s','ج':'c','ح':'h','خ':'h','د':'d','ذ':'z','ر':'r','ز':'z','س':'s','ش':'ş','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'','غ':'ğ','ف':'f','ق':'k','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','ة':'e','و':'v','ؤ':'u','ي':'y','ى':'a','ئ':'i','ء':'','َ':'a','ُ':'u','ِ':'i','ً':'an','ٌ':'un','ٍ':'in','ْ':'','ّ':''
  },out='';
  for(var i=0;i<s.length;i++)out+=Object.prototype.hasOwnProperty.call(map,s[i])?map[s[i]]:s[i];
  return out.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g,'').replace(/\s+/g,' ').trim();
}
function turkishArabicRead(raw,btn,explicit){
  var r=text(explicit).trim();
  if(r&&!hasArabic(r))return r;
  r=arabicReadFromCard(btn);if(r)return r;
  r=currentArabicRead();if(r&&!hasArabic(r))return r;
  return transliterateArabic(raw);
}

/* Arapça satırların sesi daima Türk alfabesiyle hazırlanmış Latince okunuştan ve Türkçe TTS'den üretilir. */
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

/* Arşiv liste görünümünde mevcut PDF motorunu, arşiv sayfasını ve seçimini koruyarak kullanır. */
W.lexV126OpenArchivePdf=function(){
  if(typeof W.lexV124OpenPdf!=='function'){notify('PDF motoru kullanılamıyor.');return}
  W.lexV124OpenPdf('archive');
  var p=Math.max(0,Number(W.__lexArchiveListPage)||0),from=byId('lexV124PdfFrom'),to=byId('lexV124PdfTo'),name=byId('lexV124PdfName');
  if(from)from.value=p+1;if(to)to.value=p+1;
  if(name)name.value='LexLingo_Arsiv_Listesi_'+new Date().toISOString().slice(0,10)+'.pdf';
  var box=D.querySelector('.lexV124PdfBox'),button=box&&box.querySelector('button:last-child');
  if(button){button.setAttribute('onclick','lexV126GenerateArchivePdf()');button.textContent='Arşiv PDF oluştur ve kaydet'}
};
W.lexV126GenerateArchivePdf=async function(){
  if(typeof W.lexV124GeneratePdf!=='function'){notify('PDF motoru kullanılamıyor.');return}
  var old=0,had=false;
  try{old=Number(page)||0;had=true;page=Math.max(0,Number(W.__lexArchiveListPage)||0)}catch(e){}
  try{return await W.lexV124GeneratePdf('archive')}
  finally{if(had)try{page=old}catch(e){}}
};
function injectArchivePdf(){
  if(!W.__lexArchiveMode||W.__lexArchiveView!=='list'||byId('lexV126ArchivePdf'))return;
  var card=D.querySelector('#view .lexV110ArchiveList,#view .lexArchiveListCard');if(!card)return;
  var bar=card.querySelector('.lexArchiveSwitch');
  var b=D.createElement('button');b.id='lexV126ArchivePdf';b.type='button';b.className='ghost lexV126ArchivePdf';b.textContent='PDF';b.onclick=function(e){e.preventDefault();e.stopPropagation();W.lexV126OpenArchivePdf()};
  if(bar)bar.appendChild(b);else card.insertBefore(b,card.firstChild);
}
function installCss(){
  if(byId('lexV126Css'))return;
  var s=D.createElement('style');s.id='lexV126Css';
  s.textContent='.lexV126ArchivePdf{border-color:rgba(244,218,143,.72)!important;white-space:nowrap!important}';
  D.head.appendChild(s);
}
function sync(){installCss();applyBlurBeforePaint();injectArchivePdf()}

var baseRender=W.render;
if(typeof baseRender==='function'){
  W.render=function(){var r=baseRender.apply(this,arguments);sync();return r};
  try{render=W.render}catch(e){}
}
function boot(){
  installCss();sync();
  var v=byId('view');
  if(v&&W.MutationObserver){try{new MutationObserver(function(){sync()}).observe(v,{childList:true,subtree:true})}catch(e){}}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
