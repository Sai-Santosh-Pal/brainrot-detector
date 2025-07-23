const pageText = document.body.innerText
// console.log(pageText)
const word = [
    "brainrot", "rizz", "sigma", "gyatt", "delulu", "cringe", "npc", "skibidi", "bambik", "fanum tax",
    "goofy ahh", "gigachad", "grwm", "drip", "rizzler", "sus", "yeat", "mid", "fyp", "devious", "slay",
    "mewing", "based", "simp", "kys", "ratio", "npc energy", "sigma grindset", "idc", "idgaf", "bruh",
    "goofy", "tiktok", "zoomies", "sheesh", "slaps", "no cap", "cap", "opinion discarded", "rizz god",
    "top g", "troll", "we live in a society", "gaslight", "npc moment", "sussy baka", "l bozo", "touch grass",
    "stan", "bussin", "drippy", "shesh", "tw", "rizz up", "mald", "smegma", "goblin mode", "dark academia",
    "girl dinner", "skibidi toilet", "skibidi ohio", "broccoli haircut", "emo phase", "emo edit", "phantom rizz",
    "babygirl", "glowup", "side eye", "bombastic", "aesthetic", "vibe check", "he's just like me fr", "it's giving",
    "silly goofy mood", "zesty", "corecore", "fan edit", "capcut", "ohio", "sigma male", "alpha male", "femboy",
    "degenerate", "thirst trap", "e-girl", "e-boy", "italiano cringe", "ciao bella", "papi chulo", "mamma mia",
    "spaghetti brain", "machiavellian rizz", "glizzy", "baddie", "bffr", "audacity", "cancelled", "manifest",
    "shadiest", "girlboss", "fypcore", "ytp", "weirdcore", "trauma dump"
  ];
  
const found = keywords.some(word => pageText.toLowerCase().includes(word.toLowerCase()));

if (found) {
    alert("Brainrot found")
}
