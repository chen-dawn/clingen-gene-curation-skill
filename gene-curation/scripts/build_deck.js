/* Full ClinGen curation deck: white theme, Arial. Title -> framework -> one slide per proband
 * (clinical + variants + PMID + points) -> genetic total -> one detailed slide per experiment
 * (molecular findings + PMID + points + screenshot placeholder) -> experimental total -> classification.
 * Fill META, PROBANDS, EXPERIMENTS; run:  NODE_PATH="$(npm root -g)" node build_deck.js
 * (npm install -g pptxgenjs). LibreOffice/poppler usually absent on macOS -> can't render to
 * images; lay out carefully and have the user open the file.
 */
const pptxgen = require("pptxgenjs");
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
const TEAL="0E8F8C", TEALDK="0B6E6C", GREEN="2E7D4F", AMBER="B7791F", CORAL="C0504D",
      INK="222222", MUTE="6B7280", LINE="E2E6EA", BAND="F2F5F7", W=13.3, H=7.5, MX=0.7, F="Arial";
const shadow=()=>({type:"outer",color:"C7CFD6",blur:7,offset:2,angle:135,opacity:0.22});
const fmt=x=>{const c=Math.round(x*100);return (c/100).toFixed(c%10?2:1);};

// ============================== FILL THIS ==============================
const META={gene:"GENE",disease:"Disease name",moi:"Autosomal recessive",omim:"OMIM #XXXXXX",
  presenter:"Name",gcep:"ClinGen … GCEP",date:"[Meeting date]",sop:"SOP v10",
  genetic:12,experimental:6,total:18,classification:"DEFINITIVE"};

const PROBANDS=[{ label:"Author Case1", cite:"Author 20XX · PMID XXXXXXXX", flag:"",
  who:"Sex · ancestry · age",
  clinical:["Feature 1","Feature 2","Feature 3"],
  variants:[{hgvs:"c.___ (p.___)",type:"missense",pts:"0.1"},
            {hgvs:"c.___ (p.___)",type:"predicted/proven null",pts:"1.5"}],
  zyg:"compound heterozygous", score:1.5, rationale:"missense (0.1) + null (1.5) = 1.6 -> GCI 1.5" }];

const EXPERIMENTS=[{ title:"Author 20XX · Functional Alteration", cite:"Author 20XX · PMID XXXXXXXX",
  etype:"Functional Alteration", subtype:"Patient cells", system:"Human patient cells",
  cat:"Functional Alteration (max 2)", pts:2.0, fig:"Figs 3–5",
  findings:["System: what cells/model and how altered.",
            "Assay 1: method -> result (with the actual readout).",
            "Assay 2: method -> result."],
  note:"one-line scoring rationale" /* , supports:true  // for models counted within a capped category */ }];
// =======================================================================

function header(s,eyebrow,title){
  s.background={color:"FFFFFF"};
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:MX,y:0.6,w:0.30,h:0.30,rectRadius:0.06,fill:{color:TEAL}});
  s.addText(eyebrow.toUpperCase(),{x:1.12,y:0.42,w:7.5,h:0.3,fontFace:F,fontSize:12,bold:true,color:TEAL,charSpacing:2,valign:"middle",margin:0});
  s.addText(title,{x:1.10,y:0.70,w:7.6,h:0.7,fontFace:F,fontSize:26,bold:true,color:INK,valign:"middle",margin:0});
}
function card(s,x,y,w,h,accent){
  s.addShape(p.shapes.RECTANGLE,{x,y,w,h,fill:{color:"FFFFFF"},line:{color:LINE,width:1},shadow:shadow()});
  if(accent) s.addShape(p.shapes.RECTANGLE,{x,y,w:0.09,h,fill:{color:accent}});
}
function footer(s,n){ s.addText(String(n),{x:W-1.2,y:7.05,w:0.5,h:0.3,fontFace:F,fontSize:9,color:MUTE,align:"right"}); }

// ---- title ----
let s=p.addSlide(); s.background={color:"FFFFFF"};
s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:0.28,h:H,fill:{color:TEAL}});
s.addText("CLINGEN GENE–DISEASE VALIDITY · CASE-LEVEL SCORING",{x:0.9,y:1.5,w:11,h:0.4,fontFace:F,fontSize:14,bold:true,color:TEAL,charSpacing:3});
s.addText(META.gene,{x:0.85,y:1.95,w:11,h:1.1,fontFace:F,fontSize:60,bold:true,color:TEAL});
s.addText(META.disease,{x:0.9,y:3.1,w:11.5,h:0.55,fontFace:F,fontSize:22,color:INK});
s.addText([{text:META.moi,options:{bold:true,color:TEAL}},{text:`   ·   ${META.omim}   ·   ${PROBANDS.length} scored probands`,options:{color:MUTE}}],{x:0.9,y:3.7,w:11.5,h:0.45,fontFace:F,fontSize:15});
s.addText([{text:META.presenter,options:{bold:true,color:INK}},{text:`   |   ${META.gcep}   |   ${META.date}   |   ${META.sop}`,options:{color:MUTE}}],{x:0.9,y:4.85,w:11.5,h:0.4,fontFace:F,fontSize:14});

// ---- framework ----
s=p.addSlide(); header(s,"How scoring works","Case-level scoring (AR example)");
s.addText([{text:"Score EACH variant then SUM; homozygous ×2; per-proband cap 3.",options:{bullet:true,breakLine:true,bold:true}},
 {text:"Null (nonsense/frameshift/canonical ±1,2 splice): default 1.5.",options:{bullet:true,breakLine:true}},
 {text:"Other (missense / non-canonical splice): default 0.1; +functional ≈0.5.",options:{bullet:true,breakLine:true}},
 {text:"Genetic caps at 12; experimental at 6.",options:{bullet:true}}],
 {x:MX,y:1.9,w:8,h:3,fontFace:F,fontSize:15,color:INK,valign:"top",paraSpaceAfter:12});
card(s,9.0,1.85,3.6,3.6,GREEN);
s.addText("12",{x:9.0,y:2.15,w:3.6,h:1.5,fontFace:F,fontSize:70,bold:true,color:GREEN,align:"center"});
s.addText("MAX GENETIC\nEVIDENCE",{x:9.0,y:3.6,w:3.6,h:0.8,fontFace:F,fontSize:15,bold:true,color:INK,align:"center"});
footer(s,2);

// ---- proband slides ----
function proband(o,idx){
  const s=p.addSlide(); header(s,`Case-level evidence · proband ${idx+1} / ${PROBANDS.length}`,o.label);
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:8.9,y:0.6,w:3.7,h:0.5,rectRadius:0.06,fill:{color:o.flag==="nopmid"?CORAL:TEAL}});
  s.addText(o.cite,{x:8.95,y:0.6,w:3.6,h:0.5,fontFace:F,fontSize:11,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
  card(s,MX,1.6,7.3,4.5,TEAL);
  s.addText("CLINICAL DESCRIPTION",{x:MX+0.32,y:1.78,w:6.8,h:0.3,fontFace:F,fontSize:12,bold:true,color:TEALDK,charSpacing:1});
  s.addText(o.who,{x:MX+0.32,y:2.1,w:6.85,h:0.35,fontFace:F,fontSize:13,bold:true,italic:true,color:INK,margin:0});
  s.addText(o.clinical.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<o.clinical.length-1}})),
    {x:MX+0.32,y:2.5,w:6.8,h:3.45,fontFace:F,fontSize:13,color:INK,valign:"top",paraSpaceAfter:7,margin:0});
  card(s,8.2,1.6,4.4,4.5,AMBER);
  s.addText("VARIANTS & SCORING",{x:8.5,y:1.78,w:4.0,h:0.3,fontFace:F,fontSize:12,bold:true,color:TEALDK,charSpacing:1});
  const L=[]; o.variants.forEach((v,i)=>{L.push({text:`Variant ${i+1}  —  ${v.pts} pt`,options:{bold:true,color:TEALDK,fontSize:13,breakLine:true}});
    L.push({text:v.hgvs,options:{fontSize:12.5,color:INK,breakLine:true}});
    L.push({text:v.type,options:{italic:true,fontSize:11.5,color:MUTE,breakLine:true,paraSpaceAfter:8}});});
  L.push({text:`Zygosity:  ${o.zyg}`,options:{fontSize:12.5,color:INK,bold:true}});
  s.addText(L,{x:8.5,y:2.15,w:4.0,h:3.85,fontFace:F,valign:"top",margin:0});
  const a=o.score>=2?GREEN:(o.score===0?MUTE:TEAL);
  s.addShape(p.shapes.RECTANGLE,{x:MX,y:6.25,w:11.9,h:0.92,fill:{color:BAND},line:{color:LINE,width:1}});
  s.addShape(p.shapes.RECTANGLE,{x:MX,y:6.25,w:0.12,h:0.92,fill:{color:a}});
  s.addText("PROBAND SCORE",{x:MX+0.4,y:6.33,w:3,h:0.26,fontFace:F,fontSize:11,bold:true,color:MUTE,charSpacing:2,margin:0});
  s.addText(o.rationale,{x:MX+0.4,y:6.6,w:8.5,h:0.5,fontFace:F,fontSize:11.5,color:INK,valign:"top",margin:0});
  s.addText(`${fmt(o.score)} pts`,{x:9.55,y:6.25,w:3.0,h:0.92,fontFace:F,fontSize:34,bold:true,color:a,align:"right",valign:"middle",margin:0});
  footer(s,idx+3);
}
PROBANDS.forEach(proband);

// ---- genetic total ----
s=p.addSlide(); header(s,"Genetic evidence","Case-level total");
card(s,9.0,1.85,3.6,3.6,GREEN);
s.addText(`${META.genetic} / 12`,{x:9.0,y:2.25,w:3.6,h:1.3,fontFace:F,fontSize:52,bold:true,color:GREEN,align:"center"});
s.addText("GENETIC EVIDENCE",{x:9.0,y:3.55,w:3.6,h:0.6,fontFace:F,fontSize:15,bold:true,color:INK,align:"center"});
footer(s,PROBANDS.length+3);

// ---- experimental detail slides ----
function expDetail(o,idx){
  const s=p.addSlide(); header(s,`Experimental evidence · ${idx+1} / ${EXPERIMENTS.length}`,o.title);
  s.addShape(p.shapes.ROUNDED_RECTANGLE,{x:8.9,y:0.6,w:3.7,h:0.5,rectRadius:0.06,fill:{color:TEAL}});
  s.addText(o.cite,{x:8.95,y:0.6,w:3.6,h:0.5,fontFace:F,fontSize:11,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
  card(s,MX,1.55,6.35,4.6,TEAL);
  s.addText("EXPERIMENT & FINDINGS",{x:MX+0.3,y:1.72,w:5.9,h:0.3,fontFace:F,fontSize:12,bold:true,color:TEALDK,charSpacing:1});
  s.addText(o.findings.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<o.findings.length-1}})),
    {x:MX+0.3,y:2.12,w:5.85,h:3.9,fontFace:F,fontSize:10.5,color:INK,valign:"top",paraSpaceAfter:5,margin:0});
  card(s,7.25,1.55,5.35,1.75,AMBER);
  s.addText("SCORING",{x:7.5,y:1.7,w:4.9,h:0.28,fontFace:F,fontSize:11,bold:true,color:TEALDK,charSpacing:1});
  s.addText([{text:"Evidence: ",options:{bold:true}},{text:`${o.etype}`,options:{breakLine:true}},
    {text:"Sub-type: ",options:{bold:true}},{text:`${o.subtype}`,options:{breakLine:true}},
    {text:"System: ",options:{bold:true}},{text:`${o.system}`,options:{breakLine:true}},
    {text:"Category: ",options:{bold:true}},{text:`${o.cat}  ·  `,options:{}},
    {text:o.supports?"supports (within cap)":`${fmt(o.pts)} pt`,options:{bold:true,color:TEALDK}}],
    {x:7.5,y:1.98,w:4.9,h:1.25,fontFace:F,fontSize:10.5,color:INK,valign:"top",margin:0});
  s.addShape(p.shapes.RECTANGLE,{x:7.25,y:3.45,w:5.35,h:2.7,fill:{color:"FBFCFD"},line:{color:"9AA7B4",width:1,dashType:"dash"}});
  s.addText([{text:"FIGURE / SCREENSHOT\n",options:{bold:true,color:MUTE}},{text:o.fig||"paste from paper here",options:{color:MUTE,italic:true}}],
    {x:7.35,y:3.45,w:5.15,h:2.7,fontFace:F,fontSize:12,align:"center",valign:"middle"});
  const a=o.supports?MUTE:(o.pts>=2?GREEN:TEAL);
  s.addShape(p.shapes.RECTANGLE,{x:MX,y:6.25,w:11.9,h:0.92,fill:{color:BAND},line:{color:LINE,width:1}});
  s.addShape(p.shapes.RECTANGLE,{x:MX,y:6.25,w:0.12,h:0.92,fill:{color:a}});
  s.addText("POINTS SCORED",{x:MX+0.4,y:6.33,w:3,h:0.26,fontFace:F,fontSize:11,bold:true,color:MUTE,charSpacing:2,margin:0});
  s.addText(o.note||"",{x:MX+0.4,y:6.6,w:8.4,h:0.5,fontFace:F,fontSize:11.5,color:INK,valign:"top",margin:0});
  s.addText(o.supports?"supports":`${fmt(o.pts)} pts`,{x:9.35,y:6.25,w:3.2,h:0.92,fontFace:F,fontSize:o.supports?24:34,bold:true,color:a,align:"right",valign:"middle",margin:0});
  footer(s,PROBANDS.length+4+idx);
}
EXPERIMENTS.forEach(expDetail);

// ---- experimental total + classification ----
s=p.addSlide(); header(s,"Experimental evidence","Total");
card(s,9.0,1.85,3.6,3.6,GREEN);
s.addText(`${META.experimental} / 6`,{x:9.0,y:2.25,w:3.6,h:1.3,fontFace:F,fontSize:52,bold:true,color:GREEN,align:"center"});
s.addText("EXPERIMENTAL",{x:9.0,y:3.55,w:3.6,h:0.6,fontFace:F,fontSize:15,bold:true,color:INK,align:"center"});
footer(s,PROBANDS.length+4+EXPERIMENTS.length);

s=p.addSlide(); s.background={color:"FFFFFF"};
s.addShape(p.shapes.RECTANGLE,{x:0,y:0,w:0.28,h:H,fill:{color:TEAL}});
s.addText("TOTAL SCORE & CLASSIFICATION",{x:0.9,y:1.0,w:11,h:0.4,fontFace:F,fontSize:15,bold:true,color:TEAL,charSpacing:3});
s.addShape(p.shapes.RECTANGLE,{x:0.9,y:1.7,w:5.6,h:4.3,fill:{color:BAND},line:{color:LINE,width:1}});
s.addText(`${META.total} / 18`,{x:0.9,y:2.1,w:5.6,h:1.7,fontFace:F,fontSize:78,bold:true,color:TEAL,align:"center"});
s.addText([{text:`Genetic evidence    ${META.genetic} / 12`,options:{breakLine:true,color:INK}},{text:`Experimental        ${META.experimental} / 6`,options:{color:INK}}],{x:1.4,y:4.25,w:4.7,h:1.4,fontFace:F,fontSize:16,valign:"top",paraSpaceAfter:10});
s.addShape(p.shapes.RECTANGLE,{x:6.9,y:1.7,w:5.5,h:4.3,fill:{color:"EAF3EC"},line:{color:GREEN,width:1.5}});
s.addText("CLASSIFICATION",{x:6.9,y:2.15,w:5.5,h:0.4,fontFace:F,fontSize:14,bold:true,color:MUTE,charSpacing:2,align:"center"});
s.addText(META.classification,{x:6.9,y:2.75,w:5.5,h:1.1,fontFace:F,fontSize:44,bold:true,color:GREEN,align:"center"});

p.writeFile({fileName:"Curation_Deck.pptx"}).then(f=>console.log("saved:",f,"| slides:",PROBANDS.length+EXPERIMENTS.length+5));
