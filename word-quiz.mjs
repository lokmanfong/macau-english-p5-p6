function mix(items,random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createWordRound(word,pool,random=Math.random){
 const others=mix(pool.filter(w=>w.en!==word.en),random);
 const english=[word.en,...others.slice(0,2).map(w=>w.en)];
 const chinese=[word.zh,...[...new Set(others.map(w=>w.zh).filter(zh=>zh!==word.zh))].slice(0,2)];
 return [
  {prompt:'聽一聽，選出英文',choices:english,correct:word.en,audio:word.en},
  {prompt:`「${word.zh}」英文是？`,choices:english,correct:word.en},
  {prompt:`${word.en} 的中文是？`,choices:chinese,correct:word.zh},
 ].map(q=>({...q,options:mix(q.choices,random),explanation:`${word.en} = ${word.zh}`,word:word.en}));
}
export const encouragement={positive:['Well done! You did it!','Great job! Keep it up!','Fantastic! You got it right!','Wonderful! You are learning so much!','Nice work! Let’s keep going!'],retry:['Good try! Let’s learn it together.','Keep going! You can try again.','You are learning! Take your time.','Nice effort! Let’s practise together.']};
let positive=0,retry=0;
export function nextEncouragement(right){return right?encouragement.positive[positive++%encouragement.positive.length]:encouragement.retry[retry++%encouragement.retry.length];}
