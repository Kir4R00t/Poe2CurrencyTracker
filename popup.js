function renderTotals(totals) {
  const list = document.getElementById("totals");
  list.innerHTML = "";
  const entries = Object.entries(totals || {});
  if (entries.length === 0) {
    list.innerHTML = "<li>No data found.</li>";
    return;
  }
  entries.forEach(([currency, amount]) => {
    const li = document.createElement("li");
    li.textContent = `${amount}x ${currency}`;
    list.appendChild(li);
  });
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

document.getElementById("collect").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab) return renderTotals({});

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "COLLECT_POE_TOTALS" });
    if (response && response.ok) {
      renderTotals(response.totals);
      return;
    }
  } catch (e) {
    console.log(e)
  }

  chrome.storage.local.get("poeTotals", (data) => {
    renderTotals(data.poeTotals || {});
  });
});

chrome.storage.local.get("poeTotals", (data) => {
  renderTotals(data.poeTotals || {});
});
