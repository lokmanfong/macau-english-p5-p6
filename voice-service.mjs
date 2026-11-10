import {duckMusic} from './music.mjs?v=game4';
import {englishAudio} from './english-audio.mjs?v=recorded1';
let current=null,serial=0,settle=null;
export function stopEnglish(){serial++;if(current){current.pause();current=null;}settle?.(false);settle=null;duckMusic(false);}
export async function readEnglish(text,{slow=false,status=()=>{}}={}){
 stopEnglish();const token=serial;
 const clip=englishAudio[String(text).trim().toLowerCase()];
 if(!clip){status('呢段文字暫時未有內置音檔。');return false;}
 duckMusic(true);const player=new Audio(new URL('assets/english/'+clip,import.meta.url));current=player;
 player.playbackRate=slow?.8:1;player.preservesPitch=true;
 status('🔊 內置美式英文音檔 · 與三四年級相同聲線');
 return new Promise(resolve=>{let finished=false;const finish=(ok,message)=>{if(finished)return;finished=true;if(token===serial){current=null;settle=null;duckMusic(false);if(message)status(message);}resolve(ok);};settle=ok=>finish(ok);
 player.onended=()=>finish(true,'✓ 發音播放完成 · 內置美式英文');
 player.onerror=()=>finish(false,'音檔未能載入，請再按發音重試。');
 player.play().catch(()=>finish(false,'請再撳一次發音，允許瀏覽器播放音檔。'));
 });
}
