// for creating the context menu when a user right clicks
chrome.runtime.onInstalled.addListener(() => {
  console.log('SummarAIze Extension Installed');
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarySelection',
    title: 'Summarise',
    contexts: ['selection'],
  });
});

// Getting a page title
// Whenever the context menu is clicked, request the content script for a page title
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id) {
    // Send a message to the content script to get the current page title
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_TITLE' });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_TITLE') {
    console.log('Received page title from content script:', message.title);

    chrome.storage.session.set({ pageTitle: message.title }, () => {
      console.log(
        'Page title updated and saved in session storage:',
        message.title
      );
    });
  }
});

// Summary feature
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'summarySelection') {
    if (info.selectionText) {
      console.log('Selected text:', info.selectionText);

      const timestamp = Date.now();

      const type = 'key-points';
      const length = 'short';

      const context = await chrome.storage.session.get('pageTitle', (result) =>
        result.pageTitle ? result.pageTitle : ''
      );

      // @ts-ignore: Ignore "Cannot find name 'ai'" error
      const summarizer = await ai.summarizer.create({
        sharedContext: context,
        type: type,
        length: length,
      });

      const summary = await summarizer.summarize(info.selectionText, {
        context: context,
      });

      const value = {
        text: info.selectionText,
        timestamp: timestamp,
        page: info.pageUrl,
        summary: summary,
      };

      // Store the selected text and its summary in Chrome's local storage
      chrome.storage.local.set({ timestamp: value }, () => {
        console.log('Selected text stored:', value);
      });
    } else {
      console.log('No text selected or selectionText is undefined');
    }
  }
});
