let cachedContext: string | null = null;
let cachedSummarizer: any | null = null;

// Function to get the page title from storage
export const getPageTitle = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.session.get('pageTitle', (result) => {
      resolve(result.pageTitle || '');
    });
  });
};

// Function to create a summarizer
export const createSummarizer = async (
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

// Function to handle summarization
export const handleSummarization = async (
  selectionText: string,
  pageUrl: string
) => {
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
