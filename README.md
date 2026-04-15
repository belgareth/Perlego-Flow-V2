# Perlego Flow V2 (Automated Edition)

A smart, memory-safe Chrome extension to automate content downloads from the Perlego e-reader. An active account is required.

## 🚀 Installation
1. Download the repository files.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the folder containing these files.

## 📖 How to Use
1. Access your book at `https://ereader.perlego.com/1/book/(ID)`.
2. Open the extension popup.
3. **For ePUBs:** Click **⬇️ ePUB Auto-Download**.
4. **For PDFs:** Click **✨ PDF Smart Download**. 
5. A status bar will appear at the top of the page. Do not close the tab! The script will automatically navigate, wait for high-res images to load, and compile the files.

## ✨ Version 2.0 Features
- **Smart Chunking (Memory Protection):** Massive books no longer crash your browser. V2 detects the length of the book and automatically breaks it into safe, downloadable chunks (e.g., Pages 1-100, 101-200) while actively clearing your browser's RAM to keep the script running fast.
- **Smart Continuity:** You no longer need to manually clear your progress. V2 automatically reads the Perlego URL. If it detects you are viewing a new book, it auto-wipes the previous book's data and starts fresh. If the script gets interrupted, just refresh the page and hit start—it resumes exactly where it left off.
- **Print-Ready CSS:** V2 injects custom formatting into the generated HTML. When you save it as a PDF, images perfectly snap to individual pages with zero margins and no awkward cut-offs.
- **Anti-Bot Jitter:** Uses randomized delays to mimic human reading patterns, reducing the risk of being flagged.

## 📄 Saving as PDF (Offline Use)
The extension generates formatted `.html` files. To convert them into a perfect eBook:
1. Open the generated `.html` chunk in your browser.
2. Press **Ctrl + P** (or right-click and select Print).
3. Ensure the destination is set to **Save as PDF**.
4. *Thanks to V2's Print-Ready CSS, the preview will automatically strip the background and format each image perfectly onto its own page!*
5. Click Save.

## 🛠️ Maintenance & Reset
Because of V2's *Smart Continuity*, you rarely need to reset the tool. However, if you want to force the extension to forget your current book and start from Page 1, click the **⚠ Force Reset Database** button at the bottom of the extension popup.
