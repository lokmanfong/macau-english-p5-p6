import '../../button-sound.mjs';
import {createRun,move,jump,step,isGap,hasStar,SIDES,TILE} from './engine.mjs?v=grace3';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
let run=createRun(),viewAngle=0,last=performance.now(),held=false,holding=0,nextMove=0,best=0,noticeUntil=0;
try{best=Number(localStorage.getItem('starlight-best'))||0;}catch{}$('best').textContent=best;

const runnerArt=new Image();runnerArt.src=new URL('../../assets/runner-rear-v4.png',import.meta.url);
const colors=['#8a9fd0','#a5c6db','#9cd4cc','#a5d1b8','#d3c795','#d2b6cd','#b3a2d5','#8dacc6'];
const stars=Array.from({length:85},(_,i)=>({x:((i*73)%991)/991,y:((i*193)%997)/997,r:1+i%3*.4}));
let musicOn=true;try{musicOn=localStorage.getItem('starlight-music')!=='off';}catch{}
const sprint=new Audio(new URL('../../assets/music/starlight-sprint.wav',import.meta.url));sprint.loop=true;sprint.volume=.24;sprint.preload='auto';
function syncMusic(){if(musicOn&&run.status==='running'&&!document.hidden)sprint.play().catch(()=>{});else sprint.pause();$('music').textContent=musicOn?'♫ 音樂':'♫ 靜音';$('music').setAttribute('aria-pressed',String(musicOn));}
$('music').onclick=()=>{musicOn=!musicOn;try{localStorage.setItem('starlight-music',musicOn?'on':'off');}catch{}syncMusic();};syncMusic();
window.addEventListener('pagehide',()=>sprint.pause());
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);}new ResizeObserver(resize).observe(canvas);
function start(){run=createRun();run.status='running';viewAngle=0;held=false;holding=0;last=performance.now();$('overlay').hidden=true;$('pause').disabled=false;$('pause').textContent='暫停';$('milestone').textContent='';canvas.focus();syncMusic();}
function finish(){syncMusic();held=false;holding=0;const score=Math.floor(run.distance);best=Math.max(best,score);try{localStorage.setItem('starlight-best',best);}catch{}$('best').textContent=best;$('message').textContent=`跑咗 ${score} 米，收集 ${run.stars} 粒星星！提早轉換表面或跳躍，再試一次。`;$('overlay').querySelector('h1').innerHTML='好勇敢，<br>再向前跑一次！';$('start').textContent='再玩一局 →';$('overlay').hidden=false;$('pause').disabled=true;$('milestone').textContent='';}
function pause(){held=false;holding=0;if(run.status==='running'){run.status='paused';$('pause').textContent='繼續';$('milestone').textContent='已暫停 · 撳「繼續」再出發';}else if(run.status==='paused'){run.status='running';last=performance.now();$('pause').textContent='暫停';$('milestone').textContent='';}syncMusic();}
$('start').onclick=start;$('pause').onclick=pause;$('leave').onclick=()=>parent.postMessage({type:'starlight-close'},location.origin);
function bindHold(id,dir){$(id).onpointerdown=e=>{e.preventDefault();$(id).setPointerCapture(e.pointerId);move(run,dir);holding=dir;nextMove=run.time+.19;};$(id).onpointerup=$(id).onpointercancel=()=>holding=0;}
bindHold('left',-1);bindHold('right',1);$('jump').onpointerdown=e=>{e.preventDefault();$('jump').setPointerCapture(e.pointerId);held=true;jump(run);};$('jump').onpointerup=$('jump').onpointercancel=()=>held=false;
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','a','d','w','p','Escape'].includes(e.key)){e.preventDefault();if(e.key==='p'||e.key==='Escape'){if(!e.repeat)pause();return;}if(['ArrowLeft','a','ArrowRight','d'].includes(e.key)&&!e.repeat){holding=['ArrowLeft','a'].includes(e.key)?-1:1;move(run,holding);nextMove=run.time+.19;}if(['ArrowUp',' ','w'].includes(e.key)){held=true;if(!e.repeat)jump(run);}}});window.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','a','d'].includes(e.key))holding=0;if(['ArrowUp',' ','w'].includes(e.key))held=false;});window.addEventListener('blur',()=>{if(run.status==='running')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&run.status==='running')pause();});
// Original transparent three-pose rear-view character sheet.
function drawBackBoy(c,x,y,size,time,airborne){if(!runnerArt.complete||!runnerArt.naturalWidth)return;const cellW=runnerArt.naturalWidth/3,cellH=runnerArt.naturalHeight,frame=airborne?1:[0,1,2,1][Math.floor(time*10)%4],h=size*1.5,w=h*cellW/cellH;c.save();c.translate(x,y+2);c.rotate(airborne?-.035:Math.sin(time*15)*.018);c.drawImage(runnerArt,frame*cellW,0,cellW,cellH,-w/2,-h,w,h);c.restore();}
function draw(t){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const cx=w/2,cy=h*.38,R=Math.max(w*.65,h*.59),f=2.35;
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#10182f');bg.addColorStop(1,'#282645');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(const s of stars){ctx.globalAlpha=.35+.3*Math.sin(t*.7+s.x*20);ctx.fillStyle='#fff0cd';ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 let target=run.lane;while(target-viewAngle>4)target-=8;while(target-viewAngle< -4)target+=8;viewAngle+=(target-viewAngle)*.15;
 const point=(edge,z)=>{const a=Math.PI/2-(edge-.5-viewAngle)*Math.PI/4,scale=f/(z+f);return [cx+Math.cos(a)*R*scale,cy+Math.sin(a)*R*scale];};
 const poly=pts=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();};
 const row=Math.floor(run.distance/TILE),frac=run.distance%TILE;
 for(let n=26;n>=0;n--){const z=n*TILE-frac+.65;if(z+TILE<.1)continue;const z0=Math.max(.1,z),z1=z+TILE;
  for(let lane=0;lane<SIDES;lane++){const pts=[point(lane,z0),point(lane+1,z0),point(lane+1,z1),point(lane,z1)],gap=isGap(row+n,lane);poly(pts);if(gap){ctx.fillStyle='#0b1028';ctx.fill();ctx.strokeStyle='#cf8ca85c';}else{ctx.fillStyle=colors[lane];ctx.globalAlpha=.3+.6/(1+z0*.08);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='#e3ebff30';}ctx.lineWidth=1;ctx.stroke();
   if(hasStar(row+n,lane)&&!run.collected.has((row+n)+':'+lane)){const p=point(lane+.5,z0+TILE*.5),size=Math.max(2,15*f/(z0+TILE*.5+f));ctx.fillStyle='#ffe19a';ctx.save();ctx.translate(...p);ctx.rotate(t*.7);ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?size*.45:size;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.restore();}
  }
 }
 ctx.globalAlpha=1;const px=cx,ground=Math.min(h*.87,cy+R*.66),size=Math.min(110,w*.25,h*.23),y=ground-run.height*Math.min(38,h*.07);ctx.fillStyle='#13183088';ctx.beginPath();ctx.ellipse(px,ground+1,size*.28,size*.07,0,0,Math.PI*2);ctx.fill();
 drawBackBoy(ctx,px,y,size,run.status==='running'?run.time:0,run.height>0);
 ctx.fillStyle='#eaf3ff88';ctx.font='11px Round';ctx.textAlign='center';if(run.status==='running'&&run.distance<50)ctx.fillText('← 左右轉換表面 · 起跳避開深色缺口 →',cx,h-18);
}
function frame(now){const dt=(now-last)/1000;last=now;const was=run.status,level=run.level;if(holding&&run.time>=nextMove){move(run,holding);nextMove=run.time+.19;}step(run,dt,held);if(was==='running'&&run.status==='over')finish();if(run.level>level){$('milestone').textContent=`✦ 第 ${run.level} 關 · 繼續加油！`;noticeUntil=now+2000;}if(run.status==='running'&&noticeUntil&&now>noticeUntil){$('milestone').textContent='';noticeUntil=0;}$('distance').textContent=Math.floor(run.distance);$('stars').textContent=run.stars;$('level').textContent=run.level;draw(now/1000);requestAnimationFrame(frame);}requestAnimationFrame(frame);
