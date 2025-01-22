// popup.js
document.getElementById("start").addEventListener("click", () => {
    let interval = document.getElementById("interval").value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        action: "start",
        tabId: tabs[0].id,
        interval: parseInt(interval)
      });
    });
  });
  
  document.getElementById("stop").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        action: "stop",
        tabId: tabs[0].id
      });
    });
  });
  