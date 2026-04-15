chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // NEW: Live Toolbar Badge updater!
  if (message.type === 'progressUpdate') {
    chrome.action.setBadgeText({ text: `${message.progress}%` });
    chrome.action.setBadgeBackgroundColor({ color: '#a6e3a1' });
  } 
  
  else if (message.type === 'startScript') {
    chrome.action.setBadgeText({ text: '...' }); // Show it's thinking
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const id = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: id, allFrames: true },
        files: ['content.js']
      });
    }); 
  } 
  
  else if (message.type === 'startScriptmanual') {
    chrome.action.setBadgeText({ text: '...' }); // Show it's thinking
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const id = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: id, allFrames: true },
        files: ['contentmanual.js']
      });
    });
  } 
  
  else if (message.type === 'resetAndStartCapture') {
    chrome.action.setBadgeText({ text: '' }); // Clear badge on reset
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const id = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: id, allFrames: true },
        files: ['resetcache.js']
      });
    });
  }
});
