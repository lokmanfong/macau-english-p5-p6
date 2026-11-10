import assert from 'node:assert/strict';
import {units} from './content.mjs';
import {gapPlan} from './study-tools.mjs';
assert.equal(units.length,24);
assert.equal(new Set(units.map(u=>u.id)).size,24);
for(const book of ['5A','5B','6A','6B'])assert.deepEqual(units.filter(u=>u.book===book).map(u=>u.chapter),[1,2,3,4,5,6]);
for(const u of units){assert(u.words.length>=10,u.id);assert.equal(u.questions.length,15);assert.equal(new Set(u.words.map(w=>w.en)).size,u.words.length,u.id);for(const q of u.questions){assert(q.options.includes(q.answer));assert.equal(new Set(q.options).size,3);assert(q.explanation.length>0);assert(!q.prompt.includes('{n}'));}for(const w of u.words){const gaps=gapPlan(w.en);assert(gaps.length>0);assert(gaps.every(i=>/[a-z]/i.test(w.en[i])));for(const m of w.en.matchAll(/\S+/g)){const letters=[...m[0]].filter(c=>/[a-z]/i.test(c)).length;assert.equal(gaps.filter(i=>i>=m.index&&i<m.index+m[0].length).length,Math.min(letters,letters>7?3:2));}const next=gapPlan(w.en,gaps);if(w.en.match(/[a-z]/gi).length>gaps.length)assert.notDeepEqual(next,gaps);}}
console.log('PASS: 24 units, book order, vocabulary, 360 grammar variants, answer uniqueness, gap lengths and retry gaps.');
