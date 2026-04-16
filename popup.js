function updateProgressBar(progress) {
  const progressBar = document.getElementById('progress');
  if(progressBar) progressBar.style.width = progress + '%';
}

function showProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if(progressBar) progressBar.style.display = 'block';
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { 
  if (message.type === 'progressUpdate') {
    updateProgressBar(message.progress);
  }
});

document.getElementById('executar').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'startScript' });
  showProgressBar();
});

document.getElementById('manual').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'startScriptmanual' });
  console.log('Manual Chunking');
  showProgressBar();
});

document.getElementById('manualfull').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'startScriptmanualfull' });
  console.log('Manual Full Brute Force');
  showProgressBar();
});

document.getElementById('clear').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'resetAndStartCapture' });
  console.log('clear');
});
