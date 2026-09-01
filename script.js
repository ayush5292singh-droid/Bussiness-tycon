let game={
started:false,
player:"",
company:"",
industry:"",
difficulty:"normal",

cash:10000,
value:10000,
revenue:0,
expenses:0,
profit:0,

day:1,
minute:0,

reputation:50,
demand:100,
market:100,

level:1,
xp:0,

debt:0,
loanAge:0,
loanOverdue:false,

employees:[],

upgrades:{
production:1,
marketing:1,
research:1,
hq:1
},

stocks:{
NOVA:{name:"Nova Technologies",price:120,shares:0},
APEX:{name:"Apex Motors",price:85,shares:0},
VOLT:{name:"Volt Energy",price:155,shares:0},
ORBT:{name:"Orbit Retail",price:65,shares:0},
CYBR:{name:"CyberCore",price:210,shares:0}
},

sound:true,
achievements:[],
news:"Market opening soon..."
};

const competitors=[
{
name:"NOVA INDUSTRIES",
short:"NOVA",
industry:"Technology",
value:850000,
power:72
},
{
name:"APEX CORPORATION",
short:"APEX",
industry:"Automotive",
value:620000,
power:64
},
{
name:"VOLT ENERGY",
short:"VOLT",
industry:"Energy",
value:1100000,
power:82
},
{
name:"ORBIT GROUP",
short:"ORBT",
industry:"Retail",
value:480000,
power:58
},
{
name:"CYBERCORE",
short:"CYBR",
industry:"Software",
value:930000,
power:77
}
];

const upgradeBase={
production:2000,
marketing:1500,
research:2500,
hq:3000
};

function money(n){
return "$"+Math.round(n).toLocaleString();
}

function save(){
localStorage.setItem(
"empireWarsSave",
JSON.stringify(game)
);
}

function load(){

let data=localStorage.getItem("empireWarsSave");

if(data){

game=JSON.parse(data);

document.getElementById("setup")
.classList.add("hidden");

document.getElementById("game")
.classList.remove("hidden");

update();
}
}

function startGame(){

let player=
document.getElementById("playerName")
.value.trim();

let company=
document.getElementById("companyName")
.value.trim();

if(!player||!company){

toast("Enter your name and company name.");
return;
}

game.player=player;
game.company=company;

game.industry=
document.getElementById("industry").value;

game.difficulty=
document.getElementById("difficulty").value;

if(game.difficulty==="easy")
game.cash=15000;

if(game.difficulty==="hard")
game.cash=7000;

game.started=true;

document.getElementById("setup")
.classList.add("hidden");

document.getElementById("game")
.classList.remove("hidden");

game.news=
company+
" has entered the "+game.industry+
" market.";

save();
update();

toast("Your empire begins.");
}

function update(){

document.getElementById("companyTitle")
.textContent=game.company;

document.getElementById("welcome")
.textContent=
"Welcome, "+game.player;

document.getElementById("industryText")
.textContent=
game.industry+
" division • Day "+game.day;

document.getElementById("cash")
.textContent=money(game.cash);

document.getElementById("value")
.textContent=money(game.value);

document.getElementById("reputation")
.textContent=
Math.round(game.reputation);

document.getElementById("profit")
.textContent=
money(game.profit);

document.getElementById("rev")
.textContent=
money(game.revenue);

document.getElementById("exp")
.textContent=
money(game.expenses);

document.getElementById("emp")
.textContent=
game.employees.length;

document.getElementById("debt")
.textContent=
money(game.debt);

document.getElementById("news")
.textContent=game.news;

updateLevel();
updateUpgrades();
updateLoan();
updateEmployees();
updateStocks();
updateCompetitors();
updateMarket();
updateRisk();
updateAchievements();

save();
}

function updateLevel(){

let required=
100+(game.level*75);

if(game.xp>=required){

game.xp-=required;
game.level++;

game.value+=
game.level*2000;

game.reputation+=5;

toast(
"LEVEL UP! You reached level "+
game.level
);
}

document.getElementById("level")
.textContent=game.level;

let requiredNow=
100+(game.level*75);

document.getElementById("xpBar")
.style.width=
Math.min(
100,
(game.xp/requiredNow)*100
)+"%";

document.getElementById("xpText")
.textContent=
game.xp+" / "+requiredNow+" XP";

const ranks=[
"STARTUP",
"SMALL BUSINESS",
"GROWING COMPANY",
"CORPORATION",
"INDUSTRY LEADER",
"GLOBAL EMPIRE",
"BUSINESS TITAN"
];

document.getElementById("rankName")
.textContent=
ranks[Math.min(game.level-1,ranks.length-1)];
}

function businessAction(){

if(game.loanOverdue){

toast(
"LOAN OVERDUE! Resolve your debt."
);

return;
}

let base=
600+
game.upgrades.production*220;

base+=game.employees.length*120;

base*=game.market/100;
base*=game.demand/100;
base*=game.upgrades.research*.08+0.92;

let earned=
Math.round(base*(.8+Math.random()*.4));

game.revenue+=earned;
game.cash+=earned;

game.profit=
game.revenue-game.expenses;

game.value+=
Math.round(earned*.3);

game.xp+=10;

game.reputation+=
Math.random()*2;

toast("Business generated "+money(earned));

checkAchievements();
update();
}

function restock(){

let cost=500+
game.upgrades.production*100;

if(game.cash<cost){

toast("Not enough cash.");
return;
}

game.cash-=cost;
game.expenses+=cost;

game.demand+=5;
game.xp+=5;

toast("Inventory restocked.");

update();
}

function marketing(){

let cost=750+
game.upgrades.marketing*200;

if(game.cash<cost){

toast("Not enough cash.");
return;
}

game.cash-=cost;
game.expenses+=cost;

game.reputation+=8;
game.demand+=10;

game.xp+=8;

game.news=
game.company+
" launched a major marketing campaign.";

toast("Marketing campaign launched.");

update();
}

function research(){

let cost=900+
game.upgrades.research*250;

if(game.cash<cost){

toast("Not enough cash.");
return;
}

game.cash-=cost;
game.expenses+=cost;

game.upgrades.research++;

game.xp+=12;
game.value+=1000;

game.news=
game.company+
" announced a new technology breakthrough.";

toast("Research breakthrough!");

update();
}

function upgrade(type){

let cost=
Math.round(
upgradeBase[type]*
Math.pow(
1.6,
game.upgrades[type]-1
)
);

if(game.cash<cost){

toast("Not enough cash.");
return;
}

game.cash-=cost;

game.upgrades[type]++;

game.value+=
Math.round(cost*.7);

game.xp+=20;

if(type==="marketing")
game.reputation+=5;

if(type==="production")
game.demand+=3;

toast(
type.toUpperCase()+
" upgraded."
);

update();
}

function updateUpgrades(){

for(let type in game.upgrades){

document.getElementById(
type==="hq"?"hqLvl":type+"Lvl"
).textContent=
game.upgrades[type];

let cost=
Math.round(
upgradeBase[type]*
Math.pow(
1.6,
game.upgrades[type]-1
)
);

document.getElementById(
type==="hq"?"hqCost":type+"Cost"
).textContent=
cost.toLocaleString();
}
}

function hire(type){

let price=0;
let salary=0;
let name="";

if(type==="sales"){
price=1000;
salary=300;
name="Sales Director";
}

if(type==="engineer"){
price=1200;
salary=400;
name="Engineer";
}

if(type==="executive"){
price=2000;
salary=600;
name="Executive";
}

if(game.cash<price){

toast("Not enough cash.");
return;
}

game.cash-=price;

game.employees.push({
name,
salary,
type
});

game.value+=price;
game.xp+=15;

toast(name+" hired.");

update();
}

function updateEmployees(){

let team=
document.getElementById("team");

if(!game.employees.length){

team.innerHTML=
`<p>No employees hired yet.</p>`;

return;
}

team.innerHTML=
game.employees.map((e,i)=>`

<div class="team-row">

<span>👤 ${e.name}</span>

<span>${money(e.salary)}/day</span>

<button onclick="fireEmployee(${i})">
FIRE
</button>

</div>

`).join("");
}

function fireEmployee(i){

let e=game.employees[i];

if(!confirm("Fire "+e.name+"?"))
return;

game.employees.splice(i,1);

toast(e.name+" fired.");

update();
}

function takeLoan(amount){

if(game.debt>0){

toast("You already have a loan.");
return;
}

game.cash+=amount;

game.debt=
Math.round(amount*1.08);

game.loanAge=0;
game.loanOverdue=false;

game.value+=amount*.3;

game.news=
game.company+
" secured a "+money(amount)+
" business loan.";

toast("Loan approved.");

update();
}

function repayLoan(){

if(game.debt<=0){

toast("No active loan.");
return;
}

let payment=
Math.min(5000,game.debt);

if(game.cash<payment){

toast("Not enough cash.");
return;
}

game.cash-=payment;
game.debt-=payment;

if(game.debt<=0){

game.debt=0;
game.loanAge=0;
game.loanOverdue=false;

toast("Loan completely repaid!");
}else{

toast(
"Loan payment: "+
money(payment)
);
}

update();
}

function updateLoan(){

document.getElementById("loanAmount")
.textContent=money(game.debt);

document.getElementById("loanDays")
.textContent=
game.debt>0 ?
Math.max(0,2-game.loanAge):
"--";

let status=
"No loan";

if(game.debt>0)
status=
game.loanOverdue?
"OVERDUE":
"ACTIVE";

document.getElementById("loanStatus")
.textContent=status;
}

function buyStock(){

let ticker=
document.getElementById("tickerInput")
.value.trim()
.toUpperCase();

let shares=
parseInt(
document.getElementById("sharesInput").value
);

if(!game.stocks[ticker]){

toast("Unknown ticker.");
return;
}

if(!shares||shares<1){

toast("Enter valid shares.");
return;
}

let stock=game.stocks[ticker];

let total=
Math.round(stock.price*shares);

if(game.cash<total){

toast("Not enough cash.");
return;
}

game.cash-=total;

stock.shares+=shares;

game.portfolioValue=
(game.portfolioValue||0)+total;

toast(
"Bought "+shares+
" shares of "+ticker
);

update();
}

function sellStock(){

let ticker=
document.getElementById("tickerInput")
.value.trim()
.toUpperCase();

let shares=
parseInt(
document.getElementById("sharesInput").value
);

if(!game.stocks[ticker]){

toast("Unknown ticker.");
return;
}

let stock=game.stocks[ticker];

if(stock.shares<shares){

toast("You don't own enough shares.");
return;
}

let total=
Math.round(stock.price*shares);

stock.shares-=shares;
game.cash+=total;

toast(
"Sold "+shares+
" shares of "+ticker
);

update();
}

function updateStocks(){

let ticker=
document.getElementById("ticker");

ticker.innerHTML=
Object.entries(game.stocks)
.map(([symbol,s])=>`

<div class="stock">

<small>${symbol}</small>

<b>${money(s.price)}</b>

<span class="${
s.change>=0?"green":"red"
}">
${s.change>=0?"▲":"▼"}
${Math.abs(s.change||0).toFixed(1)}%
</span>

</div>

`).join("");

let portfolio=
document.getElementById("portfolio");

let owned=
Object.entries(game.stocks)
.filter(([s,v])=>v.shares>0);

if(!owned.length){

portfolio.innerHTML=
"<p>No stocks owned.</p>";

return;
}

portfolio.innerHTML=
owned.map(([symbol,s])=>`

<div class="team-row">

<span>
${symbol} —
${s.shares} shares
</span>

<b>${money(s.price*s.shares)}</b>

</div>

`).join("");
}

function moveStocks(){

Object.entries(game.stocks)
.forEach(([symbol,s])=>{

let movement=
(Math.random()*.16)-.08;

s.price*=
1+movement;

s.price=
Math.max(
5,
Math.round(s.price*100)/100
);

s.change=
movement*100;

});

update();
}

function updateCompetitors(){

let box=
document.getElementById("competitors");

box.innerHTML=
competitors.map((c,i)=>{

let relative=
game.value>c.value?
"WINNING":
"STRONG";

return `

<div class="competitor">

<div class="competitor-logo">
${c.short}
</div>

<div>

<h3>${c.name}</h3>

<p>
${c.industry} •
Market Power ${c.power}/100
</p>

</div>

<div class="competitor-value">

<b>${money(c.value)}</b>

<span class="${
game.value>c.value?"green":"red"
}">
${relative}
</span>

</div>

</div>

`;

}).join("");

let strongest=
competitors
.sort((a,b)=>b.power-a.power)[0];

document.getElementById("competitorAlert")
.innerHTML=
`
<b>${strongest.name}</b>
<br>
<span style="color:#718b92">
Market power: ${strongest.power}/100
<br>
Your value: ${money(game.value)}
</span>
`;

}

function competitorMove(){

competitors.forEach(c=>{

let change=
Math.round(
(Math.random()*6-3)*1000
);

c.value+=change;

c.value=Math.max(
100000,
c.value
);

if(Math.random()<.15){

game.demand-=3;

game.news=
c.name+
" has launched a competitive move.";
}

});

updateCompetitors();
}

function marketMove(){

let move=
Math.floor(Math.random()*13)-6;

game.market+=move;

game.market=
Math.max(
50,
Math.min(150,game.market)
);

game.demand+=
Math.floor(Math.random()*9)-4;

game.demand=
Math.max(
50,
Math.min(150,game.demand)
);

if(game.market>120)
game.news=
"MARKET BOOM — demand is surging.";

else if(game.market<80)
game.news=
"MARKET CRASH — investors are nervous.";

update();
}

function nextGameDay(){

game.day++;

game.loanAge++;

if(game.debt>0&&game.loanAge>=2){

game.loanOverdue=true;

game.expenses+=
Math.round(game.debt*.05);

game.profit-=
Math.round(game.debt*.05);

game.news=
"⚠ LOAN OVERDUE — BANK DEMANDS PAYMENT.";

toast("LOAN OVERDUE!");
}

let salaries=0;

game.employees.forEach(e=>{
salaries+=e.salary;
});

game.expenses+=
200+
salaries;

game.profit=
game.revenue-game.expenses;

game.cash+=
game.profit;

game.value+=
Math.max(
0,
Math.round(game.profit*.2)
);

marketMove();
competitorMove();
moveStocks();

game.xp+=
Math.max(5,
Math.round(game.profit/100));

checkAchievements();
checkBankruptcy();

update();

toast("DAY "+game.day+" BEGINS");
}

function gameClock(){

game.minute++;

let totalMinutes=
game.minute;

let hour=
8+
Math.floor(totalMinutes/60);

let minute=
totalMinutes%60;

if(hour>=24){

hour=0;
}

document.getElementById("time")
.textContent=
String(hour).padStart(2,"0")+
":"+
String(minute).padStart(2,"0");

let dayMinutes=
game.minute%600;

let isDay=
dayMinutes<300;

document.getElementById("period")
.textContent=
isDay?"DAY":"NIGHT";

if(game.minute>0&&game.minute%600===0){

nextGameDay();
}
}

function updateMarket(){

document.getElementById("marketIndex")
.textContent=
Math.round(game.market);

document.getElementById("demand")
.textContent=
Math.round(game.demand)+"%";

document.getElementById("confidence")
.textContent=
Math.round(
(game.reputation+
game.demand/2)
)+"%";

let vol=
Math.abs(game.market-100);

document.getElementById("volatility")
.textContent=
vol>25?"HIGH":
vol>12?"MEDIUM":"LOW";

document.getElementById("marketState")
.textContent=
game.market>115?
"BULL MARKET":
game.market<85?
"BEAR MARKET":
"STABLE MARKET";

drawGraph();
}

function drawGraph(){

let graph=
document.getElementById("graphLine");

graph.innerHTML="";

for(let i=0;i<35;i++){

let p=
document.createElement("div");

p.className="graph-point";

p.style.left=
(i*2.8)+"%";

p.style.top=
(
50+
Math.sin(i*.7)*25+
Math.random()*15
)+"%";

graph.appendChild(p);
}
}

function updateRisk(){

let risk=0;

if(game.debt>0)
risk+=20;

if(game.loanOverdue)
risk+=35;

if(game.cash<2000)
risk+=20;

if(game.profit<0)
risk+=15;

if(game.value<0)
risk+=30;

risk=Math.min(100,risk);

document.getElementById("riskText")
.textContent=
"RISK "+risk+"%";

let bar=
document.getElementById("dangerBar");

if(risk>=70){

bar.style.color="#ff7373";

document.getElementById("dangerText")
.textContent=
"⚠ CRITICAL FINANCIAL RISK";
}
else if(risk>=40){

bar.style.color="#f0c969";

document.getElementById("dangerText")
.textContent=
"⚠ COMPANY UNDER PRESSURE";
}
else{

bar.style.color="#70a0a7";

document.getElementById("dangerText")
.textContent=
"COMPANY STABLE";
}

let health=
Math.max(
0,
100-risk
);

document.getElementById("health")
.textContent=
health+"%";

document.getElementById("healthText")
.textContent=
health>70?
"Your company is financially healthy.":
health>40?
"Financial pressure is increasing.":
"Your company is in serious danger.";
}

function checkBankruptcy(){

let losses=
Math.min(
0,
game.cash+game.value
);

if(game.cash<=-100000||
game.value<=-100000){

alert(
"💀 BANKRUPTCY\n\n"+
game.company+
" has collapsed.\n\n"+
"Losses exceeded $100,000."
);

localStorage.removeItem(
"empireWarsSave"
);

location.reload();
}
}

function checkAchievements(){

let a=[];

if(game.day>=3)
a.push("SURVIVOR");

if(game.level>=3)
a.push("RISING EMPIRE");

if(game.employees.length>=5)
a.push("TEAM BUILDER");

if(game.value>=50000)
a.push("BIG BUSINESS");

if(game.value>=250000)
a.push("CORPORATION");

if(game.debt===0&&game.value>=100000)
a.push("DEBT FREE");

if(game.value>=1000000)
a.push("EMPIRE");

game.achievements=
[...new Set(a)];
}

function updateAchievements(){

let box=
document.getElementById("achievements");

if(!game.achievements.length){

box.innerHTML=
"<p>No achievements yet.</p>";

return;
}

box.innerHTML=
game.achievements
.map(a=>`
<div class="team-row">
🏆 ${a}
</div>
`)
.join("");
}

function panel(id,button){

document.querySelectorAll(".page")
.forEach(p=>p.classList.remove("active"));

document.getElementById(id)
.classList.add("active");

document.querySelectorAll("nav button")
.forEach(b=>b.classList.remove("active"));

button.classList.add("active");
}

function openSettings(){

document.getElementById("settings")
.classList.remove("hidden");
}

function closeSettings(){

document.getElementById("settings")
.classList.add("hidden");
}

function toggleSound(){

game.sound=!game.sound;

document.getElementById("soundBtn")
.textContent=
game.sound?"ON":"OFF";

save();
}

function resetAccount(){

let one=confirm(
"⚠ WARNING ⚠\n\n"+
"This will permanently delete your entire company."
);

if(!one)return;

let two=confirm(
"FINAL WARNING\n\n"+
"All money, stocks, employees, levels and progress will be lost.\n\n"+
"Reset?"
);

if(!two)return;

localStorage.removeItem(
"empireWarsSave"
);

location.reload();
}

function toast(message){

let box=
document.getElementById("toast");

box.textContent=message;

box.classList.add("show");

setTimeout(()=>{
box.classList.remove("show");
},2200);
}

function runClock(){

let speed=
parseInt(
document.getElementById("gameSpeed")?.value||1
);

setInterval(()=>{
gameClock();
},1000/speed);
}

load();

if(!game.started){
runClock();
}else{
runClock();
}
