let enabled=true;try{enabled=localStorage.getItem('upper-primary-music')!=='off';}catch{}
let player=null,ducked=false,gameActive=false;
function volume(){if(player)player.volume=enabled?(ducked?.02:.12):0;}
export function startMusic(){if(!enabled||gameActive||document.hidden)return;if(!player){player=new Audio(new URL('assets/music/garden-playlist-5.mp3',import.meta.url));player.loop=true;player.preload='auto';player.setAttribute('playsinline','');}volume();if(player.paused)player.play().catch(()=>{});}
export function duckMusic(value){ducked=value;volume();}
export function musicEnabled(){return enabled;}
export function toggleMusic(){enabled=!enabled;try{localStorage.setItem('upper-primary-music',enabled?'on':'off');}catch{}if(enabled)startMusic();else player?.pause();volume();return enabled;}
document.addEventListener('pointerdown',startMusic,{passive:true});
document.addEventListener('keydown',startMusic);
document.addEventListener('visibilitychange',()=>{if(document.hidden)player?.pause();else startMusic();});

export function setGameMusicActive(value){gameActive=!!value;if(gameActive)player?.pause();else startMusic();}
