// content.js — scans page text + user typing for brainrot

(() => {
  if (location.protocol === "chrome-extension:") return;

  const DEFAULT_WORDS = [
    "brainrot","rizz","sigma","gyatt","skibidi","aura","ohio","skibidi toilet",
    "dayum","fanum tax","meowed","goon","bussin","cap","no cap","drip","mid",
    "ratio","delulu","touch grass","based","ick","slay","bruh","lowkey","highkey"
  ];

  const getDomain = () => {
    try { return new URL(location.href).hostname.replace(/^www\./, ""); }
    catch { return location.hostname || "unknown"; }
  };

  async function getWordList() {
    const res = await chrome.storage.local.get({ wordList: null });
    return (res.wordList && res.wordList.length ? res.wordList : DEFAULT_WORDS).map(w=>w.toLowerCase());
  }

  // ---- Page Scan ----
  async function scanPageAndReport() {
    const words = await getWordList();
    const hay = (document.body?.innerText || "").toLowerCase();
    const counts = {};
    for (const w of words) {
      const pattern = (/\s/.test(w)) ? w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") : `\\b${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`;
      const re = new RegExp(pattern,"g");
      const matches = hay.match(re);
      if (matches) counts[w] = (counts[w]||0)+matches.length;
    }
    if (Object.keys(counts).length) {
      chrome.runtime.sendMessage({ type:"logFound", domain:getDomain(), counts });
      alert("⚠️ Brainrot detected!\n\n" + Object.keys(counts).join(", "));
    }
  }

  // ---- Typed Brainrot ----
  const debounce = (fn, wait=600) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),wait); }; };

  function tokenize(s) {
    return (s||"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(Boolean);
  }

  async function initTypingWatchers() {
    const words = await getWordList();
    const singles = new Set(words.filter(w=>!w.includes(" ")));
    const phrases = words.filter(w=>w.includes(" "));

    function findCounts(text) {
      const out={};
      const tokens=tokenize(text);
      for(const t of tokens) if(singles.has(t)) out[t]=(out[t]||0)+1;
      const hay=(text||"").toLowerCase();
      for(const p of phrases){ const re=new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"); const m=hay.match(re); if(m) out[p]=(out[p]||0)+m.length; }
      return out;
    }

    const report = debounce((text)=>{
      const counts=findCounts(text);
      if(Object.keys(counts).length){
        chrome.runtime.sendMessage({ type:"logTyped", domain:getDomain(), counts });
        alert("⚠️ You typed brainrot:\n\n"+Object.keys(counts).join(", "));
      }
    },800);

    const attach = (el)=>{
      if(!el||el.__brainrot_watch) return;
      el.__brainrot_watch=true;
      const handler=()=>{ const text=el.isContentEditable?el.innerText:el.value; report(text); };
      el.addEventListener("input",handler,{passive:true});
      el.addEventListener("keyup",handler,{passive:true});
    };

    const selectEditable=()=>document.querySelectorAll('input[type="text"],input[type="search"],textarea,[contenteditable]');
    selectEditable().forEach(attach);
    new MutationObserver(()=>selectEditable().forEach(attach))
      .observe(document.documentElement||document.body,{childList:true,subtree:true});
  }

  scanPageAndReport();
  initTypingWatchers();
})();
