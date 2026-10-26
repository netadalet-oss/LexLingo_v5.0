(function(){
'use strict';
var W=window,D=document;
if(W.__LEX_V132_AR_CARD_PRON_TTS_MATCH__)return;
W.__LEX_V132_AR_CARD_PRON_TTS_MATCH__='2026.07.20-v132-ar-card-pronunciation-same-as-example';

var prior=W.v11PronLine||(typeof v11PronLine==='function'?v11PronLine:null);
if(typeof prior!=='function')return;

function currentWord(){
  try{if(typeof W.current==='function')return W.current()||null}catch(e){}
  try{if(typeof current==='function')return current()||null}catch(e){}
  return null;
}
function arabicOf(x){
  try{if(typeof W.fieldByLang==='function')return String(W.fieldByLang(x,'AR')||'')}catch(e){}
  return String(x&&x.ar||'');
}
function sameArabicButton(ar,read,key){
  try{
    var make=W.spLang||(typeof spLang==='function'?spLang:null);
    if(typeof make==='function')return make(ar,'ar-SA',key,read);
  }catch(e){}
  return '';
}

W.v11PronLine=function(label,read,key){
  var html=prior.apply(this,arguments);
  /* Only the Arabic-pronunciation row of the main word card is changed.
     Its speaker now uses the exact same spLang/speakArabicSafe path as
     the Arabic row in the example-sentence card. */
  if(!/^v11rowAR/i.test(String(key||''))||!String(read||'').trim())return html;
  var ar=arabicOf(currentWord()).trim();
  if(!ar)return html;
  var button=sameArabicButton(ar,String(read),String(key));
  if(!button)return html;
  return String(html).replace(/<button\b[\s\S]*?<\/button>/i,button);
};
try{v11PronLine=W.v11PronLine}catch(e){}

function refresh(){
  try{
    var m=String(W.mode||(typeof mode!=='undefined'?mode:'')).toLowerCase();
    if(m==='learn'&&typeof W.render==='function')W.render();
  }catch(e){}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',function(){setTimeout(refresh,0)},{once:true});
else setTimeout(refresh,0);
})();
