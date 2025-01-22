let refreshIntervals = {};

chrome.storage.local.get("intervals", (data) => {
  refreshIntervals = data.intervals || {};
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    startRefreshing(request.tabId, request.interval, request.hardRefresh);
  } else if (request.action === "stop") {
    stopRefreshing(request.tabId);
  } else if (request.action === "globalStart") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => startRefreshing(tab.id, request.interval, request.hardRefresh));
    });
  } else if (request.action === "globalStop") {
    Object.keys(refreshIntervals).forEach(tabId => stopRefreshing(parseInt(tabId)));
  }
});

function startRefreshing(tabId, interval, hardRefresh) {
  if (refreshIntervals[tabId]) {
    clearInterval(refreshIntervals[tabId]);
  }
  refreshIntervals[tabId] = setInterval(() => {
    chrome.tabs.reload(tabId, { bypassCache: hardRefresh });
  }, interval * 1000);
  chrome.storage.local.set({ intervals: refreshIntervals });
}

function stopRefreshing(tabId) {
  if (refreshIntervals[tabId]) {
    clearInterval(refreshIntervals[tabId]);
    delete refreshIntervals[tabId];
    chrome.storage.local.set({ intervals: refreshIntervals });
  }
}