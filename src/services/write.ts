import WriteEntry from '../interface/WriteEntry.type';
import { detectLanguageCode, createTranslator } from './translate';
import { getTranslationOn, getPreferredLanguage } from './setting';
import ErrorCode from '../interface/ErrorCode';

enum Tone {
  FORMAL = 'formal',
  NEUTRAL = 'neutral',
  CASUAL = 'casual',
}

enum Format {
  PLAIN_TEXT = 'plain-text',
  MARKDOWN = 'markdown',
}

enum Length {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
}

let cachedContext: string | null = null;
let cachedWriter: any | null = null;

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
  context?: string,
  style: string,
  tone: string
) => {
  if (!isWriterAPISupported()) {
    console.error('Writer API is not supported.');
    return null;
  }

  if (cachedContext !== context) {
    cachedContext = context;

    // @ts-ignore
    cachedWriter = await ai.writer.create({
      context: context,
      style: style,
      tone: tone,
    });

    console.log('New writer instantiated with context:', context);
  } else {
    console.log('Using cached writer with context:', context);
  }

  return cachedWriter;
};

export const writeText = async (
    text: string,
    context?: string,
    style: string = 'formal',
    tone: string = 'neutral'
  ) => {
    const writer = await createWriter(context, style, tone);
  
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
    context: string
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
  
      // Store the generated text
      await storeWrittenText(
        pageTitle,
        selectionText,
        pageUrl,
        newText,
        translatedText,
        languageCode
      );
    } catch (error) {
      console.error('An error occurred during the writing process:', error);
    }
  };
  
