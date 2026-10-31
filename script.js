'use strict';
const companyLogos = {'Dayforce':'dayforce.png','Ericsson':'ericsson.png','Cineplex':'cineplex.png','The Globe and Mail':'globe.png','SickKids Hospital':'sickkids.jpg'};
const experiences = [
 ['D','Dayforce','AI team','Currently working on the AI team.','Current'],
 ['E','Ericsson','Software Engineer · AI/ML','Agentic workflows, telemetry pipelines, and a retrieval-grounded LLM assistant.','May–Aug 2026'],
 ['C','Cineplex','ML Engineer','Forecasting and scheduling optimization for 170+ theatres.','Jan–Apr 2026'],
 ['G','The Globe and Mail','ML Engineer','LLM-powered recommendations, data pipelines, and AI tools for journalists.','May–Aug 2025'],
 ['S','SickKids Hospital','AI/ML Engineer','Deep learning and Bayesian neural networks for spine surgery planning.','Sep–Dec 2024'],
];
document.querySelector('#experience-list').innerHTML = experiences.map(([mark,company,role,description,date]) => `<article id="experience-${company === 'The Globe and Mail' ? 'globe' : company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" class="experience-row"><span class="company-mark" aria-hidden="true"><img src="assets/${companyLogos[company]}" alt="" width="35" height="35" loading="lazy"></span><div><h3>${company}</h3><span class="experience-role">${role}</span></div><p>${description}</p><span class="experience-date">${date}</span></article>`).join('');
document.querySelector('#year').textContent = new Date().getFullYear();
// Keep the original typed-name idea, with a readable fallback and reduced-motion support.
const nameNode = document.querySelector('.name');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 let letter = 0;
 const text = document.createTextNode('');
 nameNode.firstChild.replaceWith(text);
 const timer = setInterval(() => { text.textContent = 'Sarah Khan.'.slice(0, ++letter); if (letter >= 11) clearInterval(timer); }, 170);
}
const answers = [
 {word:'ORBIT',theme:'SPACE',hint:'A path around something bigger.'},
 {word:'TRACK',theme:'FORMULA 1',hint:'Where the weekend unfolds.'},
 {word:'SOLAR',theme:'SPACE',hint:'Our nearest star has a whole system.'},
 {word:'SPEED',theme:'FORMULA 1',hint:'The name of the game on race day.'},
 {word:'COMET',theme:'SPACE',hint:'A traveler with a luminous tail.'},
 {word:'DRIVE',theme:'FORMULA 1',hint:'What the person in the cockpit does.'},
 {word:'LUNAR',theme:'SPACE',hint:'Think of our nighttime neighbor.'},
 {word:'POLES',theme:'FORMULA 1',hint:'The best starting positions, plural.'},
 {word:'SPACE',theme:'SPACE',hint:'The final frontier.'},
 {word:'TYRES',theme:'FORMULA 1',hint:'Soft, medium, or hard? British spelling.'},
 {word:'STARS',theme:'SPACE',hint:'Little lights in a very big sky.'},
 {word:'BRAKE',theme:'FORMULA 1',hint:'Sometimes you slow down to go faster.'}
];
let answerIndex = Math.floor(Math.random()*answers.length);
let answer, guesses, current, finished, keyboardState;
const board = document.querySelector('#word-grid');
const message = document.querySelector('#game-message');
const keyboard = document.querySelector('#keyboard');
const rank = {absent:1,present:2,correct:3};
function scoreGuess(guess,solution) {
 const result=Array(5).fill('absent'); const remaining=solution.split('');
 for(let i=0;i<5;i++) if(guess[i]===solution[i]){result[i]='correct';remaining[i]=null;}
 for(let i=0;i<5;i++) if(result[i]!=='correct'){const index=remaining.indexOf(guess[i]);if(index!==-1){result[i]='present';remaining[index]=null;}}
 return result;
}
function render() {
 board.replaceChildren();
 for(let row=0;row<6;row++){
  const guess=guesses[row];const letters=guess ? guess.word : row===guesses.length ? current : '';
  for(let col=0;col<5;col++){
   const cell=document.createElement('span');cell.className='letter-cell';cell.textContent=letters[col]||'';
   if(guess){cell.classList.add(guess.score[col]);cell.setAttribute('aria-label',`${letters[col]}: ${guess.score[col]==='correct'?'right spot':guess.score[col]==='present'?'wrong spot':'not in word'}`);}
   else if(letters[col]) cell.classList.add('filled');
   board.append(cell);
  }
 }
 keyboard.querySelectorAll('button').forEach(button=>{button.className='key'+(button.dataset.key.length>1?' wide':'');if(keyboardState[button.dataset.key])button.classList.add(keyboardState[button.dataset.key]);});
}
function input(key){
 if(finished) return;
 if(key==='BACKSPACE'){current=current.slice(0,-1);render();return;}
 if(key==='ENTER'){
  if(current.length!==5){message.textContent='Five letters, then hit enter.';return;}
  if(!window.ORBIT_WORDS.has(current.toLowerCase())){message.textContent='That word isn’t in my dictionary. Try another!';return;}
  if(guesses.some(g=>g.word===current)){message.textContent='You’ve tried that one. Try a new word!';return;}
  const score=scoreGuess(current,answer.word);
  guesses.push({word:current,score});
  score.forEach((state,i)=>{if((rank[state]||0)>(rank[keyboardState[current[i]]]||0))keyboardState[current[i]]=state;});
  if(current===answer.word){finished=true;message.textContent=`You got ${answer.word} in ${guesses.length}! Play again?`;}
  else if(guesses.length===6){finished=true;message.textContent=`The word was ${answer.word}. Try a new word?`;}
  else {message.textContent=guesses.length>=3 ? `Hint: ${answer.hint}` : `${6-guesses.length} guesses left.`;}
  current='';render();return;
 }
 if(/^[A-Z]$/.test(key)&&current.length<5){current+=key;render();}
}
for(const row of ['QWERTYUIOP','ASDFGHJKL','ENTER ZXCVBNM BACKSPACE']){
 const container=document.createElement('div');container.className='keyboard-row';
 const keys=row.includes(' ')?['ENTER',...'ZXCVBNM','BACKSPACE']:row.split('');
 for(const key of keys){const button=document.createElement('button');button.type='button';button.dataset.key=key;button.textContent=key==='BACKSPACE'?'⌫':key;button.setAttribute('aria-label',key==='BACKSPACE'?'Delete letter':key==='ENTER'?'Submit guess':key);button.addEventListener('click',()=>input(key));container.append(button);}
 keyboard.append(container);
}
function reset(){answer=answers[answerIndex];guesses=[];current='';finished=false;keyboardState={};document.querySelector('#game-theme').textContent=answer.theme;message.textContent='Enter a five-letter word to start.';render();}
document.querySelector('#reset-game').addEventListener('click',()=>{answerIndex=(answerIndex+1)%answers.length;reset();});
document.addEventListener('keydown',event=>{
 if(event.ctrlKey||event.metaKey||event.altKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.target.isContentEditable)return;
 const rect=document.querySelector('.game-panel').getBoundingClientRect();
 if(rect.bottom<0||rect.top>window.innerHeight)return;
 const key=event.key.toUpperCase();
 if(key==='ENTER'&&event.target.closest('button,a'))return;
 if(/^[A-Z]$/.test(key)||key==='ENTER'||key==='BACKSPACE'){event.preventDefault();input(key);}
});
reset();

// Native horizontal scrolling supports touch swipes, trackpads, and keyboard focus.
const glimpseTrack = document.querySelector('#glimpse-track');
const glimpseSlides = [...glimpseTrack.querySelectorAll('.glimpse-slide')];
const glimpsePrev = document.querySelector('#glimpse-prev');
const glimpseNext = document.querySelector('#glimpse-next');
function glimpseIndex() {
 return glimpseSlides.reduce((nearest, slide, i) =>
  Math.abs(slide.offsetLeft - glimpseSlides[0].offsetLeft - glimpseTrack.scrollLeft) <
  Math.abs(glimpseSlides[nearest].offsetLeft - glimpseSlides[0].offsetLeft - glimpseTrack.scrollLeft) ? i : nearest, 0);
}
function updateGlimpse() {
 const i = glimpseIndex();
 document.querySelector('#glimpse-position').textContent = `${i + 1} / ${glimpseSlides.length}`;
 glimpsePrev.disabled = i === 0;
 glimpseNext.disabled = i === glimpseSlides.length - 1;
}
function moveGlimpse(delta) {
 const i = Math.max(0, Math.min(glimpseSlides.length - 1, glimpseIndex() + delta));
 glimpseTrack.scrollTo({left: glimpseSlides[i].offsetLeft - glimpseSlides[0].offsetLeft,
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}
glimpsePrev.addEventListener('click', () => moveGlimpse(-1));
glimpseNext.addEventListener('click', () => moveGlimpse(1));
glimpseTrack.addEventListener('scroll', updateGlimpse, {passive:true});
window.addEventListener('resize', updateGlimpse);
updateGlimpse();
