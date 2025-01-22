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
      setTimeout(updateActiveTabs, 100);
    });
  });
  
  document.getElementById("stop").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: "stop", tabId: tabs[0].id });
      setTimeout(updateActiveTabs, 100);
    });
  });
  
  document.getElementById("clear").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "clear" });
    setTimeout(updateActiveTabs, 100);
  });
  
  function updateActiveTabs() {
    chrome.storage.local.get("intervals", (data) => {
      let activeTabs = data.intervals || {};
      let list = document.getElementById("activeTabs");
      list.innerHTML = "";
      Object.keys(activeTabs).forEach(tabId => {
        chrome.tabs.get(parseInt(tabId), (tab) => {
          let listItem = document.createElement("li");
          let tabInfo = document.createElement("span");
          tabInfo.className = "tab-info";
          tabInfo.textContent = `${tab.title} - ${tab.url} (${activeTabs[tabId] / 1000}s)`;
          let stopButton = document.createElement("button");
          stopButton.textContent = "X";
          stopButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "stop", tabId: parseInt(tabId) });
            setTimeout(updateActiveTabs, 100);
          });
          listItem.appendChild(tabInfo);
          listItem.appendChild(stopButton);
          list.appendChild(listItem);
        });
      });
    });
  }
  
  updateActiveTabs();
  