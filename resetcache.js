async function openIndexedDB() {
    return new Promise((res, rej) => {
        const req = indexedDB.open('FlowV2_DB', 1);
        req.onupgradeneeded = (e) => e.target.result.createObjectStore('conteudo');
        req.onsuccess = (e) => res(e.target.result);
        req.onerror = (e) => rej(e.error);
    });
}

async function resetarEIniciarCaptura() {
    try {
        const db = await openIndexedDB(); 
        await new Promise((res, rej) => {
            const tx = db.transaction(['conteudo'], 'readwrite');
            const req = tx.objectStore('conteudo').clear();
            req.onsuccess = res;
            req.onerror = () => rej(req.error);
        });
        alert('V2 Continuity cleaned successfully! You are ready to start a new book.');
    } catch (error) {
        console.error("Failed to reset:", error);
    }
}

// Execute immediately when injected by the background script!
resetarEIniciarCaptura();
