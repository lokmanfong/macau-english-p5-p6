// Same short sine-pop envelope as the P3–P4 app; independent of background music.
let context=null,enabled=true;try{enabled=localStorage.getItem('upper-primary-effects')!=='off';}catch{}
function pop(){const o=context.createOscillator(),g=context.createGain(),t=context.currentTime;o.type='sine';o.frequency.setValueAtTime(780,t);o.frequency.exponentialRampToValueAtTime(300,t+.075);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.075,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+.105);o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+.12);o.onended=()=>{o.disconnect();g.disconnect();};}
export function tap(){if(!enabled)return;const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;try{context||=new AudioContext();if(context.state!=='running')context.resume().then(()=>{if(enabled)pop();}).catch(()=>{});else pop();}catch{}}
export function effectsEnabled(){return enabled;}
export function toggleEffects(){enabled=!enabled;try{localStorage.setItem('upper-primary-effects',enabled?'on':'off');}catch{}if(enabled)tap();return enabled;}
document.addEventListener('click',event=>{const el=event.target.closest?.('button,input[type="checkbox"],.gap');if(el&&!el.disabled&&el.id!=='toggle-effects')tap();},{capture:true});
