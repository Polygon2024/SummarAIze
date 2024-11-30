import { useState } from 'react';
import DataEntry from '../interface/DataEntry.type';

const [allEntries, setAllEntries] = useState<DataEntry[]>([
  {
    page: 'https://mui.com/material-ui/material-icons/?query=open',
    text:
      'Welcome to the platform. This is your first step to exploring AI-powered features.',
    timestamp: 123,
    languageDetected: 'en',
    title: 'Getting Started',
    summary: '* First dot point * Second dot point * Third dot point',
    translatedText:
      'Chào mừng đến với nền tảng. Đây là bước đầu tiên của bạn để khám phá các tính năng AI.',
    isSynced: false,
  },
  {
    page: 'https://mui.com/material-ui/material-icons/?query=open',
    text: 'Learn about integrating AI into your workflows seamlessly.',
    timestamp: 1234,
    languageDetected: 'en',
    title: 'AI Integration',
    summary: '* First dot point * Second dot point * Third dot point',
    translatedText:
      'Tìm hiểu cách tích hợp AI vào quy trình làm việc của bạn một cách liền mạch.',
    isSynced: false,
  },
  {
    page: 'https://mui.com/material-ui/material-icons/?query=open',
    text: 'Learn about integrating AI into your workflows seamlessly.',
    timestamp: 1234,
    languageDetected: 'en',
    title: 'AI Integration',
    summary: '* First dot point * Second dot point * Third dot point',
    translatedText:
      'Tìm hiểu cách tích hợp AI vào quy trình làm việc của bạn một cách liền mạch.',
    isSynced: false,
  },
]);
