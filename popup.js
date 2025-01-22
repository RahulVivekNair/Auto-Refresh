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
  
  document.getElementById("clear").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "clear" });
    updateActiveTabs();
  });
  
  function updateActiveTabs() {
    chrome.storage.local.get("intervals", (data) => {
      let activeTabs = data.intervals || {};
      let list = document.getElementById("activeTabs");
      list.innerHTML = "";
      Object.keys(activeTabs).forEach(tabId => {
        chrome.tabs.get(parseInt(tabId), (tab) => {
          let listItem = document.createElement("li");
          listItem.textContent = tab.title || tab.url;
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
    });
  }
  
  updateActiveTabs();
  