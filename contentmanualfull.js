(function() {
    let stopSearch = false;
    let totalPages = 0;
    
    // V2 Settings
    const currentBookId = window.location.pathname.split('/')[3] || "unknown_book";
    let CHUNK_SIZE = 999999; // Set extremely high to prevent chunking

    function enviarProgresso(progress) {
        chrome.runtime.sendMessage({ type: 'progressUpdate', progress: progress });
    }

    function calculateTotalPages() {
        const paginationEl = document.querySelector('div[data-test-locator="pagination-total-chapter-numbers"]');
        if (paginationEl) {
            const matches = paginationEl.textContent.match(/\d+/g);
            if (matches) totalPages = parseInt(matches[0]);
            console.log(`Brute Force Active: Attempting to save all ${totalPages} pages at once.`);
        }
    }

    function exibirStatusUI() {
        if (document.getElementById('automation-status')) return;
        const msg = document.createElement('div');
        msg.id = 'automation-status';
        msg.style = "position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:15px; background:#1e1e2e; color:#a6e3a1; border:2px solid #a6e3a1; z-index:999999; font-family:sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.4); border-radius:8px;";
        msg.innerHTML = `<div id="status-text">Starting Brute Force Flow...</div>
                         <button id="stop-btn" style="margin-top:10px; cursor:pointer; background:#f38ba8; color:#11111b; font-weight:bold; border:none; padding:8px 15px; border-radius:4px; width:100%;">Stop & Save Now</button>`;
        document.documentElement.appendChild(msg);

        document.getElementById('stop-btn').onclick = () => {
            stopSearch = true;
            downloadCurrentChunk(true);
        };
    }

    async function downloadCurrentChunk(isFinal = false) {
        const msg = document.getElementById('automation-status');
        if (msg) document.getElementById('status-text').innerHTML = `<b>Packaging Full File...</b>`;

        try {
            const db = await openIndexedDB();
            const allKeys = await getAllKeys(db);
            const pageKeys = allKeys.filter(k => k.startsWith('page_')).sort();
            
            if (pageKeys.length === 0) return;

            // ZERO-VIEWPORT PRINT CSS BAKED IN
            let finalHTML = [
                "<!DOCTYPE html><html><head><title>Perlego Flow Full Export</title>",
                "<style>",
                "  /* Screen Preview (Dark Mode) */",
                "  body { background:#1e1e2e; margin:0; padding:20px; text-align:center; }",
                "  img { max-width:100%; height:auto; margin-bottom:20px; box-shadow:0 4px 10px rgba(0,0,0,0.5); }",
                
                "  /* Zero-Viewport PDF Print */",
                "  @media print {",
                "    @page { margin: 0; }", 
                "    html, body { margin: 0; padding: 0; height: 100%; background: white; }",
                "    img { ",
                "      display: block;",
                "      margin: 0 auto;", 
                "      max-width: 100%; ", 
                "      max-height: 100%; ", 
                "      page-break-after: always;", 
                "      page-break-inside: avoid;", 
                "    }",
                "  }",
                "</style></head><body>"
            ];

            for (const key of pageKeys) {
                const data = await getTodoConteudoByKey(db, key);
                if (data) finalHTML.push(data);
            }
            finalHTML.push("</body></html>");
            
            const blob = new Blob([finalHTML.join('\n')], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `FlowV2_${currentBookId}_Full.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Free RAM
            const tx = db.transaction(['conteudo'], 'readwrite');
            const store = tx.objectStore('conteudo');
            for (const k of pageKeys) store.delete(k);
            
            if (msg && isFinal) document.getElementById('status-text').innerHTML = `<b style="color:white;">Flow Complete!</b>`;
            
        } catch (e) {
            console.error("Error saving file:", e);
        }
    }

    async function processLoop(currentPage) {
        if (stopSearch) return;

        const db = await openIndexedDB();
        const lastSaved = await getLastProcessedIndex(db);

        if (currentPage <= lastSaved) return processLoop(currentPage + 1);

        const html = await procurarElementoEAutoRolar(currentPage);
        const statusLabel = document.getElementById('status-text');

        if (!html) {
            if (statusLabel) statusLabel.textContent = `Loading Page ${currentPage}...`;
            setTimeout(() => processLoop(currentPage), 3000);
        } else {
            const key = `page_${currentPage.toString().padStart(5, '0')}`;
            await putTodoConteudo(db, key, html);
            await putLastProcessedIndex(db, currentPage);
            
            if (totalPages > 0) enviarProgresso(Math.floor((currentPage / totalPages) * 100));
            if (statusLabel) statusLabel.textContent = `Flow V2 (Full): Capturing ${currentPage} / ${totalPages || '?'}`;

            if (currentPage % CHUNK_SIZE === 0) {
                await downloadCurrentChunk(false);
            }

            if (totalPages > 0 && currentPage >= totalPages) {
                await downloadCurrentChunk(true); 
            } else {
                setTimeout(() => processLoop(currentPage + 1), 1500);
            }
        }
    }

    async function procurarElementoEAutoRolar(pagina) {
        let content = document.querySelector(`div[data-chapterid='${pagina}']`);
        if (!content) content = document.getElementById(`p${pagina}--0`);

        if (!content) {
            window.scrollBy({ top: 800, behavior: "smooth" });
            let renderedPages = Array.from(document.querySelectorAll("div[id^='p']"));
            if (renderedPages.length > 0) {
                renderedPages[renderedPages.length - 1].scrollIntoView({ behavior: "smooth", block: "end" });
            }
            return null; 
        }

        content.scrollIntoView({ behavior: "smooth", block: "start" });
        let images = content.querySelectorAll("img");
        let imagesLoaded = Array.from(images).every(img => img.complete);
        let hasPlaceholder = content.querySelector(".pdfplaceholder");

        if (hasPlaceholder || !imagesLoaded) return null; 
        return content.innerHTML + '<br>\n';
    }

    async function openIndexedDB() {
        return new Promise((res) => {
            const req = indexedDB.open('FlowV2_DB', 1);
            req.onupgradeneeded = (e) => e.target.result.createObjectStore('conteudo');
            req.onsuccess = (e) => res(e.target.result);
        });
    }

    async function clearDatabase(db) {
        return new Promise((res) => {
            const tx = db.transaction(['conteudo'], 'readwrite');
            tx.objectStore('conteudo').clear();
            tx.oncomplete = () => res();
        });
    }

    async function getSavedBookId(db) {
        return new Promise((res) => {
            const req = db.transaction(['conteudo'], 'readonly').objectStore('conteudo').get('savedBookId');
            req.onsuccess = (e) => res(e.target.result);
        });
    }

    async function putSavedBookId(db, id) {
        const tx = db.transaction(['conteudo'], 'readwrite');
        tx.objectStore('conteudo').put(id, 'savedBookId');
    }

    async function putTodoConteudo(db, key, content) {
        const tx = db.transaction(['conteudo'], 'readwrite');
        tx.objectStore('conteudo').put(content, key);
    }

    async function getTodoConteudoByKey(db, key) {
        return new Promise((res) => {
            const req = db.transaction(['conteudo'], 'readonly').objectStore('conteudo').get(key);
            req.onsuccess = (e) => res(e.target.result);
        });
    }

    async function getAllKeys(db) {
        return new Promise((res) => {
            const req = db.transaction(['conteudo'], 'readonly').objectStore('conteudo').getAllKeys();
            req.onsuccess = (e) => res(e.target.result.sort());
        });
    }

    async function getLastProcessedIndex(db) {
        return new Promise((res) => {
            const req = db.transaction(['conteudo'], 'readonly').objectStore('conteudo').get('lastProcessedIndex');
            req.onsuccess = (e) => res(e.target.result || 0);
        });
    }

    async function putLastProcessedIndex(db, index) {
        const tx = db.transaction(['conteudo'], 'readwrite');
        tx.objectStore('conteudo').put(index, 'lastProcessedIndex');
    }

    async function startAutomation() {
        calculateTotalPages();
        const db = await openIndexedDB();
        const savedBookId = await getSavedBookId(db);

        if (savedBookId && savedBookId !== currentBookId) {
            console.log("New Book detected! Auto-clearing database...");
            await clearDatabase(db);
            await putSavedBookId(db, currentBookId);
        } else if (!savedBookId) {
            await putSavedBookId(db, currentBookId);
        }

        exibirStatusUI();
        processLoop(1);
    }

    startAutomation();
})();
