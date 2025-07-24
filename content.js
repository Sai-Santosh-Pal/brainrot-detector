if (!localStorage.getItem("brainrot")) {
  console.log("NO LOGS");
  localStorage.setItem("brainrot", JSON.stringify([]));
  localStorage.setItem("brainrotCount", "0");
}

const pageText = document.body.innerText.toLowerCase();
const wordList = ["brainrot", "rizz", "sigma", "gyatt", "aura", "ohio", "skibidi toilet", "dayum"];

const foundWord = wordList.find(w => pageText.includes(w));
console.log(foundWord);

if (foundWord) {
  alert("Potential brainrot found.");
  let stored = localStorage.getItem("brainrot");
  let arr = [];

  try {
    arr = JSON.parse(stored);
    if (!Array.isArray(arr)) arr = [];
  } catch (e) {
    console.error("Invalid JSON. Resetting brainrot log.");
    arr = [];
  }

  arr.push(foundWord);
  localStorage.setItem("brainrot", JSON.stringify(arr));
  localStorage.setItem("brainrotCount", arr.length.toString());

  console.log("Updated brainrot log:", arr);
}
