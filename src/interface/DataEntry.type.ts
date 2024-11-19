export default interface DataEntry {
  // Required Entries
  page: string;
  text: string;
  timestamp: string; //TODO: Fixes required
  languageDetected?: string;

  // Optional Entries
  title?: string;
  summary?: string;
  translatedText?: string;
}
