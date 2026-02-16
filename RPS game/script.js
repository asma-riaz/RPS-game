
let userScore=0,botScore=0;
let history=[];

// DOM refs
const userScoreEl=document.getElementById('userScore');
const botScoreEl=document.getElementById('botScore');
const rockCount=document.getElementById('rockCount');
const paperCount=document.getElementById('paperCount');
const scissorsCount=document.getElementById('scissorsCount');
const historyEl=document.getElementById('history');
const result=document.getElementById('result');
const lifeWins=document.getElementById('lifeWins');
const lifeLosses=document.getElementById('lifeLosses');
const lifeDraws=document.getElementById('lifeDraws');

let analytics={rock:0,paper:0,scissors:0};

let lifeStats=JSON.parse(localStorage.getItem('rpsStats'))||{
  wins:0,losses:0,draws:0
};

updateLifeUI();

function randomChoice(){
  return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
}

function patternChoice(){
  if(history.length<2) return randomChoice();
  let last=history[history.length-1].user;
  if(last==='rock') return 'paper';
  if(last==='paper') return 'scissors';
  return 'rock';
}

function adaptiveChoice(){
  if(history.length<3) return randomChoice();
  let most=Object.keys(analytics).reduce((a,b)=>analytics[a]>analytics[b]?a:b);
  if(most==='rock') return 'paper';
  if(most==='paper') return 'scissors';
  return 'rock';
}

function botMove(){

  if(history.length < 2){
    return randomChoice();
  }

  if(history.length < 5){
    return patternChoice();
  }

  return adaptiveChoice();
}

function decide(u,b){
  if(u===b) return 'draw';
  if(
    (u==='rock'&&b==='scissors')||
    (u==='paper'&&b==='rock')||
    (u==='scissors'&&b==='paper')
  ) return 'user';
  return 'bot';
}

function play(user){
  let bot=botMove();

  history.push({user,bot});
  analytics[user]++;

  let res=decide(user,bot);

  if(res==='user'){userScore++;lifeStats.wins++;}
  if(res==='bot'){botScore++;lifeStats.losses++;}
  if(res==='draw'){lifeStats.draws++;}

  updateUI(user,bot,res);
  updateAnalytics();
  addHistory(user,bot,res);
  saveLifeStats();
}

function updateUI(u,b,r){
  let text=`You: ${u} | Bot: ${b}<br>`;
  if(r==='user') text+=`<span class='win'>You Win 🎉</span>`;
  if(r==='bot') text+=`<span class='lose'>Bot Wins 🤖</span>`;
  if(r==='draw') text+=`<span class='draw'>Draw 🤝</span>`;

  result.innerHTML=text;
  userScoreEl.textContent=userScore;
  botScoreEl.textContent=botScore;
}

function updateAnalytics(){
  rockCount.textContent=analytics.rock;
  paperCount.textContent=analytics.paper;
  scissorsCount.textContent=analytics.scissors;
}

function addHistory(u,b,r){
  let div=document.createElement('div');
  div.textContent=`${u} vs ${b} → ${r}`;
  historyEl.appendChild(div);
}

function saveLifeStats(){
  localStorage.setItem('rpsStats',JSON.stringify(lifeStats));
  updateLifeUI();
}

function updateLifeUI(){
  lifeWins.textContent=lifeStats.wins;
  lifeLosses.textContent=lifeStats.losses;
  lifeDraws.textContent=lifeStats.draws;
}

function resetGame(){
  userScore=0;botScore=0;history=[];
  analytics={rock:0,paper:0,scissors:0};
  historyEl.innerHTML='<h3>🕘 Match History</h3>';
  updateAnalytics();
  userScoreEl.textContent=0;
  botScoreEl.textContent=0;
  result.textContent='Make your move!';
}

result.innerHTML = `
  You: <img src="images/${u}.png" width="40">
  Bot: <img src="images/${b}.png" width="40">
`;
