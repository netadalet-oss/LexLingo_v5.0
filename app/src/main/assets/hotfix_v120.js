(function(){
'use strict';
if(window.__LEX_V120_LIST_UI_AUDIO__)return;
window.__LEX_V120_LIST_UI_AUDIO__='2026.07.16-v120-list-ui-audio';
var W=window,D=document;
function byId(x){return D.getElementById(x)}
function installCss(){
  if(byId('lexV120Css'))return;
  var s=D.createElement('style');
  s.id='lexV120Css';
  s.textContent=`
/* V120: list rendering is isolated from the sticky page chrome to avoid scroll stalls. */
body.lexV120ListActive .appHeader,body.lexV120ListActive .tabs{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
body.lexV120ListActive .appHeader{background:linear-gradient(180deg,#030812 0,#061226 100%)!important}
body.lexV120ListActive .tabs{background:linear-gradient(180deg,#071326 0,#020812 100%)!important}
.lexV110ListCard{overflow:hidden!important;border-radius:22px!important;background:radial-gradient(circle at 92% 0,rgba(45,135,194,.13),transparent 34%),linear-gradient(155deg,rgba(10,28,52,.99),rgba(3,13,29,.99))!important;border:1px solid rgba(112,172,217,.25)!important;box-shadow:0 14px 34px rgba(0,0,0,.27)!important}
.lexV110ListCard>.badge{background:linear-gradient(135deg,rgba(26,86,127,.55),rgba(12,43,76,.72))!important;border-color:rgba(98,196,238,.34)!important;color:#d9f4ff!important;box-shadow:none!important}
.lexV110ListCard .lexV110ListHint{padding:7px 10px!important;border-radius:12px!important;background:rgba(7,20,39,.62)!important;border:1px solid rgba(148,190,222,.13)!important;color:#9fb0c6!important}
.lexV110ListCard .listPage{margin:7px 1px!important;padding:7px 9px!important;border-radius:12px!important;background:linear-gradient(90deg,rgba(216,179,95,.10),rgba(24,63,101,.28))!important;border:1px solid rgba(216,179,95,.18)!important;color:#dce8f7!important}
.lexV110ListCard .listBox{
  height:clamp(300px,calc(100dvh - var(--headerH,220px) - 190px),62vh)!important;
  max-height:none!important;min-height:260px!important;overflow-x:hidden!important;overflow-y:auto!important;
  -webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:auto!important;
  scroll-behavior:auto!important;overflow-anchor:none!important;scrollbar-width:thin!important;
  contain:layout paint style!important;transform:translateZ(0);backface-visibility:hidden;
  padding:3px 2px 5px!important;border-radius:16px!important;background:rgba(1,8,18,.48)!important;
}
.lexV110ListCard .listItem{
  position:relative;min-height:52px!important;margin:4px 1px!important;padding:6px 7px!important;border-radius:15px!important;
  border:1px solid rgba(119,171,210,.16)!important;border-left:3px solid rgba(64,190,233,.55)!important;
  background:linear-gradient(135deg,rgba(18,46,80,.94),rgba(6,22,42,.98))!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;touch-action:pan-y!important;overflow-anchor:none!important;
  contain:layout paint style!important;content-visibility:auto;contain-intrinsic-size:auto 52px;
}
.lexV110ListCard .listItem:nth-child(3n+2){background:linear-gradient(135deg,rgba(13,39,72,.96),rgba(5,18,36,.99))!important;border-left-color:rgba(216,179,95,.58)!important}
.lexV110ListCard .listItem:nth-child(3n){background:linear-gradient(135deg,rgba(16,50,78,.94),rgba(5,21,39,.99))!important;border-left-color:rgba(96,165,250,.55)!important}
.lexV110ListCard .listItem:active{background:linear-gradient(135deg,rgba(24,69,108,.98),rgba(8,30,54,.99))!important}
.lexV110ListCard .listItem.lexV110Selected{outline:1px solid rgba(244,218,143,.8)!important;border-color:rgba(216,179,95,.58)!important;background:linear-gradient(135deg,rgba(83,67,31,.62),rgba(9,31,53,.98))!important}
.lexV110ListCard .listItem>div:nth-of-type(2){min-width:0!important;padding:6px 9px!important;border-radius:11px!important;background:linear-gradient(180deg,rgba(2,12,26,.48),rgba(3,17,34,.70))!important;border:1px solid rgba(158,197,225,.09)!important}
.lexV110ListCard .listItem:nth-child(even)>div:nth-of-type(2){background:linear-gradient(180deg,rgba(7,24,44,.62),rgba(2,13,28,.72))!important}
.lexV110ListCard .listItem b{color:#f4f8ff!important;font-weight:820!important;letter-spacing:.01em!important}
.lexV110ListCard .listItem small{color:#a9b9ce!important;line-height:1.35!important}
.lexV110ListCard .listItem .speaker,.lexV110ListCard .listItem .iconBtn{box-shadow:none!important;transform:none!important}
.lexV110ListCard .listItem .iconBtn{background:rgba(15,43,72,.78)!important;border:1px solid rgba(95,176,222,.22)!important;color:#d8f2ff!important;border-radius:11px!important}
.lexV110ListCard .moduleNav{position:relative;z-index:2;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important;margin-top:8px!important}
.lexV110ListCard .moduleNav button{min-width:0!important;width:100%!important;box-shadow:none!important}
/* Bottom module buttons always consume the complete available row, including safe-area devices. */
.tabs{left:0!important;right:0!important;width:100%!important;max-width:none!important;padding-left:max(4px,env(safe-area-inset-left))!important;padding-right:max(4px,env(safe-area-inset-right))!important;box-sizing:border-box!important}
.tabsInner{display:flex!important;grid-template-columns:none!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;gap:4px!important;overflow:hidden!important}
.tabsInner>.tabBtn{flex:1 1 0!important;width:auto!important;min-width:0!important;max-width:none!important;margin:0!important;padding-left:1px!important;padding-right:1px!important}
@media (max-width:420px){.tabsInner{gap:2px!important}.tabsInner>.tabBtn{border-radius:9px!important}.tabBtn span:last-child{font-size:8.2px!important}}
@media (prefers-reduced-motion:reduce){.lexV110ListCard .listItem{content-visibility:visible}}
`;
  D.head.appendChild(s);
}
function syncListState(){
  var active=!!D.querySelector('#view .lexV110ListCard');
  D.body.classList.toggle('lexV120ListActive',active);
  var box=D.querySelector('#view .lexV110ListCard .listBox');
  if(box&&!box.__lexV120Ready){
    box.__lexV120Ready=1;
    box.setAttribute('role','list');
    box.addEventListener('touchstart',function(){D.body.classList.add('lexV120ListScrolling')},{passive:true});
    box.addEventListener('touchend',function(){D.body.classList.remove('lexV120ListScrolling')},{passive:true});
    box.addEventListener('touchcancel',function(){D.body.classList.remove('lexV120ListScrolling')},{passive:true});
  }
}
function boot(){
  installCss();
  syncListState();
  var v=byId('view');
  if(v&&W.MutationObserver){
    try{new MutationObserver(function(){syncListState()}).observe(v,{childList:true,subtree:false})}catch(e){}
  }
  [0,180,900,1900].forEach(function(ms){setTimeout(syncListState,ms)});
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
