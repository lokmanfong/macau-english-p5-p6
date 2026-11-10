import assert from 'node:assert/strict';
import {createRun,step,move,jump,isGap,safeLane,wrap} from './engine.mjs';
assert.equal(wrap(-1),7);assert.equal(wrap(8),0);
for(let row=0;row<1500;row++){assert.equal(isGap(row,safeLane(row)),false);assert.equal(isGap(row,0),isGap(row,0));}
let r=createRun();step(r,1);assert.equal(r.distance,0);r.status='running';move(r,-1);assert.equal(r.lane,7);move(r,1);assert.equal(r.lane,0);assert(jump(r));assert(!jump(r));for(let i=0;i<70;i++)step(r,.016,true);assert.equal(r.height,0);
r=createRun();r.status='running';for(let i=0;i<120;i++)step(r,.016);assert.equal(r.status,'running');assert(r.distance<30);
let hole;for(let row=10;row<100;row++)for(let lane=0;lane<8;lane++)if(isGap(row,lane))hole={row,lane};
r=createRun();r.status='running';r.distance=hole.row*3+.1;r.lane=hole.lane;step(r,.01);assert.equal(r.status,'running');for(let i=0;i<17;i++)step(r,.01);assert.equal(r.status,'over');
r=createRun();r.status='running';r.distance=hole.row*3+.1;r.lane=hole.lane;r.height=1;step(r,.01);assert.equal(r.status,'running');r.status='paused';const distance=r.distance;step(r,.02);assert.equal(r.distance,distance);
console.log('PASS: deterministic safe path, wraparound, jump/landing, tutorial runway, falling, airborne gaps and pause.');

// Moving from a safe surface provides 320 ms to correct an early turn.
r=createRun();r.status='running';r.distance=hole.row*3+.1;r.lane=safeLane(hole.row);move(r,hole.lane-r.lane);assert.equal(r.edgeGrace,.32);step(r,.04);assert.equal(r.status,'running');assert(jump(r));step(r,.04,true);assert.equal(r.status,'running');
// Switching again while unsupported does not refresh the grace timer.
r=createRun();r.status='running';r.distance=hole.row*3+.1;r.lane=hole.lane;r.edgeGrace=.1;move(r,0);assert.equal(r.edgeGrace,.1);
console.log('PASS: early-turn grace, corrective jump and no mid-gap grace refresh.');
