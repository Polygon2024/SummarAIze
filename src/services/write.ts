import WriteEntry, { Tone, Format, Length } from '../interface/WriteEntry.type';
import { detectLanguageCode, createTranslator } from './translate';
import { getTranslationOn, getPreferredLanguage } from './setting';
import ErrorCode from '../interface/ErrorCode';

let cachedContext: string | null;
let cachedWriter: any | null;

export const getPageTitle = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.session.get('pageTitle', (result) => {
      resolve(result.pageTitle || '');
    });
  });
};

export const storeWrittenText = async (
  timestamp: number,
  title: string,
  prompt: string,
  tone: Tone,
  format: Format,
  length: Length,
  output: string,
  rewriteOutput?: string,
) => {
  const value: WriteEntry = {
    timestamp: timestamp,
    title: title,
    prompt: prompt,
    tone: tone,
    format: format,
    length: length,
    output: output,
    // rewriteOutput?: rewriteOutput,
  };

  chrome.storage.local.set({ [timestamp]: value }, () => {
    console.log('Generated text stored:', value);
  });
};

export const isWriterAPISupported = () => {
  // @ts-ignore
  return 'ai' in self && 'writer' in self.ai;
};

export const createWriter = async (
  style: string,
  tone: string,
  context: string | null
) => {
  if (!isWriterAPISupported()) {
    console.error('Writer API is not supported.');
    return null;
  }

  if (cachedContext !== context) {
    cachedContext = context;

    // @ts-ignore
    cachedWriter = await ai.writer.create({
      style: style,
      tone: tone,
      context: context,
    });

    console.log('New writer instantiated with context:', context);
  } else {
    console.log('Using cached writer with context:', context);
  }

  return cachedWriter;
};


export const writeText = async (
    text: string,
    context: string | null,
    format: Format = 'plain-text',
    tone: Tone = 'neutral',
    length: Length = 'medium'
  ) => {
    const writer = await createWriter(format, tone, context);
  
    if (!writer) {
      throw new Error('Writer could not be created.');
    }
  
    // Use the writer to generate new text with context
    const newText = await writer.write(text, { context });
  
    return newText;
  };  

  export const handleWriting = async (
    selectionText: string,
    pageUrl: string,
    context: string | null
  ) => {
    try {
      let textToProcess = selectionText;
  
      // Detect the language of the selected text
      const languageCode = await detectLanguageCode(textToProcess);
      let translatedText: string = '';
  
      // Translate non-English text into English if necessary
      if (
        languageCode !== 'en' &&
        languageCode !== ErrorCode.CannotDetect &&
        languageCode !== ErrorCode.NotSupported
      ) {
        const translator = await createTranslator(languageCode, 'en');
        textToProcess = await translator.translate(textToProcess);
        translatedText = textToProcess;
      }
  
      // Use the context passed from the component
      let newText = await writeText(textToProcess, context);
  
      // Check if translation to the preferred language is enabled
      const isTranslationOn = await getTranslationOn();
  
      if (
        isTranslationOn &&
        languageCode !== ErrorCode.CannotDetect &&
        languageCode !== ErrorCode.NotSupported
      ) {
        const targetLanguage = await getPreferredLanguage();
        const translator = await createTranslator('en', targetLanguage);
        newText = await translator.translate(newText);
      }
  
      const pageTitle = await getPageTitle();
      const tone: Tone = 'neutral';
      const format: Format = 'plain-text';
      const desiredLength: Length = 'medium';
  
      // Store the generated text
      await storeWrittenText(
        Date.now(),
        pageTitle,
        selectionText,
        tone,                 // tone: Tone
        format,               // format: Format
        desiredLength,               // length: Length
        newText,              // output: string
      );
    } catch (error) {
      console.error('An error occurred during the writing process:', error);
    }
  };
  
