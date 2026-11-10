export const SIDES=8, TILE=3;
export const wrap=n=>((n%SIDES)+SIDES)%SIDES;
function hash(a,b){let x=Math.imul(a+1,374761393)^Math.imul(b+7,668265263);x=Math.imul(x^(x>>>13),1274126177);return (x^(x>>>16))>>>0;}
// A continuous clear route always exists. The early runway teaches the controls.
export function safeLane(row){return wrap(Math.floor(row/5));}
export function isGap(row,lane){if(row<10||lane===safeLane(row))return false;return hash(row,lane)%100<Math.min(42,25+Math.floor(row/25)*2);}
export function hasStar(row,lane){return row>3&&!isGap(row,lane)&&hash(row+97,lane)%9===0;}
export function createRun(){return {distance:0,lane:0,height:0,velocity:0,stars:0,level:1,status:'ready',collected:new Set(),time:0,edgeGrace:0,unsupportedFor:0};}
export function move(run,dir){if(run.status!=='running')return;const row=Math.floor(run.distance/TILE);if(run.height===0&&!isGap(row,run.lane))run.edgeGrace=.32;run.lane=wrap(run.lane+dir);}
export function jump(run){if(run.status==='running'&&run.height===0&&run.velocity===0){run.velocity=7.7;return true;}return false;}
export function step(run,dt,held=false){if(run.status!=='running')return;dt=Math.min(.04,Math.max(0,dt));run.time+=dt;run.edgeGrace=Math.max(0,run.edgeGrace-dt);run.level=1+Math.floor(run.distance/130);run.distance+=dt*Math.min(19,11+run.level*.8);if(run.height>0||run.velocity>0){run.velocity-=dt*(held&&run.velocity>0?13:19);run.height+=run.velocity*dt;if(run.height<0){run.height=0;run.velocity=0;}}
 const row=Math.floor(run.distance/TILE);
 if(run.height<.16&&isGap(row,run.lane)){run.unsupportedFor+=dt;if(run.edgeGrace<=0&&run.unsupportedFor>.16){run.status='over';return;}}else run.unsupportedFor=0;
 const key=row+':'+run.lane;
 if(hasStar(row,run.lane)&&!run.collected.has(key)){run.collected.add(key);run.stars++;}
}
