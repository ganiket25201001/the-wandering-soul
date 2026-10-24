import React,{useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,Compass,Mail,MailOpen,Mountain,TreePalm,Trees} from 'lucide-react';
import './mystery.css';

const paths=[
 {name:'Spiti Valley',clue:'Where the roads climb above the clouds.',detail:'Cold mountain air. Winding roads. A quieter corner of the Himalayas.',icon:Mountain,stamp:'THE HIGH ROAD'},
 {name:'Kerala',clue:'Where the water teaches you to slow down.',detail:'Palm-lined waterways, slow mornings, and a little room to breathe.',icon:TreePalm,stamp:'THE SLOW ESCAPE'},
 {name:'Meghalaya',clue:'Where the rain has a story of its own.',detail:'Misty hills, living green, and a journey that follows the rain.',icon:Trees,stamp:'THE HIDDEN GREEN'}
];
export default function MysteryEnding(){
 const [revealed,setRevealed]=useState(null),[choice,setChoice]=useState(()=>{try{return localStorage.getItem('aniket-next')||''}catch{return ''}}),[confirmed,setConfirmed]=useState(false);
 const choose=name=>{setChoice(name);setConfirmed(true);try{localStorage.setItem('aniket-next',name)}catch{}};
 return <section id="next" className="next mystery-ending reveal"><span className="eyebrow"><Compass size={13}/> THREE CLUES. ONE UNWRITTEN CHAPTER.</span><h2>Where should the<br/>story go <em>next?</em></h2><p>The ticket isn’t booked. The next page is still sealed.<br/>Follow a feeling. Open a clue. See where it takes us.</p>
  <div className="mystery-cards">{paths.map((path,i)=>{const open=revealed===i;return <div key={path.name} className={'mystery-card'+(open?' is-open':'')}>
   <button className="mystery-reveal" onClick={()=>{setRevealed(open?null:i);setConfirmed(false)}} aria-expanded={open} aria-controls={'mystery-path-'+i} aria-label={open?'Close the '+path.name+' clue':'Reveal destination '+(i+1)}><span className="mystery-number">UNWRITTEN / 0{i+1}</span><span className="envelope-icon">{open?<MailOpen size={32}/>:<Mail size={32}/>}</span><span className="mystery-clue">{path.clue}</span><span className="mystery-prompt">{open?'Fold this page away':'Break the seal'} <ArrowUpRight size={14}/></span></button>
   <div className="mystery-answer" id={'mystery-path-'+i} hidden={!open}><div className="mystery-place"><path.icon size={25}/><span><small>{path.stamp}</small><strong>{path.name}</strong></span></div><p>{path.detail}</p><button className="mystery-pick" onClick={()=>choose(path.name)}>{confirmed&&choice===path.name?<><Check size={15}/> Chapter bookmarked</>:<>Make this the next chapter <ArrowRight size={15}/></>}</button></div>
  </div>})}</div>
  <p className="mystery-status" role="status">{confirmed?`The next page is marked: ${choice}. The adventure is still waiting to be written.`:revealed!==null?'A place revealed. A possibility opened. Is this the next chapter?':'Some stories are better when you don’t know what comes next.'}</p><small className="local-note">Your next-chapter choice stays on this device.</small><span className="scribble mystery-signoff">To be continued…<br/>maybe with your detour.</span>
 </section>
}
