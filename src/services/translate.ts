// @ts-ignore
import supportedLanguages from '../data/supportedLanguages.json';

// @ts-ignore
const canDetect = await translation.canDetect();

// @ts-ignore
const detector = await translation.createDetector();

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


