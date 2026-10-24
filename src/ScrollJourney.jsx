import React, {useEffect, useRef, useState} from 'react';
import {ArrowDown, ArrowUpRight, Pause, Play, Camera} from 'lucide-react';
import './journey.css';
import PhotoWorld from './PhotoWorld';

const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const descriptions=[
 ['The city behind me.','The world ahead.','Mumbai hums around me. A sea breeze, one last chai, and the quiet courage to leave. Every big story begins with one small yes.'],
 ['A golden detour.','A slower kind of life.','The city gives way to sandstone lanes and an endless desert. I stop chasing the clock and start following the light.'],
 ['Into the mountains.','A little closer to myself.','The air grows cooler. The trail grows quieter. On the path toward Kedarnath, the smallest moments start to feel like the whole point.'],
 ['Beyond the familiar.','Into the dream.','The Karakoram lives on my unwritten pages. K2 is a dream on the horizon — a reminder that there is always more to wonder about.']
];

export default function ScrollJourney({chapters,onEntry}){
 const container=useRef(null),stage=useRef(null);const [progress,setProgress]=useState(0),[paused,setPaused]=useState(false);
 useEffect(()=>{let scheduled=0;const update=()=>{scheduled=0;const r=container.current.getBoundingClientRect(),frame=stage.current;const stickyTop=parseFloat(getComputedStyle(frame).top)||0;setProgress(clamp((stickyTop-r.top)/(r.height-frame.offsetHeight)))};const onScroll=()=>{if(!scheduled)scheduled=requestAnimationFrame(update)};window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);update();return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(scheduled)}},[]);
 const index=Math.min(3,Math.floor(progress*4)),chapter=chapters[index];
 return <section className="scroll-world" ref={container} aria-label="The continuous travel walkthrough">
  {chapters.map((c,i)=><div key={c.id} id={c.id} className="world-anchor" style={{top:`calc(${i*25}% - ${i/4} * var(--world-frame-height, 100svh))`}}/>)}
  <div className="world-stage" ref={stage}><PhotoWorld progress={progress} paused={paused}/><div className="world-scrim"/>
   <div className="world-topline"><span><span className="status-dot"/> ANIKET’S LITTLE WORLD</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>} {paused?'Resume motion':'Pause motion'}</button></div>
   <div className="world-copy" key={chapter.id}><span className="eyebrow">{chapter.no} / 04 <span className="dash"/> {chapter.name.toUpperCase()}</span><h2>{descriptions[index][0]}<br/><em>{descriptions[index][1]}</em></h2><p>{descriptions[index][2]}</p><button className="text-button" onClick={()=>onEntry(chapter)}>Read this page <ArrowUpRight size={16}/></button><span className="world-chapter-note scribble">{chapter.note}</span></div>
   <div className="world-view-counter"><Camera size={13}/><span>VIEW {Math.min(2,Math.floor((progress*4-index)*3))+1} OF 3</span><span className="world-view-dots">{[0,1,2].map(i=><span key={i} className={i===Math.min(2,Math.floor((progress*4-index)*3))?'current':''}/>)}</span></div>
   <div className="world-bottom"><span className="world-scroll-hint"><ArrowDown size={15}/> SCROLL TO KEEP TRAVELLING</span><div className="world-route" aria-label="Walkthrough destinations">{chapters.map((c,i)=><a key={c.id} href={'#'+c.id} className={i===index?'current':''} aria-current={i===index?'step':undefined}><span>{c.no}</span>{c.name}</a>)}</div><span className="world-distance">{Math.round(progress*100)}% <span>OF THIS STORY</span></span></div>
  </div>
 </section>
}
