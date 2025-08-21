function el(id){return document.getElementById(id);}

function renderCounts(container,title,counts){
  const entries=Object.entries(counts||{}).sort((a,b)=>b[1]-a[1]);
  if(!entries.length){container.innerHTML=`<div class="muted">No ${title} yet.</div>`;return;}
  container.innerHTML=`<div class="chips">${entries.map(([w,c])=>`<span class="chip"><b>${w}</b> <i>${c}</i></span>`).join("")}</div>`;
}

function plot(canvas,series,label){
  const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);
  const w=canvas.width,h=canvas.height,pad=24,maxY=Math.max(1,...series);
  ctx.strokeStyle="#888";ctx.beginPath();ctx.moveTo(pad,h-pad);ctx.lineTo(w-pad,h-pad);ctx.moveTo(pad,h-pad);ctx.lineTo(pad,pad);ctx.stroke();
  ctx.beginPath();
  series.forEach((val,i)=>{const x=pad+(i*(w-2*pad))/(series.length-1||1);const y=h-pad-(val*(h-2*pad))/maxY;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle="#4da3ff";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="#aaa";ctx.font="12px system-ui";ctx.fillText(label,pad,14);
}

async function loadStats(){
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  const domain=tab?.url?new URL(tab.url).hostname.replace(/^www\./,""):"unknown";
  el("siteName").textContent=domain;

  const resp=await chrome.runtime.sendMessage({type:"getStats",domain});
  const {stats,domainStats}=resp;

  renderCounts(el("siteSeen"),"site seen",domainStats?.seen);
  renderCounts(el("siteTyped"),"site typed",domainStats?.typed);
  renderCounts(el("totSeen"),"totals seen",stats.totals?.seen);
  renderCounts(el("totTyped"),"totals typed",stats.totals?.typed);

  const days=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(13-i));return d.toISOString().slice(0,10);});
  const seenSeries=days.map(d=>Object.values(stats.byDay?.[d]?.seen||{}).reduce((a,b)=>a+b,0));
  const typedSeries=days.map(d=>Object.values(stats.byDay?.[d]?.typed||{}).reduce((a,b)=>a+b,0));

  plot(el("trendSeen"),seenSeries,"Seen (14d)");
  plot(el("trendTyped"),typedSeries,"Typed (14d)");
}

document.addEventListener("DOMContentLoaded",()=>{
  loadStats();
  el("reset").onclick=async()=>{if(!confirm("Reset all tracked data?"))return;await chrome.runtime.sendMessage({type:"resetData"});loadStats();};
});
