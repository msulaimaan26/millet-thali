let IKS = {seasons:{}, grains:{}, pulses:{}, principles:[], sources:[]};
const esc = s => s.replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));

function why(m){
  return `${(IKS.grains[m.g]||{}).lore||""} ${(IKS.pulses[m.p]||{}).lore||""}`;
}
function wisdom(){
  const s = IKS.seasons[state.season];
  document.getElementById("tip").innerHTML = s
    ? `<h2>${s.name}</h2><p>${s.principle}</p><div><span><b>Favour</b> ${s.favour}</span><span><b>Go easy on</b> ${s.avoid}</span></div>`
    : VEG[state.season].cooling;
}
function iksSections(){
  document.getElementById("principles").innerHTML = (IKS.principles||[]).map(p=>`<li>${p}</li>`).join("");
  document.getElementById("sources").textContent = "Sources: " + (IKS.sources||[]).join("; ");
}
async function askAI(){
  const q = document.getElementById("q").value.trim(), out = document.getElementById("answer");
  if(!q){ out.textContent = "Type a question first, or tap one of the ideas above."; return; }
  out.textContent = "Thinking…";
  try{
    const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({question:q,season:state.season,grain:state.grain,pulse:state.pulse})});
    const d = await r.json();
    out.innerHTML = esc(d.answer || d.error).replace(/\n/g,"<br>");
  }catch(e){ out.textContent = "Server not reachable. Start it with: python server.py"; }
}
function aiInit(){
  const ideas = ["Plan a diabetic-friendly day","High-iron meals for a teenager","Light meals for the rains","Calcium-rich, no dairy"];
  document.getElementById("ideas").innerHTML = ideas.map(t=>`<button class="chip" type="button">${t}</button>`).join("");
  document.querySelectorAll("#ideas .chip").forEach(b=>b.onclick=()=>{document.getElementById("q").value=b.textContent;askAI();});
  document.getElementById("ask").onclick = askAI;
}
