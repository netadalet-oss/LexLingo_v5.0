(function(){
'use strict';
var W=window,D=document;
if(W.__LEX_OPENING_V134_SINGLE_OWNER__)return;
W.__LEX_OPENING_V134_SINGLE_OWNER__='2026.07.20-v138-copyright-first-second-3s-hold';
var COPYRIGHT_HOLD_MS=3000,holdTimer=0,fallbackTimer=0,sequence=0,initialConsumed=false;
var prepareLastCard=typeof W.lexV118PrepareLastCard==='function'?W.lexV118PrepareLastCard:null;
var sceneHtml='<div class="lexV134Stars"></div><div class="lexV134Stage"><div class="lexV134Logo"><img src="logo.jpg" alt="LexLingo"></div><div class="lexV134Title">LexLingo</div><div class="lexV134Sub">Legal • Language • Learning</div><div class="lexV134Flags"><div class="lexV134Flag" aria-label="Nederland">🇳🇱</div><div class="lexV134Flag" aria-label="English">🇬🇧</div><div class="lexV134Flag" aria-label="Türkiye">🇹🇷</div></div><div class="lexV134Copyright"><span class="lexV134CopyrightSymbol">©</span> Av. Can KIZILYAR</div><div class="lexV134Line"></div></div><audio id="lexOpeningV134Audio" preload="auto" playsinline src="audio/lexlingo_opening.wav"></audio>';
function byId(id){return D.getElementById(id)}
function clearTimers(){clearTimeout(holdTimer);clearTimeout(fallbackTimer);holdTimer=0;fallbackTimer=0}
function stopAudio(){try{var a=byId('lexOpeningV134Audio');if(a){a.pause();a.currentTime=0}}catch(e){}}
function purgeLegacy(){
  try{D.querySelectorAll('#lexV118Splash').forEach(function(n){n.remove()})}catch(e){}
  D.documentElement.classList.remove('lexBooting','lexV119OpeningActive');
  if(D.body)D.body.classList.remove('lexBooting','lexV119OpeningActive');
}
function ensureScene(reset){
  purgeLegacy();
  var s=byId('lexOpeningV134');
  if(!s){s=D.createElement('div');s.id='lexOpeningV134';s.setAttribute('role','presentation');s.setAttribute('aria-hidden','true');if(D.body)D.body.insertBefore(s,D.body.firstChild)}
  if(reset||!s.querySelector('.lexV134Copyright'))s.innerHTML=sceneHtml;
  return s;
}
function playAudio(reset){try{var a=byId('lexOpeningV134Audio');if(a){if(reset)a.currentTime=0;var p=a.play();if(p&&p.catch)p.catch(function(){})}}catch(e){}}
function reveal(token,isInitial){
  if(token!==sequence)return;
  clearTimers();
  if(isInitial&&prepareLastCard){try{prepareLastCard()}catch(e){}}
  stopAudio();
  var s=byId('lexOpeningV134');
  D.documentElement.classList.remove('lexOpeningV134Active','lexBooting','lexV119OpeningActive');
  if(D.body)D.body.classList.remove('lexOpeningV134Active','lexBooting','lexV119OpeningActive');
  try{if(s)s.remove()}catch(e){}
}
function holdAfterCopyright(token,isInitial){
  clearTimers();
  var armed=false;
  function beginHold(){
    if(armed||token!==sequence)return;
    armed=true;
    clearTimeout(fallbackTimer);fallbackTimer=0;
    holdTimer=setTimeout(function(){reveal(token,isInitial)},COPYRIGHT_HOLD_MS);
  }
  var copy=byId('lexOpeningV134')&&byId('lexOpeningV134').querySelector('.lexV134Copyright');
  if(copy){
    copy.addEventListener('animationend',function(e){if(!e||!e.animationName||e.animationName==='lexV134CopyrightIn')beginHold()},{once:true});
    try{
      var animations=typeof copy.getAnimations==='function'?copy.getAnimations():[];
      var animation=animations&&animations.find?animations.find(function(a){return !a.animationName||a.animationName==='lexV134CopyrightIn'}):null;
      if(animation){
        if(animation.playState==='finished')requestAnimationFrame(beginHold);
        else if(animation.finished&&typeof animation.finished.then==='function')animation.finished.then(beginHold).catch(function(){});
      }
    }catch(e){}
  }
  /* Güvenlik ağı: CSS animation olayı alınamazsa telifin görünmesi için yeterli süre verilir,
     ardından yine tam üç saniyelik sabit bekleme başlatılır. */
  fallbackTimer=setTimeout(beginHold,3200);
}
function start(replay){
  sequence++;var token=sequence;clearTimers();
  ensureScene(!!replay);
  D.documentElement.classList.add('lexOpeningV134Active');
  if(D.body)D.body.classList.add('lexOpeningV134Active');
  if(replay){playAudio(true)}else{try{var initialAudio=byId('lexOpeningV134Audio');if(!W.__LEX_OPENING_AUDIO_EARLY_STARTED__||!initialAudio||initialAudio.paused)playAudio(false)}catch(e){playAudio(false)}}
  holdAfterCopyright(token,!replay);
  return false;
}
function bindLogo(){
  D.addEventListener('click',function(e){
    var logo=e.target&&e.target.closest&&e.target.closest('.logoImg');if(!logo)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(true);
  },true);
}
function init(){if(initialConsumed)return;initialConsumed=true;ensureScene(false);start(false);bindLogo()}
W.lexV134ReplayOpening=function(){return start(true)};
W.lexV119ReplayOpening=W.lexV134ReplayOpening;
W.lexV124PlayOpening=W.lexV134ReplayOpening;
W.lexV119FinishOpening=function(){return reveal(sequence,false)};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init,{once:true});else init();
W.addEventListener('pagehide',function(){clearTimers();stopAudio()},{capture:true});
})();
