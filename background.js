let refreshInterval = {};

chrome.storage.local.get("interval", (data) => {
  refreshInterval = data.interval || {};
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    startRefreshing(request.tabId, request.interval);
  } else if (request.action === "stop") {
    stopRefreshing(request.tabId);
  }
});

function startRefreshing(tabId, interval) {
  if (refreshInterval[tabId]) {
    clearInterval(refreshInterval[tabId]);
  }
  refreshInterval[tabId] = setInterval(() => {
    chrome.tabs.reload(tabId);
  }, interval * 1000);
  chrome.storage.local.set({ interval: refreshInterval });
}

function stopRefreshing(tabId) {
  if (refreshInterval[tabId]) {
    clearInterval(refreshInterval[tabId]);
    delete refreshInterval[tabId];
    chrome.storage.local.set({ interval: refreshInterval });
  }
}
