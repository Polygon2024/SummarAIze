import { handleSummarization } from './services/summarize';

let cachedContext: string | null = null;
let cachedSummarizer: any | null = null;
type MenuItemId = 'summarySelection' | 'replyMessage' | 'rewriteText';

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Add the context menu for text selection: Summarise
  chrome.contextMenus.create({
    id: 'summarySelection',
    title: 'Summarise',
    contexts: ['selection'], // Context is text selection
  });

  // Add another context menu for text selection: Write/Rewrite
  chrome.contextMenus.create({
    id: 'replyMessage',
    title: 'Draft Message Replies',
    contexts: ['selection'],
  });

  // Add another context menu for text selection: Write/Rewrite
  chrome.contextMenus.create({
    id: 'rewriteText',
    title: 'Rewrite Text',
    contexts: ['selection'],
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const menuItemId = info.menuItemId as MenuItemId;

  if (menuItemId === 'summarySelection') {
    if (info.selectionText) {
      let textToBeSummarised = info.selectionText;

      // Save the selected text and target tab to local storage
      chrome.storage.local.set({
        selectedText: textToBeSummarised,
        pageUrl: info.pageUrl,
        openTab: 'summarizer',
      });

      // Open the popup (index.html)
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        width: 640,
        height: 540,
      });
    }
  } else if (['replyMessage', 'rewriteText'].includes(menuItemId)) {
    if (info.selectionText) {
      // Save the selected text and target tab to local storage
      chrome.storage.local.set({
        selectedText: info.selectionText,
        openTab: menuItemId,
      });

      // Open the popup (index.html)
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        width: 640,
        height: 540,
      });
    }
  } else {
    console.log('No text selected or selectionText is undefined');
  }
});

// Handle incoming messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_TITLE') {
    // Store the page title in session storage
    chrome.storage.session.set({ pageTitle: message.title }, () => {
      console.log(
        'Page title updated and saved in session storage:',
        message.title
      );
    });
  }
});
