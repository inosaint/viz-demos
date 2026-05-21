import * as THREE from 'three';

function tex(fn, res = 512) {
  const c = document.createElement('canvas'); c.width = c.height = res;
  fn(c.getContext('2d'), res); return new THREE.CanvasTexture(c);
}

export const T = {
  sun: tex((g, s) => {
    const r = g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    r.addColorStop(0,'#fffde8'); r.addColorStop(0.3,'#ffda00');
    r.addColorStop(0.65,'#ff7800'); r.addColorStop(1,'#c42000');
    g.fillStyle=r; g.fillRect(0,0,s,s);
    for(let i=0;i<200;i++){g.save();g.globalAlpha=Math.random()*.22+.04;g.fillStyle=`hsl(${25+~~(Math.random()*35)},90%,${48+~~(Math.random()*44)}%)`;g.beginPath();g.arc(Math.random()*s,Math.random()*s,Math.random()*s*.065+2,0,Math.PI*2);g.fill();g.restore();}
  }),
  mercury: tex((g,s)=>{g.fillStyle='#8c8c8c';g.fillRect(0,0,s,s);for(let i=0;i<600;i++){g.save();g.globalAlpha=.38;const v=~~(Math.random()*80+55);g.fillStyle=`rgb(${v},${v},${v})`;g.beginPath();g.arc(~~(Math.random()*s),~~(Math.random()*s),Math.random()*14+1,0,Math.PI*2);g.fill();g.restore();}}),
  venus: tex((g,s)=>{g.fillStyle='#c8942a';g.fillRect(0,0,s,s);for(let i=0;i<18;i++){const y=Math.random()*s;g.fillStyle=`rgba(${~~(Math.random()*60+185)},${~~(Math.random()*40+110)},35,${Math.random()*.55+.1})`;g.fillRect(0,y,s,Math.random()*s*.08+s*.025);}}),
  earth: tex((g,s)=>{
    g.fillStyle='#1466b0';g.fillRect(0,0,s,s);g.fillStyle='#248c38';
    [[.14,.32,.14,.19],[.52,.28,.19,.21],[.70,.52,.11,.15],[.27,.60,.08,.11],[.78,.36,.13,.07],[.45,.68,.06,.09]]
    .forEach(([x,y,rx,ry])=>{g.beginPath();g.ellipse(x*s,y*s,rx*s,ry*s,Math.random()*1.2,0,Math.PI*2);g.fill();});
    g.fillStyle='rgba(228,240,255,.88)';g.fillRect(0,0,s,24);g.fillRect(0,s-22,s,22);
  }),
  mars: tex((g,s)=>{g.fillStyle='#b03808';g.fillRect(0,0,s,s);for(let i=0;i<300;i++){g.save();g.globalAlpha=Math.random()*.38;g.fillStyle=`hsl(${8+~~(Math.random()*25)},${55+~~(Math.random()*30)}%,${22+~~(Math.random()*38)}%)`;g.beginPath();g.arc(~~(Math.random()*s),~~(Math.random()*s),Math.random()*26+2,0,Math.PI*2);g.fill();g.restore();}g.fillStyle='rgba(210,228,255,.62)';g.beginPath();g.ellipse(s/2,14,s*.2,12,0,0,Math.PI*2);g.fill();}),
  jupiter: tex((g,s)=>{
    ['#c8883a','#ddb060','#c47848','#e8c090','#b06828','#d4a060','#c47848','#e0b880','#b87030','#d4a060','#c8883a','#d0a050','#c47848','#e8c090','#b06828']
    .forEach((c,i,a)=>{g.fillStyle=c;g.fillRect(0,i*s/a.length,s,s/a.length+1);});
    g.save();g.globalAlpha=.82;g.fillStyle='#c82808';g.beginPath();g.ellipse(s*.58,s*.56,s*.13,s*.075,0,0,Math.PI*2);g.fill();g.restore();
  }),
  saturn: tex((g,s)=>{['#e8d480','#d4bc60','#c8a840','#e0c870','#d4b050','#e8d490','#c4a038'].forEach((c,i,a)=>{g.fillStyle=c;g.fillRect(0,i*s/a.length,s,s/a.length+1);});}),
  uranus: tex((g,s)=>{const gr=g.createLinearGradient(0,0,0,s);gr.addColorStop(0,'#a8f0f8');gr.addColorStop(.5,'#68d8e8');gr.addColorStop(1,'#48c0d0');g.fillStyle=gr;g.fillRect(0,0,s,s);}),
  neptune: tex((g,s)=>{const gr=g.createLinearGradient(0,0,0,s);gr.addColorStop(0,'#4868d8');gr.addColorStop(.5,'#2040c0');gr.addColorStop(1,'#0c1ca8');g.fillStyle=gr;g.fillRect(0,0,s,s);g.save();g.globalAlpha=.65;g.fillStyle='#0818a8';g.beginPath();g.ellipse(s*.38,s*.48,s*.09,s*.055,0,0,Math.PI*2);g.fill();g.restore();}),
  pluto: tex((g,s)=>{g.fillStyle='#a07858';g.fillRect(0,0,s,s);for(let i=0;i<180;i++){g.save();g.globalAlpha=Math.random()*.32;g.fillStyle=`hsl(${22+~~(Math.random()*28)},${22+~~(Math.random()*25)}%,${22+~~(Math.random()*42)}%)`;g.beginPath();g.arc(~~(Math.random()*s),~~(Math.random()*s),Math.random()*20+2,0,Math.PI*2);g.fill();g.restore();}g.save();g.globalAlpha=.48;g.fillStyle='#c8d8e8';g.beginPath();g.ellipse(s*.34,s*.5,s*.13,s*.1,-.3,0,Math.PI*2);g.fill();g.restore();}),
};
