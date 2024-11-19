let cachedContext: string | null = null;
let cachedSummarizer: any | null = null;
type MenuItemId = 'summarySelection' | 'writeRewrite';

const getPageTitle = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.session.get('pageTitle', (result) => {
      resolve(result.pageTitle || '');
    });
  });
};

const createSummarizer = async (
  context: string,
  type: string,
  length: string
) => {
  // Only create a new summarizer if the context has changed
  if (cachedContext !== context) {
    cachedContext = context;

    // @ts-ignore: Ignore "Cannot find name 'ai'" error
    cachedSummarizer = await ai.summarizer.create({
      sharedContext: context,
      type,
      length,
    });

    console.log('New summarizer instantiated with context:', context);
  } else {
    console.log('Using cached summarizer with context:', context);
  }

  return cachedSummarizer;
};

const handleSummarization = async (selectionText: string, pageUrl: string) => {
  const timestamp = Date.now();
  const type = 'key-points';
  const length = 'short';

  // Get the current context
  const context = await getPageTitle();

  // Create a summarizer only if the context has changed
  const summarizer = await createSummarizer(context, type, length);

  // Perform the summarization
  const summary = await summarizer.summarize(selectionText, {
    context,
  });

  const value = {
    text: selectionText,
    timestamp,
    page: pageUrl,
    summary,
  };

  // Store the selected text and its summary in Chrome's local storage
  chrome.storage.local.set({ [timestamp]: value }, () => {
    console.log('Selected text stored:', value);
  });
};

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('SummarAIze Extension Installed');

  // Add the context menu for text selection: Summarise
  chrome.contextMenus.create({
    id: 'summarySelection',
    title: 'Summarise',
    contexts: ['selection'], // Context is text selection
  });

  // Add another context menu for text selection: Write/Rewrite
  chrome.contextMenus.create({
    id: 'writeRewrite',
    title: 'Write / Rewrite',
    contexts: ['selection'], // Context is text selection
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const menuItemId = info.menuItemId as MenuItemId;

  if (menuItemId === 'summarySelection') {
    if (info.selectionText) {
      console.log('Selected text:', info.selectionText);

      // Save the selected text and target tab to local storage
      chrome.storage.local.set({
        selectedText: info.selectionText,
        openTab: 'summarizer',
      });

      // Open the popup (index.html)
      chrome.windows.create({
        url: chrome.runtime.getURL('index.html'),
        type: 'popup',
        width: 640,
        height: 540,
      });

      await handleSummarization(info.selectionText, info.pageUrl || '');
    }
  } else if (menuItemId === 'writeRewrite') {
    if (info.selectionText) {
      // Save the selected text and target tab to local storage
      chrome.storage.local.set({
        selectedText: info.selectionText,
        openTab: 'writer/rewriter',
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
