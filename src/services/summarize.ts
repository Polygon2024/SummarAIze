import DataEntry from '../interface/DataEntry.type';
import { detectLanguageCode, createTranslator } from './translate';
import { getTranslationOn, getPreferredLanguage } from './setting';
import ErrorCode from '../interface/ErrorCode';

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
  length: string,
  title: string
) => {
  // Only create a new summarizer if the context has changed
  if (cachedContext !== context) {
    cachedContext = context;

    // @ts-ignore: Ignore "Cannot find name 'ai'" error
    cachedSummarizer = await ai.summarizer.create({
      sharedContext: context,
      type,
      length,
      title,
    });
  } else {
    console.log('Using cached summarizer with context:', context);
  }

  return cachedSummarizer;
};

export const storeSummary = async (
  title: string,
  selectionText: string,
  pageUrl: string,
  summary: string,
  translatedText: string = '',
  languageDetected: string = ''
) => {
  const timestamp = Date.now();
  const value: DataEntry = {
    title: title,
    page: pageUrl,
    text: selectionText,
    timestamp: timestamp,
    isSynced: false,
    summary: summary,
    translatedText: translatedText,
    languageDetected: languageDetected,
  };

  // Store the selected text and its summary in Chrome's local storage
  chrome.storage.local.set({ [timestamp]: value });

  return summary;
};

export const summarize = async (
  text: string,
  type: string = 'key-points',
  length: string = 'short'
) => {
  // Get the current context
  const context = await getPageTitle();
  const title = context;

  // Create a summarizer only if the context has changed
  const summarizer = await createSummarizer(context, type, length, title);

  // Perform the summarization
  const summary = await summarizer.summarize(text, {
    context,
  });

  return summary;
};

// Function to handle summarization + translation to preferred language
export const handleSummarization = async (
  selectionText: string,
  pageUrl: string
) => {
  console.log('Start Handle Summarize');
  let textToBeSummarised = selectionText;
  // Preferred Language from Settings
  const targetLanguage = await getPreferredLanguage();

  // detect the language of the selected text, and translate it to English first if necessary
  const languageCode = await detectLanguageCode(textToBeSummarised);

  // if the language of the text and preferred language are different, translate the to the preferred language
  let translatedText: string = '';

  console.log('test 1');
  if (
    languageCode !== targetLanguage &&
    languageCode !== ErrorCode.CannotDetect &&
    languageCode !== ErrorCode.NotSupported
  ) {
    const translator = await createTranslator(languageCode, targetLanguage);
    translatedText = await translator.translate(textToBeSummarised);
  }

  console.log('test 2');
  // Translate non-English text into English first (summarisation API limits to English io).
  // we assume the text is English by default (e.g. in case of an error)
  if (
    !(
      languageCode === 'en' ||
      languageCode === ErrorCode.CannotDetect ||
      languageCode === ErrorCode.NotSupported
    )
  ) {
    // 1st Layer Translation to English
    const translator = await createTranslator(languageCode, 'en');
    textToBeSummarised = await translator.translate(textToBeSummarised);
  }

  console.log('test3');

  let summary = await summarize(textToBeSummarised);

  console.log('summary');
  // obtain translation details
  const isTranslationOn = await getTranslationOn();

  // translate to preferred language
  if (
    isTranslationOn &&
    languageCode !== ErrorCode.CannotDetect &&
    languageCode !== ErrorCode.NotSupported
  ) {
    const translator = await createTranslator(languageCode, targetLanguage);
    summary = await translator.translate(summary);
  }

  console.log('test4');
  const pageTitle = await getPageTitle();

  const result = await storeSummary(
    pageTitle,
    selectionText,
    pageUrl,
    summary,
    translatedText,
    languageCode
  );

  console.log('result');
  return result;
};
