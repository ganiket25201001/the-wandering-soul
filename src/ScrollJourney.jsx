import React, {useEffect, useRef, useState} from 'react';
import {ArrowDown, ArrowUpRight, MapPin, Pause, Play} from 'lucide-react';
import './journey.css';

const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const mix=(a,b,t)=>a+(b-a)*t;
const palettes=[[222,231,225],[243,218,168],[213,229,217],[216,228,237]];
const descriptions=[
 ['The city behind me.','The world ahead.','Mumbai hums around me. A sea breeze, one last chai, and the quiet courage to leave. Every big story begins with one small yes.'],
 ['A golden detour.','A slower kind of life.','The city gives way to sandstone lanes and an endless desert. I stop chasing the clock and start following the light.'],
 ['Into the mountains.','A little closer to myself.','The air grows cooler. The trail grows quieter. On the path toward Kedarnath, the smallest moments start to feel like the whole point.'],
 ['Beyond the familiar.','Into the dream.','The Karakoram lives on my unwritten pages. K2 is a dream on the horizon — a reminder that there is always more to wonder about.']
];

// A small perspective renderer: every landmark lives in one continuous 3D space.
// Scrolling changes the camera position, rather than playing timed animations.
function WorldCanvas({progress,paused}){
 const canvas=useRef(null),target=useRef(0),stop=useRef(false);
 useEffect(()=>{target.current=progress;stop.current=paused},[progress,paused]);
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,frame=0,current=target.current;
  const resize=()=>{const box=el.getBoundingClientRect();w=box.width;h=box.height;const dpr=Math.min(devicePixelRatio||1,2);el.width=w*dpr;el.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const draw=()=>{
   frame=requestAnimationFrame(draw);if(document.hidden)return;
   if(!stop.current)current=reduced.matches?target.current:mix(current,target.current,.09);
   const section=clamp(current*3,0,3),index=Math.min(2,Math.floor(section)),blend=section-index;
   const rgb=palettes[index].map((v,i)=>Math.round(mix(v,palettes[index+1][i],blend)));
   const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,`rgb(${rgb})`);sky.addColorStop(.7,'#f5efdf');sky.addColorStop(1,'#d8cbaa');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
   const sunx=w*.76,suny=h*.22;const glow=ctx.createRadialGradient(sunx,suny,5,sunx,suny,w*.3);glow.addColorStop(0,'#fff7daaa');glow.addColorStop(1,'#fff7da00');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);ctx.fillStyle='#fff7de';ctx.beginPath();ctx.arc(sunx,suny,Math.min(w,h)*.045,0,Math.PI*2);ctx.fill();
   const cameraZ=60+current*2820,cameraX=Math.sin(cameraZ*.0018)*15,focal=Math.min(w*.88,900),horizon=h*.42,cameraY=15;
   const project=([x,y,z])=>{const depth=z-cameraZ;if(depth<4)return null;return [w*.56+(x-cameraX)*focal/depth,horizon+(cameraY-y)*focal/depth,depth]};
   let faces=[];
   const polygon=(points,color)=>{const p=points.map(project);if(p.some(v=>!v))return;faces.push({p,color,depth:p.reduce((s,v)=>s+v[2],0)/p.length})};
   const box=(x,z,sx,sy,sz,color,top='#e9d7b1',side='#a99373',y=0)=>{
    polygon([[x,y,z],[x+sx,y,z],[x+sx,y+sy,z],[x,y+sy,z]],color);
    polygon([[x,y+sy,z],[x+sx,y+sy,z],[x+sx,y+sy,z+sz],[x,y+sy,z+sz]],top);
    polygon([[x+sx,y,z],[x+sx,y,z+sz],[x+sx,y+sy,z+sz],[x+sx,y+sy,z]],side);
    polygon([[x,y,z],[x,y,z+sz],[x,y+sy,z+sz],[x,y+sy,z]],side);
   };
   const peak=(x,z,width,height,color,snow=false)=>{
    polygon([[x-width/2,0,z],[x+width/2,0,z],[x,height,z+width*.22]],color);
    polygon([[x,0,z-width*.2],[x+width/2,0,z],[x,height,z+width*.22]],snow?'#a4b9be':'#c9a775');
    if(snow){polygon([[x-width*.14,height*.72,z+width*.16],[x+width*.14,height*.72,z+width*.16],[x,height,z+width*.22]],'#f7faf1')}
   };
   // Far silhouettes keep the destination on the horizon as the camera advances.
   for(let i=0;i<10;i++){const z=3100+i*85;peak(-550+i*130,z,230,120+(i%4)*40,'#b0c1bf',true)}
   // The ribbon of road remains connected from the city to the final mountain pass.
   for(let z=20;z<3700;z+=35){const center=Math.sin(z*.0018)*15,next=Math.sin((z+35)*.0018)*15;
    polygon([[center-17,0,z],[center+17,0,z],[next+17,0,z+35],[next-17,0,z+35]],z<750?'#aebbb0':z<1500?'#d8b77f':z<2250?'#b9c4ac':'#c3ced0');
    polygon([[center-.3,.08,z],[center+.3,.08,z],[next+.3,.08,z+17],[next-.3,.08,z+17]],'#f7efdb');
   }
   // Mumbai: small buildings, palms, and an architectural gateway.
   for(let z=160;z<850;z+=85){for(const side of [-1,1]){const x=side*(38+(z%3)*8);box(x,z,24,24+(z%7)*5,26,z%2?'#b7c5b8':'#d7cbb2','#eee5cb','#8faaa2');for(let row=0;row<3;row++)for(let col=0;col<3;col++)polygon([[x+4+col*6,5+row*7,z-.1],[x+7+col*6,5+row*7,z-.1],[x+7+col*6,8+row*7,z-.1],[x+4+col*6,8+row*7,z-.1]],'#738d83')}}
   box(-31,610,15,61,12,'#c9b58c');box(17,610,15,61,12,'#c9b58c');box(-31,610,63,15,12,'#d7c49c','#e9dbb8','#a68f68',48);box(-35,610,71,4,14,'#e7d6ad','#f4e7c7','#b6a27c',63);
   // Jaisalmer: sand dunes, a fortified lane, and terracotta parapets.
   for(let i=0;i<15;i++){const z=900+i*42;peak((i%2?1:-1)*(70+(i%4)*30),z,160,20+(i%5)*8,'#e5c087')}
   for(let z=1020;z<1580;z+=100){for(const s of [-1,1]){const x=s===-1?-65:35;box(x,z,30,36,38,'#cea565','#e8c58a','#af854e');for(let k=0;k<4;k++)box(x+k*8,z,4,6,5,'#d9b67a','#edd09b','#a8804d',36);for(let k=0;k<3;k++)box(x+5+k*8,z-.2,3,8,1,'#8f6e42','#8f6e42','#8f6e42',16)}}
   // Kedarnath: foothills, conifers, and an interpretive stone temple.
   for(let i=0;i<18;i++){const z=1650+i*40;const x=(i%2?1:-1)*(48+(i%4)*22);box(x,z,2,10,2,'#817f62');peak(x,z,14,29,'#829d7b');peak(x,z+1,10,37,'#789376')}
   for(let i=0;i<6;i++)peak((i%2?1:-1)*(130+i*35),1900+i*75,160,100+i*12,'#9baa98',true);
   box(-22,2150,45,32,38,'#aab3ab','#d2d3be','#788f86');peak(0,2150,57,53,'#839b96');box(-5,2149,10,17,1,'#657d78','#657d78','#657d78');box(-7,2170,14,59,14,'#c3c6ad','#e0dac0','#9da48e');peak(0,2170,20,76,'#a7b8ab');box(-26,2140,53,2,15,'#d4d4bd');
   // The K2 dream: a passage through a snowy, imagined Karakoram landscape.
   for(let i=0;i<14;i++){const z=2350+i*60,x=(i%2?1:-1)*(90+(i%5)*32);peak(x,z,150,85+(i%4)*35,'#b1c2c4',true)}
   peak(0,3380,310,270,'#a0b6bd',true);
   faces.sort((a,b)=>b.depth-a.depth);for(const face of faces){ctx.globalAlpha=clamp(1-face.depth/5500,.15,1);ctx.fillStyle=face.color;ctx.beginPath();face.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill()}ctx.globalAlpha=1;
   // Tiny foreground flecks enhance depth without running independent motion.
   for(let i=0;i<35;i++){const z=80+i*100,x=(i%2?1:-1)*(24+(i*17)%90),p=project([x,.2,z]);if(p&&p[2]<1000){ctx.fillStyle='#8b987450';ctx.fillRect(p[0],p[1],Math.max(1,180/p[2]),Math.max(1,70/p[2]))}}
  };
  draw();return()=>{cancelAnimationFrame(frame);observer.disconnect()};
 },[]);
 return <canvas ref={canvas} className="world-canvas" aria-label="An illustrated 3D road from Mumbai through Jaisalmer and Kedarnath toward a mountain dream" role="img"/>;
}

export default function ScrollJourney({chapters,onEntry}){
 const container=useRef(null);const [progress,setProgress]=useState(0),[paused,setPaused]=useState(false);
 useEffect(()=>{let scheduled=0;const update=()=>{scheduled=0;const r=container.current.getBoundingClientRect();setProgress(clamp(-r.top/(r.height-innerHeight)))};const onScroll=()=>{if(!scheduled)scheduled=requestAnimationFrame(update)};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);update();return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(scheduled)}},[]);
 const index=Math.min(3,Math.floor(progress*4)),chapter=chapters[index];
 return <section className="scroll-world" ref={container} aria-label="The continuous travel walkthrough">
  {chapters.map((c,i)=><div key={c.id} id={c.id} className="world-anchor" style={{top:`${i*25}%`}}/>)}
  <div className="world-stage"><WorldCanvas progress={progress} paused={paused}/><div className="world-scrim"/>
   <div className="world-topline"><span><span className="status-dot"/> ANIKET’S LITTLE WORLD</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>} {paused?'Resume motion':'Pause motion'}</button></div>
   <div className="world-copy" key={chapter.id}><span className="eyebrow">{chapter.no} / 04 <span className="dash"/> {chapter.name.toUpperCase()}</span><h2>{descriptions[index][0]}<br/><em>{descriptions[index][1]}</em></h2><p>{descriptions[index][2]}</p><button className="text-button" onClick={()=>onEntry(chapter)}>Read this page <ArrowUpRight size={16}/></button><span className="world-chapter-note scribble">{chapter.note}</span></div>
   <div className="world-postcard"><span className="world-postcard-tape"/><img src={chapter.image} alt={chapter.alt}/><span className="scribble">{chapter.name} ♡</span></div>
   <div className="world-bottom"><span className="world-scroll-hint"><ArrowDown size={15}/> SCROLL TO KEEP TRAVELLING</span><div className="world-route" aria-label="Walkthrough destinations">{chapters.map((c,i)=><a key={c.id} href={'#'+c.id} className={i===index?'current':''} aria-current={i===index?'step':undefined}><span>{c.no}</span>{c.name}</a>)}</div><span className="world-distance">{Math.round(progress*100)}% <span>OF THIS STORY</span></span></div>
  </div>
 </section>
}
