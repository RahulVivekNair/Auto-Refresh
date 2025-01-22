// popup.js
document.getElementById("start").addEventListener("click", async () => {
    const interval = parseInt(document.getElementById("interval").value);
    const hardRefresh = document.getElementById("hardRefresh").checked;
    
    if (interval < 1) {
      alert("Interval must be at least 1 second");
      return;
    }
    
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await chrome.runtime.sendMessage({
        action: "start",
        tabId: tabs[0].id,
        interval: interval,
        hardRefresh: hardRefresh
      });
      updateActiveTabs();
    }
  });
  
  document.getElementById("stop").addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await chrome.runtime.sendMessage({ action: "stop", tabId: tabs[0].id });
      updateActiveTabs();
    }
  });
  
  document.getElementById("clear").addEventListener("click", async () => {
    await chrome.runtime.sendMessage({ action: "clear" });
    updateActiveTabs();
  });
  
  async function updateActiveTabs() {
    const data = await chrome.storage.local.get("intervals");
    const activeTabs = data.intervals || {};
    const list = document.getElementById("activeTabs");
    list.innerHTML = "";
    
    for (const tabId of Object.keys(activeTabs)) {
      try {
        const tab = await chrome.tabs.get(parseInt(tabId));
        const listItem = document.createElement("li");
        
        const tabInfo = document.createElement("span");
        tabInfo.className = "tab-info";
        tabInfo.textContent = `${tab.title || 'Unknown Tab'} - ${tab.url || 'Unknown URL'} (${activeTabs[tabId].seconds}s)`;
        
        const stopButton = document.createElement("button");
        stopButton.textContent = "X";
        stopButton.onclick = async () => {
          await chrome.runtime.sendMessage({ action: "stop", tabId: parseInt(tabId) });
          updateActiveTabs();
        };
        
        listItem.appendChild(tabInfo);
        listItem.appendChild(stopButton);
        list.appendChild(listItem);
      } catch (error) {
        // Tab no longer exists, clean it up
        chrome.runtime.sendMessage({ action: "stop", tabId: parseInt(tabId) });
      }
    }
  }
  
  // Start the initial update
  updateActiveTabs();