import React, { useEffect, useState } from 'react';
import TabsSection from './components/TabsSection';
import { Box } from '@mui/material';
import Home from './components/Tabs/Home';
import Summarize from './components/Tabs/Summarize';
import WriterRewriter from './components/Tabs/WriterRewriter';
import LocalStorage from './components/Tabs/LocalStorage';
import SyncStorage from './components/Tabs/SyncStorage';
import Settings from './components/Tabs/Settings';

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedText, setSelectedText] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    // Check if a specific tab should be opened
    chrome.storage.local.get(['openTab'], (result) => {
      setSelectedText(result.selectedText);
      if (result.openTab === 'summarizer') {
        setSelectedTab(1);
      } else if (result.openTab === 'writer/rewriter') {
        setSelectedTab(2);
      }
      chrome.storage.local.remove('openTab');
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '600px',
        minHeight: '500px',
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Left Tab Section */}
      <TabsSection value={selectedTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {selectedTab === 0 && <Home />}
        {selectedTab === 1 && <Summarize selectedText={selectedText} />}
        {selectedTab === 2 && <WriterRewriter />}
        {selectedTab === 3 && <LocalStorage />}
        {selectedTab === 4 && <SyncStorage />}
        {selectedTab === 5 && <Settings />}
      </Box>
    </Box>
  );
};

export default App;
