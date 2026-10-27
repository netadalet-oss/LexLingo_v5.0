(function(){
'use strict';
if(window.__LEX_V129_FINAL__)return;
window.__LEX_V129_FINAL__='2026.07.19-v129-six-second-opening-uninterrupted-tts';
var W=window,D=document;
function byId(id){return D.getElementById(id)}
function text(v){return String(v==null?'':v)}
function clean(v){return text(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function norm(v){return text(v).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
function upper(v){return text(v).toUpperCase()}
function enc(v){try{return encodeURIComponent(text(v)).replace(/'/g,'%27')}catch(e){return ''}}
function dec(v){try{return decodeURIComponent(text(v))}catch(e){return text(v)}}
function notify(v){try{return (W.gold||W.msg||W.toast||function(){})(v)}catch(e){}}
function catOf(x){return text(x&&(x.cat||x.source||x.__origCat))}
function isQuran(x){var c=norm(catOf(x));return /kur an|kuran|quran|mushaf/.test(c)}
function isA0A2(x){var c=norm(catOf(x));return /a0\s*a2|temel kelimeler/.test(c)}
function field(x,c){try{if(typeof W.fieldByLang==='function')return text(W.fieldByLang(x,c)||'')}catch(e){}var m={NL:'nl',EN:'en',TR:'tr',AR:'ar',RU:'ru'};return text(x&&x[m[upper(c)]])}
function reading(x,c){c=upper(c);var m={NL:'read',EN:'en_read',TR:'tr_read',AR:'ar_read',RU:'ru_read'};return text(x&&x[m[c]])}
function langLabel(c){try{var m=typeof W.langMeta==='function'?(W.langMeta(c)||{}):{};if(m.label)return m.label}catch(e){}return {AR:'Arapça',RU:'Rusça'}[upper(c)]||c}
function rowCode(r){return upper((r&&r[4])||(r&&r.code)||'')}
function makeRow(x,c){var val=field(x,c),rd=reading(x,c);return [langLabel(c),val,rd||val,'tr-TR',upper(c),rd||'']}

/* Category-specific translation rows:
   Qur'an: main rows + Arabic only.
   A0-A2: main rows + Arabic and Russian. */
var baseRows=W.translationRows || (typeof translationRows==='function'?translationRows:null);
W.translationRows=function(x){
  var rows=[];
  try{rows=baseRows?baseRows.apply(this,arguments)||[]:[]}catch(e){rows=[]}
  rows=(rows||[]).map(function(r){return Array.isArray(r)?r.slice():r});
  if(isQuran(x)){
    rows=rows.filter(function(r){var c=rowCode(r);var l=norm(r&&r[0]);return c!=='AR'&&c!=='RU'&&!/arap|rus/.test(l)});
    rows.push(makeRow(x,'AR'));
  }else if(isA0A2(x)){
    rows=rows.filter(function(r){var c=rowCode(r);var l=norm(r&&r[0]);return c!=='AR'&&c!=='RU'&&!/arap|rus/.test(l)});
    rows.push(makeRow(x,'AR')); rows.push(makeRow(x,'RU'));
  }
  return rows;
};
try{translationRows=W.translationRows}catch(e){}

/* Read Arabic and Russian through their Turkish-alphabet Latin readings. */
function currentItem(){
  try{
    if(W.__lexArchiveMode&&typeof W.lexArchiveList==='function'){
      var a=W.lexArchiveList()||[];return a[Math.max(0,Number(W.__lexArchiveIdx)||0)]||null;
    }
  }catch(e){}
  try{if(typeof W.current==='function')return W.current()||null}catch(e){}
  try{if(typeof current==='function')return current()||null}catch(e){}
  return null;
}
function buttonLine(btn){
  try{
    var r=btn&&btn.closest&&btn.closest('.line');if(!r)return {label:'',value:''};
    var l=r.querySelector('.label'),v=r.querySelector('.value');
    return {label:norm(l&&l.textContent),value:clean(v&&v.textContent)}
  }catch(e){return {label:'',value:''}}
}
function hasArabic(v){return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text(v))}
function hasCyrillic(v){return /[\u0400-\u04FF]/.test(text(v))}
function isExampleControl(btn){
  try{return !!(btn&&btn.closest&&btn.closest('.card.example,#v9ExamplePager,.v9ExamplePager,.lexV111ExampleStable'))}catch(e){return false}
}
function spoken(raw,lang,btn){
  var s=clean(raw),line=buttonLine(btn),item=currentItem(),l=text(lang).toLowerCase();
  /* Example-sentence controls already pass the complete sentence or its
     complete Latin/Turkish-alphabet reading. Never replace that payload
     with the current card word's reading. */
  if(isExampleControl(btn))return s;
  if(l.indexOf('ar')===0||/arap/.test(line.label)){
    if(s&&!hasArabic(s))return s;
    var ar=clean(reading(item,'AR'));return ar||s;
  }
  if(l.indexOf('ru')===0||/rus/.test(line.label)){
    if(s&&!hasCyrillic(s))return s;
    var ru=clean(reading(item,'RU'));return ru||s;
  }
  return s;
}
function spokenLang(raw,lang,btn){
  var s=clean(raw),line=buttonLine(btn),l=text(lang).toLowerCase();
  if(isExampleControl(btn)){
    if((l.indexOf('ar')===0&&!hasArabic(s))||(l.indexOf('ru')===0&&!hasCyrillic(s)))return 'tr-TR';
    return lang||'nl-NL';
  }
  if((l.indexOf('ar')===0||/arap/.test(line.label))&&!hasArabic(spoken(raw,lang,btn)))return 'tr-TR';
  if((l.indexOf('ru')===0||/rus/.test(line.label))&&!hasCyrillic(spoken(raw,lang,btn)))return 'tr-TR';
  return lang||'nl-NL';
}

/* One utterance is sent to Android TTS. The former implementation sent
   timed fragments; every native call flushed the preceding fragment. */
var state={token:0,key:'',button:null,timer:null,utterance:null};
function clearButton(){try{if(state.button)state.button.classList.remove('playing','stop')}catch(e){}state.button=null}
function stopQueue(){
  state.token++;state.key='';
  if(state.timer){clearTimeout(state.timer);state.timer=null}
  clearButton();
  try{if(W.AndroidBridge&&AndroidBridge.stop)AndroidBridge.stop()}catch(e){}
  try{if(W.speechSynthesis)speechSynthesis.cancel()}catch(e){}
}
function done(token){if(token!==state.token)return;state.key='';state.utterance=null;if(state.timer){clearTimeout(state.timer);state.timer=null}clearButton()}
function chooseVoice(lang){
  try{
    var code=text(lang).slice(0,2).toLowerCase(),vs=speechSynthesis.getVoices?speechSynthesis.getVoices():[];
    return vs.find(function(v){return text(v.lang).toLowerCase()===text(lang).toLowerCase()})||
           vs.find(function(v){return text(v.lang).toLowerCase().indexOf(code)===0})||null;
  }catch(e){return null}
}
function browserSpeak(full,lang,token){
  try{
    var u=new SpeechSynthesisUtterance(full);state.utterance=u;
    u.lang=lang||'nl-NL';u.rate=/^tr/i.test(lang)?0.92:/^ar/i.test(lang)?0.84:/^ru/i.test(lang)?0.90:0.90;u.pitch=1;u.volume=1;
    var v=chooseVoice(lang);if(v)u.voice=v;
    u.onend=function(){done(token)};
    u.onerror=function(){if(token===state.token){notify('Seslendirme tamamlanamadı.');done(token)}};
    speechSynthesis.speak(u);return true;
  }catch(e){return false}
}
function speakQueue(raw,lang,key,btn){
  var full=spoken(raw,lang,btn),voiceLang=spokenLang(raw,lang,btn);
  if(!full){notify('Seslendirilecek metin yok.');return false}
  if(state.key&&state.key===text(key)){stopQueue();return true}
  stopQueue();
  state.key=text(key||('tts-'+Date.now()));state.button=btn||null;
  try{if(state.button)state.button.classList.add('playing','stop')}catch(e){}
  var token=state.token;
  try{
    if(W.AndroidBridge&&typeof AndroidBridge.speak==='function'){
      /* Complete text, one call: no flush between fragments and no cut-off. */
      AndroidBridge.speak(full,voiceLang);
      var cps=/^tr/i.test(voiceLang)?9.0:/^ar/i.test(voiceLang)?8.0:/^ru/i.test(voiceLang)?8.5:9.0;
      state.timer=setTimeout(function(){done(token)},Math.max(1800,Math.ceil(full.length/cps*1000)+900));
      return true;
    }
  }catch(e){}
  try{
    if('speechSynthesis' in W&&typeof SpeechSynthesisUtterance!=='undefined'){
      /* Browser engine also receives one complete utterance. */
      return browserSpeak(full,voiceLang,token);
    }
  }catch(e){}
  notify('Ses desteği bu cihazda kullanılamadı.');done(token);return false;
}
W.stopAudio=stopQueue;try{stopAudio=W.stopAudio}catch(e){}
W.speak=function(v,l,k,b){return speakQueue(v,l,k,b)};try{speak=W.speak}catch(e){}
W.speakSafe=function(v,l,k,b){return speakQueue(dec(v),l,k,b)};try{speakSafe=W.speakSafe}catch(e){}
W.speakArabicSafe=function(a,r,k,b){var rd=clean(dec(r));return speakQueue(rd||dec(a),'tr-TR',k,b)};try{speakArabicSafe=W.speakArabicSafe}catch(e){}
W.addEventListener('pagehide',stopQueue,{capture:true});
W.addEventListener('beforeunload',stopQueue,{capture:true});

/* Opening implementation removed; opening_v134.js is the only controller. */
})();