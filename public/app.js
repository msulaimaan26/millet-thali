const $ = id => document.getElementById(id);
const state = {season:"winter", grain:"any", pulse:"any"};
const SLOTS = ["Breakfast","Lunch","Dinner"];
const COLORS = {Breakfast:"var(--jowar)", Lunch:"var(--ragi)", Dinner:"var(--bajra)"};
const pick = a => a[Math.floor(Math.random()*a.length)];

function chips(el, opts, key){
  el.innerHTML = "";
  opts.forEach(([val,label])=>{
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = label; b.type = "button";
    b.setAttribute("aria-pressed", state[key]===val);
    b.onclick = () => { state[key]=val; chips(el,opts,key); plan(); };
    el.appendChild(b);
  });
}

function nutrients(g, p, vegs){
  const n = {kcal:0,protein:0,fibre:0,iron:0,calcium:0};
  const add = (item, grams) => Object.keys(n).forEach(k => n[k] += item[k]*grams/100);
  add(GRAINS[g], PORTION.grain); add(PULSES[p], PORTION.pulse);
  vegs.forEach(v => add(VEG[state.season].items[v], PORTION.veg/vegs.length));
  return n;
}

function buildMeal(slot, grain){
  const g = state.grain==="any" ? grain : state.grain;
  const p = state.pulse==="any" ? pick(Object.keys(PULSES)) : state.pulse;
  const names = Object.keys(VEG[state.season].items);
  const v = pick(names);
  const dish = pick(DISHES[g][slot]).replace("{p}", PULSES[p].name.split(" (")[0]).replace("{v}", v.toLowerCase());
  return {slot, g, p, vegs:[v], dish};
}

function plan(){
  const order = Object.keys(GRAINS).sort(()=>Math.random()-.5);
  state.meals = SLOTS.map((s,i)=>buildMeal(s, order[i]));
  render();
}

function swapVeg(i){
  const m = state.meals[i], names = Object.keys(VEG[state.season].items).filter(x=>x!==m.vegs[0]);
  const old = m.vegs[0]; m.vegs=[pick(names)];
  m.dish = m.dish.replace(old.toLowerCase(), m.vegs[0].toLowerCase());
  render();
}

function render(){
  wisdom(); document.body.dataset.season = state.season;
  const tot = {kcal:0,protein:0,fibre:0,iron:0,calcium:0};
  $("meals").innerHTML = state.meals.map((m,i)=>{
    const n = nutrients(m.g, m.p, m.vegs);
    Object.keys(tot).forEach(k=>tot[k]+=n[k]);
    const gc = PORTION.grain, pc = PORTION.pulse, vc = PORTION.veg, s = gc+pc+vc;
    return `<article class="meal" style="--c:${COLORS[m.slot]}">
      <h2>${m.slot}</h2><h3>${m.dish}</h3>
      <div class="plate">
        <div class="donut" style="--a:${gc/s*100}%;--b:${(gc+pc)/s*100}%"></div>
        <ul class="legend">
          <li><i style="background:var(--ragi)"></i>${GRAINS[m.g].name.split(" (")[0]} ${gc} g</li>
          <li><i style="background:var(--jowar)"></i>${PULSES[m.p].name.split(" (")[0]} ${pc} g</li>
          <li><i style="background:var(--veg)"></i>${m.vegs[0]} ${vc} g</li>
        </ul>
      </div>
      <p class="why"><b>Why it works</b> ${why(m)}</p>
      <div class="stats">
        <div><b>${Math.round(n.kcal)}</b><span>kcal</span></div>
        <div><b>${n.protein.toFixed(1)}</b><span>protein g</span></div>
        <div><b>${n.iron.toFixed(1)}</b><span>iron mg</span></div>
        <div><b>${Math.round(n.calcium)}</b><span>calcium mg</span></div>
      </div>
      <button class="swap" onclick="swapVeg(${i})">Swap vegetable</button>
    </article>`;
  }).join("");

  const labels = {kcal:["Energy","kcal"],protein:["Protein","g"],fibre:["Fibre","g"],iron:["Iron","mg"],calcium:["Calcium","mg"]};
  let score = 0;
  $("bars").innerHTML = Object.keys(labels).map(k=>{
    const target = DAILY[k]*MEAL_SHARE, ratio = Math.min(tot[k]/target,1);
    score += ratio*20;
    return `<div class="bar"><span>${labels[k][0]}</span>
      <div class="track"><div style="width:${Math.min(tot[k]/DAILY[k]*100,100)}%"></div></div>
      <span>${Math.round(tot[k])} ${labels[k][1]} (${Math.round(tot[k]/DAILY[k]*100)}%)</span></div>`;
  }).join("");
  const s = Math.round(score);
  $("scoreNum").textContent = s;
  $("ring").style.setProperty("--p", s);
}

function init(){
  chips($("season"), [["summer","Summer"],["monsoon","Monsoon"],["winter","Winter"]], "season");
  chips($("grain"), [["any","Mix all"],...Object.entries(GRAINS).map(([k,v])=>[k,v.name.split(" (")[0]])], "grain");
  chips($("pulse"), [["any","Any"],...Object.entries(PULSES).map(([k,v])=>[k,v.name.split(" (")[0]])], "pulse");
  $("go").onclick = plan;
  $("print").onclick = () => window.print();
  plan();
}
fetch("/iks.json").then(r=>r.json()).then(j=>{IKS=j}).catch(()=>{}).finally(()=>{init();aiInit();iksSections();});
