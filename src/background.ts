import { handleSummarization } from '../src/services/summarize';

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('SummarAIze Extension Installed');

  // Add the context menu for text selection
  chrome.contextMenus.create({
    id: 'summarySelection',
    title: 'Summarise',
    contexts: ['selection'], // Context is text selection
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'summarySelection') {
    if (info.selectionText) {
      console.log('Selected text:', info.selectionText);
      await handleSummarization(info.selectionText, info.pageUrl || '');
    } else {
      console.log('No text selected or selectionText is undefined');
    }
  }
});

// Handle incoming messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_TITLE') {
    console.log('Received page title from content script:', message.title);

    // Store the page title in session storage
    chrome.storage.session.set({ pageTitle: message.title }, () => {
      console.log(
        'Page title updated and saved in session storage:',
        message.title
      );
    });
  }
});
