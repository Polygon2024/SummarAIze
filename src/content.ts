// Inject the global.css file into the page
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('src/global.css'); // Ensure it's correctly bundled in dist
document.head.appendChild(link);

console.log('SummarAIze content script running');
