(function(){
'use strict';
if(window.__LEX_V131_LAYOUT_REFINEMENT__)return;
window.__LEX_V131_LAYOUT_REFINEMENT__='2026.07.20-v131-layout-refinement';
var W=window,D=document,timer=0;
function byId(id){return D.getElementById(id)}
function directSpans(el){var out=[];if(!el)return out;for(var i=0;i<el.children.length;i++)if(el.children[i].tagName==='SPAN')out.push(el.children[i]);return out}
function placeListPdf(){
  var b=byId('lexV124ListPdf'),bar=D.querySelector('#view .lexV110ListCard .listPage');
  if(!b||!bar)return;
  var spans=directSpans(bar),before=spans[1]||null;
  if(b.parentNode!==bar||b.nextElementSibling!==before)bar.insertBefore(b,before);
  b.classList.add('lexV131ListPdf');
}
function placeEbookPdf(){
  var b=byId('lexV124EbookPdf'),bar=D.querySelector('#view .lexV125SectionBar');
  if(!b||!bar)return;
  if(b.parentNode!==bar)bar.appendChild(b);
  b.classList.add('lexV131EbookPdf');
}
function sync(){clearTimeout(timer);timer=setTimeout(function(){placeListPdf();placeEbookPdf()},18)}
function installCss(){
  if(byId('lexV131Css'))return;
  var s=D.createElement('style');s.id='lexV131Css';s.textContent=`
/* Kelime kartı: başlık sözcüğü yalnızca bir kademe küçültülür. */
html body #view>section.card.lexV99WordCard:not(.example) .word,
html body #view>section.card.lexV98WordTitleCompact:not(.example) .word,
html body #view>section.card.lexV97WordCard:not(.example) .word,
html body #view>section.card.lexV95WordCard:not(.example) .word,
html body #view>#lexArchiveCard .word{
  font-size:calc(22px * var(--ui,1))!important;
}
@media(max-width:420px){
  html body #view>section.card.lexV99WordCard:not(.example) .word,
  html body #view>section.card.lexV98WordTitleCompact:not(.example) .word,
  html body #view>section.card.lexV97WordCard:not(.example) .word,
  html body #view>section.card.lexV95WordCard:not(.example) .word,
  html body #view>#lexArchiveCard .word{font-size:calc(21px * var(--ui,1))!important}
}

/* Liste: PDF, sayfa bilgi satırında bağımsız orta hücre; gezinme tuşlarına taşmaz. */
#view .lexV110ListCard .listPage{
  display:grid!important;
  grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)!important;
  align-items:center!important;
  column-gap:7px!important;
}
#view .lexV110ListCard .listPage>span{min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#view .lexV110ListCard .listPage>span:first-child{text-align:left!important}
#view .lexV110ListCard .listPage>span:last-child{text-align:right!important}
#lexV124ListPdf.lexV131ListPdf{
  position:static!important;
  inset:auto!important;
  z-index:auto!important;
  margin:0!important;
  justify-self:center!important;
  width:auto!important;
  min-width:36px!important;
  height:23px!important;
  min-height:23px!important;
  padding:2px 7px!important;
  border-radius:8px!important;
  font-size:8.5px!important;
  line-height:1!important;
  opacity:.82!important;
}

/* E-kitap: bölüm, Oku ve PDF aynı mevcut üst satırda kalır. */
#view .lexV125SectionBar{
  grid-template-columns:minmax(0,1fr) auto auto!important;
  align-items:stretch!important;
}
#lexV124EbookPdf.lexV131EbookPdf{
  position:static!important;
  inset:auto!important;
  margin:0!important;
  align-self:stretch!important;
  justify-self:end!important;
  width:45px!important;
  min-width:45px!important;
  height:auto!important;
  min-height:42px!important;
  padding:0 6px!important;
  border-radius:14px!important;
  font-size:8.5px!important;
  line-height:1!important;
  opacity:.82!important;
}

/* Gramer: dengeli, düzenli ve tutarlı tipografik hiyerarşi. */
.gfRoot{
  --gfText:14px;
  --gfSmall:12.25px;
  --gfSub:13px;
  --gfH3:17px;
  --gfH2:20px;
  --gfH1:23px;
  font-size:var(--gfText)!important;
  line-height:1.62!important;
  font-weight:400!important;
  letter-spacing:.002em;
}
.gfRoot p,.gfRoot li,.gfRoot td,.gfRoot small,.gfRoot span{font-weight:400}
.gfTop b{font-size:17px!important;font-weight:720!important;line-height:1.25!important}
.gfTop span{font-size:var(--gfSmall)!important;line-height:1.4!important}
.gfTopStat strong,.gfPosition strong{font-size:14px!important;font-weight:720!important}
.gfTopStat small,.gfPosition small{font-size:11.5px!important;line-height:1.35!important}
.gfHero>div>span,.gfLessonHero>span,.gfBlockTitle>span{font-size:10px!important;font-weight:650!important;letter-spacing:.11em!important}
.gfHero h2{font-size:var(--gfH2)!important;line-height:1.3!important;font-weight:740!important;margin:6px 0 8px!important}
.gfHero p{font-size:var(--gfText)!important;line-height:1.65!important;font-weight:400!important}
.gfHomeMeta{font-size:12px!important;font-weight:500!important}
.gfUnit summary b{font-size:15px!important;line-height:1.35!important;font-weight:700!important}
.gfUnit summary small{font-size:12.25px!important;line-height:1.5!important;font-weight:400!important}
.gfUnit summary em{font-size:11.5px!important;font-weight:650!important}
.gfTopicRow>span{font-size:10.5px!important;font-weight:650!important}
.gfTopicRow b{font-size:14px!important;line-height:1.42!important;font-weight:650!important}
.gfTopicRow small{font-size:12.25px!important;line-height:1.5!important;font-weight:400!important}
.gfSourceNote b{font-size:13px!important;font-weight:680!important}
.gfSourceNote p{font-size:12.5px!important;line-height:1.58!important;font-weight:400!important}
.gfTopicTop>button{font-size:12px!important;font-weight:650!important}
.gfTopicTop>div:nth-child(2) b{font-size:13.5px!important;line-height:1.35!important;font-weight:700!important}
.gfTopicTop>div:nth-child(2) span{font-size:11.5px!important;line-height:1.4!important}
.gfLessonHero h1{font-size:var(--gfH1)!important;line-height:1.25!important;font-weight:750!important;margin:7px 0 9px!important}
.gfLessonHero p{font-size:14.25px!important;line-height:1.68!important;font-weight:400!important}
.gfLessonActions button,.gfCompleteBottom button,.gfNav button{font-size:12px!important;font-weight:650!important}
.gfQuick a{font-size:12px!important;line-height:1.2!important;font-weight:600!important}
.gfSectionHead>span{font-size:11px!important;font-weight:700!important}
.gfSectionHead h3,.gfBlockTitle h3{font-size:var(--gfH3)!important;line-height:1.36!important;font-weight:720!important}
.gfSectionHead p{font-size:12.75px!important;line-height:1.52!important;font-weight:400!important}
.gfFormula small{font-size:9.5px!important;font-weight:650!important}
.gfFormula b{font-size:14px!important;line-height:1.58!important;font-weight:650!important}
.gfMemory b{font-size:12px!important;font-weight:680!important}
.gfMemory p{font-size:13.5px!important;line-height:1.62!important;font-weight:400!important}
.gfExplain p{font-size:14.25px!important;line-height:1.72!important;font-weight:400!important}
.gfExamples h4,.gfPit h4{font-size:12.5px!important;line-height:1.35!important;font-weight:700!important}
.gfExample b{font-size:14px!important;line-height:1.52!important;font-weight:620!important}
.gfExample span{font-size:12.75px!important;line-height:1.52!important;font-weight:400!important}
.gfPit li{font-size:13px!important;line-height:1.62!important;font-weight:400!important}
.gfTableWrap th{font-size:12px!important;line-height:1.45!important;font-weight:700!important}
.gfTableWrap td{font-size:12.75px!important;line-height:1.55!important;font-weight:400!important}
.gfRefSearch small{font-size:11.5px!important}
.gfPracticeIntro{font-size:13.5px!important;line-height:1.66!important;font-weight:400!important}
.gfQuestion summary span{font-size:10.5px!important;font-weight:700!important}
.gfQuestion summary b{font-size:13.5px!important;line-height:1.58!important;font-weight:620!important}
.gfQuestion>div small{font-size:9.5px!important;font-weight:650!important}
.gfQuestion>div p{font-size:13.5px!important;line-height:1.68!important;font-weight:400!important}
.gfSources article b{font-size:13px!important;line-height:1.4!important;font-weight:680!important}
.gfSources article p{font-size:12.25px!important;line-height:1.58!important;font-weight:400!important}
@media(min-width:720px){
  .gfRoot{--gfText:14.5px;--gfSmall:12.5px;--gfH3:18px;--gfH2:21px;--gfH1:24px}
}
`;
  D.head.appendChild(s);
}
function boot(){
  installCss();sync();
  var v=byId('view');
  if(v&&W.MutationObserver)new MutationObserver(sync).observe(v,{childList:true,subtree:true});
  [80,250,700,1500].forEach(function(ms){setTimeout(sync,ms)});
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
