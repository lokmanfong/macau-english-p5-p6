globalThis.document={hidden:false,addEventListener(){}};globalThis.localStorage={getItem(){return null},setItem(){}};
import assert from 'node:assert/strict';
import {existsSync,statSync,readFileSync} from 'node:fs';
import {units} from './content.mjs';
import {englishAudio} from './english-audio.mjs';
for(const unit of units)for(const word of unit.words){const file=englishAudio[word.en.trim().toLowerCase()];assert(file,word.en);const url=new URL('assets/english/'+file,import.meta.url);assert(existsSync(url),word.en);assert(statSync(url).size>1000,word.en);}
const original=new URL('/Users/waiwai/Documents/Codex/2026-10-10/macau-english-flutter/outputs/shared-english-audio/', 'file:');let shared=0;for(const file of Object.values(englishAudio)){const old=new URL(file,original);if(existsSync(old)){assert.deepEqual(readFileSync(new URL('assets/english/'+file,import.meta.url)),readFileSync(old));shared++;}}assert(shared>0);
const players=[];globalThis.Audio=class{constructor(url){this.url=url;players.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}};
const {readEnglish,stopEnglish}=await import('./voice-service.mjs');
let status='';const first=readEnglish('fever',{status:s=>status=s});assert(players.at(-1).url.href.endsWith(englishAudio.fever));assert.equal(players.at(-1).playbackRate,1);assert(status.includes('內置美式'));
const second=readEnglish('wait patiently',{slow:true});assert(players[0].paused);assert.equal(await first,false);assert.equal(players.at(-1).playbackRate,.8);players.at(-1).onended();assert.equal(await second,true);
const third=readEnglish('fever');stopEnglish();assert.equal(await third,false);
const failed=readEnglish('fever',{status:s=>status=s});players.at(-1).onerror();assert.equal(await failed,false);assert(status.includes('未能載入'));
console.log('PASS: complete vocabulary audio coverage, file integrity, shared clips, playback speed, cancellation and errors.');
