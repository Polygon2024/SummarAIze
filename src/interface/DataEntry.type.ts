export default interface DataEntry {
  // Required Entries
  title: string;
  page: string;
  text: string;
  timestamp: number;
  isSynced: boolean;

  // Optional Entries
  summary?: string;
  translatedText?: string;
  languageDetected?: string;
}
