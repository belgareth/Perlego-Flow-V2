# Perlego Flow V2

A lightweight, memory-safe Chrome extension designed to automate and simplify content extraction from the Perlego e-reader. This tool helps users save books for offline reading. An active Perlego account is required.

## Acknowledgments & Motivation

This project is a heavily modified and upgraded version of the original [perlego-download](https://github.com/GladistonXD/perlego-download) repository created by GladistonXD. 

While the original script provided an excellent foundation, it struggled with several critical technical limitations when handling larger textbooks:
* **Memory Crashes:** The original tool retained all captured pages in the browser's live DOM. For books exceeding 100 pages, this would inevitably cause the browser to run out of RAM and crash.
* **Infinite Loops:** To save resources, the Perlego web app actively unloads older pages from memory as you scroll. The original script did not account for this, resulting in infinite scrolling loops when searching for unloaded elements.
* **Formatting Issues:** PDF exports frequently suffered from awkward margins, blank pages, and clipped images due to its reliance on viewport-based CSS handling.

Version 2 was completely rebuilt to solve these exact issues. By leveraging local IndexedDB storage for memory-safe chunking, implementing strict zero-viewport print CSS, and adding intelligent database continuity, this version guarantees stability and perfect formatting even on massive textbooks.

## Installation

To install this extension in Chrome, please follow the steps indicated in this guide: 
[How to install Chrome extensions manually from GitHub](https://dev.to/ben/how-to-install-chrome-extensions-manually-from-github-1612) 

*(Note: Please read through the linked guide carefully, as it contains important information regarding manual developer installations).*

## Usage

1. Open your desired book on Perlego: `https://ereader.perlego.com/1/book/(ID)`.
2. Click the Perlego Flow V2 extension icon in your toolbar.
3. Choose your download mode:
   * **ePUB Auto-Download:** For standard text-based books.
   * **PDF Smart Download:** For image-based or heavy textbook layouts.
4. Keep the tab open and active. A live progress percentage will display directly on the extension badge in your Chrome toolbar so you can track the status without keeping the popup open.

## Version 2.0 Features

* **Smart Chunking (Memory Protection):** Automatically detects book length and processes large PDFs in safe, manageable chunks (e.g., 100-200 pages at a time) to prevent browser crashes and RAM overload.
* **Smart Continuity:** Seamlessly handles interruptions. The extension detects the specific Book ID; if you stop halfway and return later, it resumes exactly where you left off. If you open a new book, it automatically clears the old cache to prevent file mixing. Active for both PDF and ePUB modes.
* **Live Toolbar Badge:** Real-time progress percentage is displayed directly on the Chrome extension icon.
* **Print-Ready CSS:** Injected custom formatting ensures that generated HTML files convert perfectly into PDFs, with images automatically scaled to individual pages and zero margins.
* **Humanized Navigation:** Implements randomized, anti-bot jitter delays to mimic natural reading patterns.

## Saving as PDF (Offline Use)

The extension outputs formatted `.html` files. To compile these into a readable offline eBook:

1. Open the downloaded `.html` file in your browser.
2. Press **Ctrl + P** (or right-click and select Print).
3. Set the destination to **Save as PDF**.
4. *Note: V2's Print-Ready CSS handles the layout automatically, stripping background UI and perfectly framing each page.*
5. Click Save.

## Maintenance & Reset

Thanks to *Smart Continuity*, manual database management is rarely needed. However, to force the extension to wipe the current cache and start a book from Page 1, open the extension popup and click **Force Reset Database**.

---

## Support the Project

If this extension has saved you time and helped your studies or workflow, please consider supporting its ongoing development. Maintaining this tool against platform updates takes time and effort.

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=USR242HKMCFG2)
