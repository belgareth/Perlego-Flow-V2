# Perlego Flow V2 Chrome ExtensionAn active account is required.
# An active account is required.

A lightweight, memory-safe Chrome extension designed to automate and simplify content extraction from the Perlego e-reader. This tool helps users save books for offline reading. An active Perlego account is required.

## Acknowledgments & Motivation

This project is a heavily modified and upgraded version of the original [perlego-download](https://github.com/GladistonXD/perlego-download) repository created by GladistonXD. 

While the original script provided an excellent foundation, it struggled with several critical technical limitations when handling larger textbooks, including memory crashes, infinite loops on unloaded elements, and messy PDF formatting. Version 2 was completely rebuilt to solve these exact issues. By leveraging local IndexedDB storage for memory-safe chunking, implementing strict zero-viewport print CSS, and adding intelligent database continuity, this version guarantees stability and perfect formatting even on massive textbooks.

## Installation

To install this extension in Chrome, please follow the steps indicated in this guide: 
[How to install Chrome extensions manually from GitHub](https://dev.to/ben/how-to-install-chrome-extensions-manually-from-github-1612) 

*(Note: Please read through the linked guide carefully, as it contains important information regarding manual developer installations).*

## Usage

1. Open your desired book on Perlego: `https://ereader.perlego.com/1/book/(ID)`.
2. Click the Perlego Flow V2 extension icon in your toolbar.
3. Choose your download mode:
   * **ePUB Auto-Download:** For standard text-based books.
   * **PDF Smart Download (Safe Chunks):** Recommended for PDFs. Automatically breaks large books into smaller parts to prevent browser memory crashes.
   * **PDF Brute Download (Full):** Downloads the entire PDF as a single file. *Warning: May crash Chrome on very large or image-heavy books due to browser memory limits!*
4. Keep the tab open and active. A live progress percentage will display directly on the extension badge in your Chrome toolbar so you can track the status without keeping the popup open.

## Version 2.0 Features

* **Smart Chunking vs. Brute Force:** Massive books no longer crash your browser. V2 detects the length of the book and defaults to breaking it into safe, downloadable chunks (e.g., Pages 1-100, 101-200) while actively clearing your browser's RAM. Alternatively, use Brute Force to get everything in one file if your PC can handle it.
* **Smart Continuity:** Seamlessly handles interruptions. The extension detects the specific Book ID; if you stop halfway and return later, it resumes exactly where you left off. If you open a new book, it automatically clears the old cache to prevent file mixing.
* **Live Toolbar Badge:** Real-time progress percentage is displayed directly on the Chrome extension icon.
* **Print-Ready CSS:** Injected custom formatting ensures that generated HTML files convert perfectly into PDFs, with images automatically scaled to individual pages and zero margins.
* **Classic UI:** A redesigned popup interface featuring clean, skeuomorphic (glossy) aesthetics and clear warning labels.

## Saving as PDF (Offline Use)

The extension outputs formatted `.html` files. To compile these into a readable offline eBook:

1. Open the downloaded `.html` chunk (or full file) in your browser.
2. Press **Ctrl + P** (or right-click and select Print).
3. Set the destination to **Save as PDF**.
4. *Note: V2's Print-Ready CSS handles the layout automatically, stripping background UI and perfectly framing each page.*
5. Click Save.

## Maintenance & Reset

Thanks to Smart Continuity, manual database management is rarely needed. However, to force the extension to wipe the current cache and start a book from Page 1, open the extension popup and click **Force Reset Database**.

---

## Support the Project

If this extension has saved you time and helped your studies or workflow, please consider supporting its ongoing development. Maintaining this tool against platform updates takes time and effort.

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=USR242HKMCFG2)
