(function() {
    let stopSearch = false;
    let totalPages = 0;
    
    // V2 Settings
    const currentBookId = window.location.pathname.split('/')[3] || "unknown_book";
    let CHUNK_SIZE = 50; // Safe chunk limit to prevent RAM crashes

    function getJitterDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function enviarProgresso(progress) {
        chrome.runtime.sendMessage({ type: 'progressUpdate', progress: progress });
    }

    function calculateTotalPages() {
        const paginationEl = document.querySelector('div[data-test-locator="pagination-total-chapter-numbers"]');
        if (paginationEl) {
            const matches = paginationEl.textContent.match(/\d+/g);
            if (matches) totalPages = parseInt(matches[0]);
        }
    }

    // --- BULLETPROOF XML-SAFE UI ---
    function exibirStatusUI() {
        if (document.getElementById('automation-status')) return;

        const msg = document.createElement('div');
        msg.id = 'automation-status';
        msg.setAttribute('style', "position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:15px; background:white; border:2px solid #4caf50; z-index:999999; font-family:sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.2); border-radius:8px; text-align:center;");

        const statusText = document.createElement('div');
        statusText.id = 'status-text';
        statusText.textContent = 'Starting Automation...';
        statusText.setAttribute('style', 'color:black; font-weight:bold; margin-bottom:10px;');
        msg.appendChild(statusText);

        const stopBtn = document.createElement('button');
        stopBtn.id = 'stop-btn';
        stopBtn.setAttribute('style', "cursor:pointer; background:#f44336; color:white; border:none; padding:8px 15px; border-radius:4px; font-weight:bold; width:
