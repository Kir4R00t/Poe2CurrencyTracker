// So this is a very early version and I kinda have no clue how to code in JS
// That's why what you can see below is just an unholy pile of AI generated bullshit
// JS may suck but 'vibe coding' is way fucking worse

function parseCurrency(text) {
  const match = text.match(/For:\s*(\d+)x\s+(.+)/);
  if (!match) return null;
  return {
    amount: parseInt(match[1], 10),
    currency: match[2].trim(),
  };
}

function collectTotals() {
  const parent = document.querySelector(
    ".search-bar.history .search-advanced-pane .filter-group .filter-group-body"
  );
  if (!parent) {
    console.log("❌ Could not find trade history list.");
    return { ok: false, totals: {} };
  }

  const items = parent.querySelectorAll(":scope > .filter");
  const totals = {};

  items.forEach((div) => {
    const text = div.innerText.trim();
    const parsed = parseCurrency(text);
    if (parsed) {
      totals[parsed.currency] = (totals[parsed.currency] || 0) + parsed.amount;
    }
  });

  chrome.storage.local.set({ poeTotals: totals }, () => {
    console.log("💾 Totals saved", totals);
  });

  return { ok: true, totals };
}

// Listen for popup requests to collect
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "COLLECT_POE_TOTALS") {
    const result = collectTotals();
    sendResponse(result);
    return false; // close the message channel (no async work pending)
  }
});
