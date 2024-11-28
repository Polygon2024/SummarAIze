import React, { useEffect, useState } from 'react';
import TabsSection from './components/TabsSection';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Summarize from './components/Tabs/Summarize';
import WriterRewriter from './components/Tabs/WriterRewriter';
import LocalStorage from './components/Tabs/LocalStorage';
import SyncStorage from './components/Tabs/SyncStorage';
import Guide from './components/Tabs/Guide';
import LightTheme, { DarkTheme } from './theme/Theme';
import {
  ThemeProvider as ThemeContextProvider,
  useThemeContext,
} from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
};

const AppContent: React.FC = () => {
  const { darkMode } = useThemeContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (newValue: number) => {
    setSelectedTab(newValue);
  };

  // useEffect(() => {
  //   // Check if a specific tab should be opened
  //   chrome.storage.local.get(['openTab'], (result) => {
  //     if (result.openTab === 'summarizer') {
  //       setSelectedTab(0);
  //     } else if (['replyMessage', 'rewriteText'].includes(result.openTab)) {
  //       setSelectedTab(1);
  //     }
  //   });
  // }, []);

  return (
    <ThemeProvider theme={darkMode ? DarkTheme : LightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minWidth: '600px',
          minHeight: '500px',
          width: '100vw',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Left Tab Section */}
        <TabsSection value={selectedTab} onTabChange={handleTabChange} />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, padding: 2, ml: '36px' }}>
          {selectedTab === 0 && <Summarize />}
          {selectedTab === 1 && <WriterRewriter />}
          {selectedTab === 2 && <LocalStorage />}
          {selectedTab === 3 && <SyncStorage />}
          {selectedTab === 4 && <Guide />}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
