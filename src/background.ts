chrome.runtime.onInstalled.addListener(() => {
  console.log('SummarAIze Extension Installed');
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'textSelection',
    title: 'Your Extension Action',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'textSelection2',
    title: 'Your Extension Action 2',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    console.log('Selected text:', info.selectionText);
    // Store the selected text in Chrome's local storage
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      console.log('Selected text stored:', info.selectionText);
    });
  } else {
    console.log('No text selected or selectionText is undefined');
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'textSelection') {
    if (info.selectionText) {
      console.log('Selected text:', info.selectionText);
      chrome.storage.local.set(
        { selectedText: info.selectionText, id: info.menuItemId },
        () => {
          console.log('Selected text stored:', info.selectionText);
        }
      );
    } else {
      console.log('No text selected or selectionText is undefined');
    }
  } else if (info.menuItemId === 'textSelection2') {
    if (info.selectionText) {
      console.log('Selected text 2:', info.selectionText);
      chrome.storage.local.set(
        { selectedText: info.selectionText, id: info.menuItemId },
        () => {
          console.log('Selected text stored:', info.selectionText);
        }
      );
    } else {
      console.log('No tesxt selected 2 or selectionText is undefined');
    }
  }
});
