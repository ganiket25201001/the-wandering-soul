import React,{useEffect,useRef} from 'react';

const scenes=['mumbai-evening','mumbai','mumbai-chai','jaisalmer','jaisalmer-dunes','jaisalmer-lake','kedarnath-valley','kedarnath','kedarnath-bells','karakoram-dream','mountains','karakoram-stars'];
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const t=clamp(n);return t*t*(3-2*t)};

// Local photographs form a layered scenic sequence; this is not generated video.
export default function PhotoWorld({progress,paused}){
 const canvas=useRef(null),target=useRef(progress),freeze=useRef(paused);
 useEffect(()=>{target.current=progress;freeze.current=paused},[progress,paused]);
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');if(!ctx)return;
  let width=0,height=0,current=target.current,raf=0,inView=false,lastPaint=-1,dirty=true;
  const compact=matchMedia('(max-width:760px)').matches;
  const images=scenes.map((name)=>{const image=new Image();image.onload=()=>{dirty=true};image.onerror=()=>{const fallback='/images/'+name+'.png';if(!image.src.endsWith(fallback))image.src=fallback};return image});
  const loadNearby=index=>{for(let n=Math.max(0,index-1);n<=Math.min(scenes.length-1,index+2);n++)if(!images[n].src)images[n].src='/images/'+scenes[n]+(compact?'.mobile.webp':'.webp')};
  loadNearby(Math.min(scenes.length-1,Math.floor(target.current*scenes.length)));
  const resize=()=>{const r=el.getBoundingClientRect();width=r.width;height=r.height;const ratio=Math.min(devicePixelRatio||1,2);el.width=Math.round(width*ratio);el.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);dirty=true};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const visibility=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;dirty=true});visibility.observe(el);
  const drawImage=(image,phase,alpha)=>{
   if(!image.complete||!image.naturalWidth||!width||!height)return false;
   const zoom=1.04+phase*.18,scale=Math.max(width/image.naturalWidth,height/image.naturalHeight)*zoom;
   const dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
   const x=(width-dw)*(.52+phase*.09),y=(height-dh)*(.5-phase*.12);
   ctx.globalAlpha=alpha;ctx.drawImage(image,x,y,dw,dh);return true;
  };
  const paint=()=>{
   raf=requestAnimationFrame(paint);if(!inView||document.hidden)return;
   if(!freeze.current)current+=(target.current-current)*.075;
   if(!dirty&&Math.abs(current-lastPaint)<.00003)return;lastPaint=current;dirty=false;
   const p=clamp(current)*scenes.length,i=Math.min(scenes.length-1,Math.floor(p)),phase=Math.min(1,p-i),blend=i<scenes.length-1?smooth((phase-.72)/.28):0;
   loadNearby(i);
   ctx.globalAlpha=1;ctx.fillStyle='#d9dfd0';ctx.fillRect(0,0,width,height);
   drawImage(images[i],phase,1);if(blend>0)drawImage(images[i+1],0,blend);
   ctx.globalAlpha=1;
   const atmosphere=ctx.createLinearGradient(0,0,0,height);atmosphere.addColorStop(0,'#f9efd61a');atmosphere.addColorStop(.5,'#f9efd600');atmosphere.addColorStop(1,'#15271f5c');ctx.fillStyle=atmosphere;ctx.fillRect(0,0,width,height);
   const glow=ctx.createRadialGradient(width*.8,height*.2,0,width*.8,height*.2,width*.5);glow.addColorStop(0,'#ffeec52b');glow.addColorStop(1,'#ffeec500');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   // Subtle foreground motes move only with scroll, preserving the pause state.
   for(let n=0;n<20;n++){const x=((n*137.3+current*190)%1000)/1000*width,y=((n*79.7-current*85+1000)%1000)/1000*height;ctx.fillStyle=n%3?'#fff8dd30':'#fff8dd55';ctx.beginPath();ctx.arc(x,y,1+(n%3)*.65,0,Math.PI*2);ctx.fill()}
  };
  paint();return()=>{cancelAnimationFrame(raf);observer.disconnect();visibility.disconnect();images.forEach(i=>{i.onload=null;i.onerror=null})};
 },[]);
 return <canvas ref={canvas} className="world-canvas photographic-world" role="img" aria-label="Detailed scenic views of Mumbai, the Thar desert, a Himalayan valley, and an imagined Karakoram landscape, animated as you scroll"/>;
}
