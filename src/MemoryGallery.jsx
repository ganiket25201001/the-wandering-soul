import React,{useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Camera,Heart,MapPin,X} from 'lucide-react';
import {memories} from './memories';
import './gallery.css';

export default function MemoryGallery({chapter,onClose}){
 const dialog=useRef(null),[index,setIndex]=useState(0);const moments=memories[chapter.id],moment=moments[index];
 const move=direction=>setIndex(i=>(i+direction+moments.length)%moments.length);
 useEffect(()=>{const previous=document.activeElement;dialog.current.showModal();return()=>{previous?.focus?.({preventScroll:true})}},[]);
 return <dialog ref={dialog} className="memory-dialog" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}}} aria-labelledby="gallery-title">
  <div className="gallery-header"><div><span className="eyebrow">A FEW MOMENTS FROM THE JOURNEY</span><h2 id="gallery-title">{chapter.name}<span className="scribble">through my eyes.</span></h2></div><button autoFocus onClick={onClose} className="gallery-close" aria-label="Close photo story"><X size={20}/></button></div>
  <div className="gallery-layout"><div className="gallery-visual"><div className="gallery-photo"><img src={moment.image} alt={moment.alt}/><div className="gallery-photo-bar"><span><Camera size={14}/> {String(index+1).padStart(2,'0')} / {String(moments.length).padStart(2,'0')}</span><div><button aria-label="Previous photo" onClick={()=>move(-1)}><ArrowLeft size={17}/></button><button aria-label="Next photo" onClick={()=>move(1)}><ArrowRight size={17}/></button></div></div></div><div className="gallery-thumbnails" aria-label="Choose a photo">{moments.map((m,i)=><button key={m.image} onClick={()=>setIndex(i)} aria-pressed={i===index} aria-label={`View photo ${i+1}: ${m.title}`}><img src={m.image} alt=""/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div><p className="gallery-footnote">{chapter.id==='k2'?'An unwritten dream · AI-created landscapes':'Creative travel journal · real places and imagined moments'}</p></div>
  <article className="gallery-story" key={moment.image} aria-live="polite"><span className="gallery-location"><MapPin size={12}/>{chapter.meta}</span><h3>{moment.title}</h3><div className="story-label"><Camera size={14}/> WHAT I SAW</div><p>{moment.saw}</p><div className="story-label felt"><Heart size={14}/> HOW IT FELT</div><p>{moment.felt}</p><div className="scribble gallery-signature">A little moment, kept forever.<br/>— Aniket</div></article></div>
 </dialog>
}
