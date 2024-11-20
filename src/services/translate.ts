import supportedLanguages from '../data/supportedLanguages';
import ErrorCode from '../interface/ErrorCode';

// @ts-ignore
// const canDetect = translation.canDetect();

export const isTranslatorAPISupported = () => {
  // @ts-ignore: Ignore "Cannot find name 'translation'" error
  return 'translation' in self && 'createTranslator' in self.translation;
};

// Check if the language is supported for translation
const codeToSupportedLanguage = (code: string) => {
  if (code in supportedLanguages) {
    return supportedLanguages[code];
  }
  return ErrorCode.NotSupported;
};

// Detect highest confidence language from text
export const detectLanguageCode = async (text: string) => {
  // @ts-ignore
  const detector = await ai.languageDetector.create();

  const results = await detector.detect(text);
  const topResult = results[0];

  console.log('top language result:', topResult.detectedLanguage);
  console.log(topResult);

  if (!(topResult.detectedLanguage in supportedLanguages)) {
    return ErrorCode.NotSupported;
  }

  return topResult.confidence >= 0.6
    ? topResult.detectedLanguage
    : ErrorCode.CannotDetect;
};

export const createTranslator = async (
  sourceLanguage: string,
  targetLanguage: string
) => {
  if (!isTranslatorAPISupported()) {
    console.log('Translator API is not supported.');
    return null;
  } else if (
    // @ts-ignore: Ignore "Cannot find name 'translation'" error
    !(await translation.canTranslate({
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
    }))
  ) {
    console.log(
      `translation from ${sourceLanguage} to ${targetLanguage} is not supported`
    );
  }

  // @ts-ignore: Ignore "Cannot find name 'translation'" error
  return await self.translation.createTranslator({
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  });
};
