import supportedLanguages from '../data/supportedLanguages';

// @ts-ignore
const canDetect = await translation.canDetect();

// @ts-ignore
const detector = await translation.createDetector();

export const isTranslatorAPISupported = () => {
  // @ts-ignore: Ignore "Cannot find name 'translation'" error
  return 'translation' in self && 'createTranslator' in self.translation;
};

// Check if the language is supported for translation
const codeToSupportedLanguage = (code: string) => {
  if (code in supportedLanguages) {
    return supportedLanguages[code];
  }
  return false;
};

// Detect highest confidence language from text
export const detectLanguageCode = async (text: string) => {
  const results = await detector.detect(text);
  const topResult = results[0];

  if (!codeToSupportedLanguage(topResult.languageCode)) {
    return 'Not Supported';
  }

  return topResult.confidence >= 0.6
    ? topResult.detectedLanguage
    : 'Cannot Detect';
};

export const createTranslator = async (
  sourceLanguage: string,
  targetLanguage: string
) => {
  if (
    !(
      isTranslatorAPISupported() &&
      // @ts-ignore: Ignore "Cannot find name 'translation'" error
      (await translation.canTranslate({
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      }))
    )
  ) {
    console.log(
      `Unable to translate due to either (1) Translator API or (2) translation from ${sourceLanguage} to ${targetLanguage} is not supported`
    );
    return null;
  }

  // @ts-ignore: Ignore "Cannot find name 'translation'" error
  return await self.translation.createTranslator({
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  });
};
