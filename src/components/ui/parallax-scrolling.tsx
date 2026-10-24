import React,{useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {ArrowDown,ArrowUpRight,Compass,MapPin} from 'lucide-react';
import 'lenis/dist/lenis.css';
import './parallax-scrolling.css';

export function ParallaxComponent(){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add({reduced:'(prefers-reduced-motion: reduce)',fine:'(pointer: fine)',mobile:'(max-width: 760px)'},context=>{
   if(context.conditions?.reduced)return;
   const element=root.current;if(!element)return;
   const motion=gsap.context(()=>{
    const timeline=gsap.timeline({scrollTrigger:{trigger:element,start:'top top',end:'bottom top',scrub:true,invalidateOnRefresh:true}});
    [{layer:1,y:45},{layer:2,y:28},{layer:3,y:16},{layer:4,y:7}].forEach(({layer,y})=>{
     timeline.to(element.querySelectorAll(`[data-parallax-layer="${layer}"]`),{yPercent:y,ease:'none'},0);
    });
   },element);
   // Native touch scrolling stays intact; smooth wheel scrolling is desktop-only.
   let lenis:Lenis|undefined;
   const tick=(seconds:number)=>lenis?.raf(seconds*1000);
   let overflowObserver:MutationObserver|undefined;
   if(context.conditions?.fine&&!context.conditions?.mobile){
    lenis=new Lenis({smoothWheel:true,autoRaf:false,anchors:true,allowNestedScroll:true,prevent:node=>Boolean(node.closest('dialog'))});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(tick);
    const syncModal=()=>{if(document.body.style.overflow==='hidden')lenis?.stop();else lenis?.start()};
    overflowObserver=new MutationObserver(syncModal);
    overflowObserver.observe(document.body,{attributes:true,attributeFilter:['style']});
    syncModal();
   }
   return()=>{overflowObserver?.disconnect();gsap.ticker.remove(tick);lenis?.destroy();motion.revert()};
  },root);
  return()=>media.revert();
 },[]);
 return <section id="home" className="travel-parallax" ref={root} aria-label="Aniket’s solo travel story">
  <div className="parallax-stage" data-parallax-layers>
   <img className="parallax-landscape" src="/images/hero-parallax.webp" alt="An imagined Himalayan valley at dawn, with a golden trail leading toward the mountains" fetchPriority="high" width={1600} height={1000} data-parallax-layer="1"/>
   <div className="parallax-atmosphere" data-parallax-layer="2" aria-hidden="true"/>
   <div className="parallax-headline" data-parallax-layer="3"><span className="parallax-eyebrow"><Compass size={13}/> THE WANDERING SOUL · FROM MUMBAI, WITH CURIOSITY</span><span className="parallax-handwritten">a little lost. a lot alive.</span><h1>ANIKET<span className="parallax-heading-arrow"><ArrowUpRight aria-hidden="true"/></span></h1><p>One backpack. A world of stories.<br/>And a little courage to take the long way home.</p><a href="#journey" className="parallax-start">Step into my story <ArrowUpRight size={17}/></a></div>
   <img className="parallax-foreground" src="/images/hero-foreground.webp" alt="" aria-hidden="true" width={1600} height={1000} data-parallax-layer="4"/>
   <div className="parallax-ground-fade" aria-hidden="true"/>
   <div className="parallax-caption"><span><MapPin size={13}/> MUMBAI IS HOME.<br/><small>THE REST IS A BEAUTIFUL DETOUR.</small></span><a href="#journey" aria-label="Scroll to the journey"><span>LET THE STORY UNFOLD</span><ArrowDown size={16}/></a><span className="parallax-caption-right">SOLO TRAVEL JOURNAL<br/><small>01 / THE FIRST PAGE</small></span></div>
  </div>
 </section>
}
