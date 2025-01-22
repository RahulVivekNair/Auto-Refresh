// background.js
let refreshIntervals = {};

// Initialize intervals from storage
chrome.storage.local.get("intervals", (data) => {
  refreshIntervals = data.intervals || {};
  // Restart intervals for any previously active tabs
  Object.entries(refreshIntervals).forEach(([tabId, interval]) => {
    if (interval.timerId) {
      startRefreshing(parseInt(tabId), interval.seconds, interval.hardRefresh);
    }
  });
});

// Listen for tab removal to clean up intervals
chrome.tabs.onRemoved.addListener((tabId) => {
  stopRefreshing(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    startRefreshing(request.tabId, request.interval, request.hardRefresh);
    sendResponse({ success: true });
  } else if (request.action === "stop") {
    stopRefreshing(request.tabId);
    sendResponse({ success: true });
  } else if (request.action === "clear") {
    Object.keys(refreshIntervals).forEach(tabId => stopRefreshing(parseInt(tabId)));
    refreshIntervals = {};
    chrome.storage.local.set({ intervals: {} });
    sendResponse({ success: true });
  }
  // Return true to indicate async response
  return true;
});

function startRefreshing(tabId, interval, hardRefresh) {
  stopRefreshing(tabId); // Clear any existing interval first
  
  const timerId = setInterval(() => {
    // Check if tab still exists before refreshing
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        stopRefreshing(tabId);
        return;
      }
      chrome.tabs.reload(tabId, { bypassCache: hardRefresh });
    });
  }, interval * 1000);

  refreshIntervals[tabId] = {
    timerId: timerId,
    seconds: interval,
    hardRefresh: hardRefresh
  };
  
  chrome.storage.local.set({ intervals: refreshIntervals });
}

function stopRefreshing(tabId) {
  if (refreshIntervals[tabId]) {
    if (refreshIntervals[tabId].timerId) {
      clearInterval(refreshIntervals[tabId].timerId);
    }
    delete refreshIntervals[tabId];
    chrome.storage.local.set({ intervals: refreshIntervals });
  }
}