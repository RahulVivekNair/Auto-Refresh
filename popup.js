// popup.js
document.getElementById("start").addEventListener("click", () => {
    let interval = document.getElementById("interval").value;
    let hardRefresh = document.getElementById("hardRefresh").checked;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        action: "start",
        tabId: tabs[0].id,
        interval: parseInt(interval),
        hardRefresh: hardRefresh
      });
      updateActiveTabs();
    });
  });
  
  document.getElementById("stop").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: "stop", tabId: tabs[0].id });
      updateActiveTabs();
    });
  });
  
  document.getElementById("globalStart").addEventListener("click", () => {
    let interval = document.getElementById("interval").value;
    let hardRefresh = document.getElementById("hardRefresh").checked;
    chrome.runtime.sendMessage({ action: "globalStart", interval: parseInt(interval), hardRefresh: hardRefresh });
    updateActiveTabs();
  });
  
  document.getElementById("globalStop").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "globalStop" });
    updateActiveTabs();
  });
  
  function updateActiveTabs() {
    chrome.storage.local.get("intervals", (data) => {
      let activeTabs = data.intervals || {};
      let list = document.getElementById("activeTabs");
      list.innerHTML = "";
      Object.keys(activeTabs).forEach(tabId => {
        let listItem = document.createElement("li");
        listItem.textContent = "Tab ID: " + tabId;
        let stopButton = document.createElement("button");
        stopButton.textContent = "✖";
        stopButton.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "stop", tabId: parseInt(tabId) });
          updateActiveTabs();
        });
        listItem.appendChild(stopButton);
        list.appendChild(listItem);
      });
    });
  }
  
  updateActiveTabs();
  