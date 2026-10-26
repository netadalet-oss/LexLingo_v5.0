(function(){
'use strict';
if(window.__LEX_V125_DIRECTION_BLUR_FIX__)return;
window.__LEX_V125_DIRECTION_BLUR_FIX__='2026.07.19-v125-direction-blur-fix';
var W=window,D=document,P='lex_v3_',BLUR_KEY=P+'cardDefaultBlurLang';
var ALLOWED={NONE:1,NL:1,EN:1,TR:1,AR:1,RU:1};

function byId(id){return D.getElementById(id)}
function text(v){return String(v==null?'':v)}
function modeNow(){try{return text(mode||W.mode||'learn').toLowerCase()}catch(e){return text(W.mode||'learn').toLowerCase()}}
function notify(v){try{return (W.gold||W.msg||W.toast||function(){})(v)}catch(e){}}
function decode(v){try{return decodeURIComponent(text(v))}catch(e){return text(v)}}
function blurLang(){var v=text(localStorage.getItem(BLUR_KEY)||'TR').toUpperCase();return ALLOWED[v]?v:'TR'}
if(localStorage.getItem(BLUR_KEY)==null)localStorage.setItem(BLUR_KEY,'TR');

function directionLabel(code){
  try{var hit=DIRS.find(function(d){return d&&d[0]===code});return hit?hit[1]:code}catch(e){return code}
}
function validDirection(code){
  try{return DIRS.some(function(d){return d&&d[0]===code})}catch(e){return /^[A-Z]{2}(?:_[A-Z]{2})+$/.test(code)}
}
function refreshDirectionNow(){
  try{if(typeof W.updateHeaderMetrics==='function')W.updateHeaderMetrics();else if(typeof updateHeaderMetrics==='function')updateHeaderMetrics()}catch(e){}
  var b=byId('dirBtn');if(b)b.textContent=directionLabel((function(){try{return settings.dir}catch(e){return ''}})());
  try{if(typeof W.render==='function')W.render();else if(typeof render==='function')render()}catch(e){console.error('v125 immediate direction render',e)}
  postProcess();
  try{requestAnimationFrame(postProcess)}catch(e){}
  setTimeout(postProcess,0);
}
var oldChooseDir=W.__v10ChooseDir;
W.__v10ChooseDir=function(encoded){
  var next=decode(encoded).toUpperCase();
  if(!validDirection(next))return typeof oldChooseDir==='function'?oldChooseDir.apply(this,arguments):undefined;
  try{settings.dir=next}catch(e){W.settings=W.settings||{};W.settings.dir=next}
  try{localStorage.setItem(P+'dir',next)}catch(e){}
  try{if(typeof closeModal==='function')closeModal();else if(typeof W.closeModal==='function')W.closeModal()}catch(e){}
  refreshDirectionNow();
};

var LABEL_CODE={
  'tr':'TR','turkce':'TR','türkçe':'TR','turkish':'TR','turks':'TR','türkisch':'TR','турецкий':'TR','التركية':'TR',
  'en':'EN','ingilizce':'EN','ingilizce ':'EN','i̇ngilizce':'EN','english':'EN','engels':'EN','английский':'EN','الإنجليزية':'EN',
  'nl':'NL','hollandaca':'NL','nederlands':'NL','dutch':'NL','голландский':'NL','нидерландский':'NL','الهولندية':'NL',
  'ar':'AR','arapca':'AR','arapça':'AR','arabic':'AR','arabisch':'AR','арабский':'AR','العربية':'AR',
  'ru':'RU','rusca':'RU','rusça':'RU','russian':'RU','russisch':'RU','русский':'RU','الروسية':'RU'
};
function normalizeLabel(v){return text(v).trim().replace(/\s+/g,' ').replace(/:$/,'').toLocaleLowerCase('tr-TR')}
function rowCode(row){
  if(!row||row.classList.contains('pronLine'))return '';
  var label=row.querySelector('.label'),n=normalizeLabel(label&&label.textContent);
  if(/okunuş|pronunciation|uitspraak|النطق|произношение/.test(n))return '';
  return LABEL_CODE[n]||'';
}
function mainWordCard(){
  var v=byId('view');if(!v)return null;
  var sections=[].slice.call(v.children).filter(function(n){return n.matches&&n.matches('section.card')});
  return sections[0]||null;
}
function applyDefaultBlur(){
  if(modeNow()!=='learn'||W.__lexArchiveMode)return;
  var card=mainWordCard();if(!card||card.dataset.lexV125BlurApplied==='1')return;
  card.dataset.lexV125BlurApplied='1';
  var wanted=blurLang();if(wanted==='NONE')return;
  var rows=[].slice.call(card.querySelectorAll('.line'));
  for(var i=0;i<rows.length;i++){
    if(rowCode(rows[i])!==wanted)continue;
    var value=rows[i].querySelector('.value');
    if(value){value.classList.add('hidden');value.dataset.lexV125DefaultBlur=wanted}
    break;
  }
}

function uiLang(){try{return text(localStorage.getItem(P+'uiLang')||'TR').toUpperCase()}catch(e){return 'TR'}}
var COPY={
 TR:{title:'Kelime kartı varsayılan buzlu çeviri',desc:'Kart açıldığında seçilen dildeki çeviri buzlu görünür.',saved:'Varsayılan buzlu çeviri dili kaydedildi.'},
 EN:{title:'Default blurred translation on word card',desc:'The selected translation is blurred when a card opens.',saved:'Default blurred translation language saved.'},
 NL:{title:'Standaard vervaagde vertaling op woordkaart',desc:'De gekozen vertaling is vervaagd wanneer een kaart opent.',saved:'Standaardtaal voor vervaagde vertaling opgeslagen.'},
 AR:{title:'الترجمة الضبابية الافتراضية في بطاقة الكلمة',desc:'تظهر ترجمة اللغة المختارة ضبابية عند فتح البطاقة.',saved:'تم حفظ لغة الترجمة الضبابية الافتراضية.'},
 RU:{title:'Размытый перевод по умолчанию в карточке',desc:'При открытии карточки выбранный перевод показывается размытым.',saved:'Язык размытого перевода по умолчанию сохранён.'}
};
var OPTION_LABELS={NONE:'Buzlama yok',TR:'Türkçe',EN:'İngilizce',NL:'Hollandaca',AR:'Arapça',RU:'Rusça'};
function settingHtml(){
  var c=COPY[uiLang()]||COPY.TR,current=blurLang();
  var opts=['TR','EN','NL','AR','RU','NONE'].map(function(k){return '<option value="'+k+'" '+(current===k?'selected':'')+'>'+OPTION_LABELS[k]+'</option>'}).join('');
  return '<label id="lexV125BlurSetting" class="lexV125BlurSetting"><span><b>'+c.title+'</b><small>'+c.desc+'</small></span><select onchange="lexV125SetDefaultBlur(this.value)">'+opts+'</select></label>';
}
function injectSetting(){
  if(modeNow()!=='manage'||byId('lexV125BlurSetting'))return;
  var v=byId('view');if(!v)return;
  var body=v.querySelector('.lexV124SettingsGrid>details:first-child .lexV124SetBody');
  if(body){body.insertAdjacentHTML('beforeend',settingHtml());return}
  var grid=v.querySelector('.formGrid,.manageGrid,.settingsPanel');
  if(grid)grid.insertAdjacentHTML('afterbegin',settingHtml());
}
W.lexV125SetDefaultBlur=function(v){
  v=text(v).toUpperCase();if(!ALLOWED[v])v='TR';
  try{localStorage.setItem(BLUR_KEY,v)}catch(e){}
  notify((COPY[uiLang()]||COPY.TR).saved);
  if(modeNow()==='learn')refreshDirectionNow();
};

function installCss(){
  if(byId('lexV125Css'))return;
  var s=D.createElement('style');s.id='lexV125Css';
  s.textContent='.lexV125BlurSetting{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(118px,42%);gap:8px;align-items:center;padding:8px 9px;border-radius:10px;background:rgba(56,194,242,.07);color:var(--text)}.lexV125BlurSetting span{display:grid;gap:2px}.lexV125BlurSetting b{font-size:10px}.lexV125BlurSetting small{font-size:8px;color:#94a3b8;line-height:1.25}.lexV125BlurSetting select{min-height:34px;padding:5px 7px;font-size:10px}@media(max-width:390px){.lexV125BlurSetting{grid-template-columns:1fr}}';
  D.head.appendChild(s);
}
function postProcess(){installCss();applyDefaultBlur();injectSetting()}
function observe(){
  var v=byId('view');if(!v)return;
  var timer=0;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(postProcess,0)}).observe(v,{childList:true,subtree:true});
}
function boot(){installCss();observe();postProcess();setTimeout(postProcess,60);setTimeout(postProcess,400);setTimeout(postProcess,1900)}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
