// Get Elements
const input = document.getElementById("jsonInput");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("jsonOutput");
const historyList = document.getElementById("historyList");

// Load history from localStorage
let history = JSON.parse(localStorage.getItem("jsonHistory")) || [];
renderHistory();

// File Upload Handler
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    input.value = evt.target.result;
  };
  reader.readAsText(file);
});

// Process JSON
function processJSON() {
  try {
    const parsed = JSON.parse(input.value);
    const structured = mapTypes(parsed);
    const result = JSON.stringify(structured, null, 2);
    output.textContent = result;

    // Save to history
    history.unshift(result);
    if (history.length > 10) history.pop(); // keep last 10
    localStorage.setItem("jsonHistory", JSON.stringify(history));
    renderHistory();

  } catch (e) {
    alert("Invalid JSON");
  }
}

// Recursively map values to types
function mapTypes(obj) {
  if (Array.isArray(obj)) return [mapTypes(obj[0] || null)];
  if (obj === null) return "null";
  if (typeof obj === "string") return "String";
  if (typeof obj === "number") return "Number";
  if (typeof obj === "boolean") return "Boolean";
  if (typeof obj === "object") {
    let result = {};
    for (let k in obj) {
      result[k] = mapTypes(obj[k]);
    }
    return result;
  }
  return typeof obj;
}

// Copy Output
function copyOutput() {
  navigator.clipboard.writeText(output.textContent);
  alert("Copied to clipboard!");
}

// Download Output
function downloadOutput() {
  const blob = new Blob([output.textContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "json_structure.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Render history list
function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `History ${idx+1}`;
    li.onclick = () => {
      output.textContent = item;
    };
    historyList.appendChild(li);
  });
}
