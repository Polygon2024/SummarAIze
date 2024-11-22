// get and send the page title
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_TITLE') {
    const pageTitle = document.title;
    chrome.runtime.sendMessage({ type: 'PAGE_TITLE', title: pageTitle });
  }
});
