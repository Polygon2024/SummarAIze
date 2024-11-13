import React, { useState } from 'react';
import TabsSection from './components/TabsSection';
import MainContent from './components/MainContent';
import { Box } from '@mui/material';
import Home from './components/Tabs/Home';
import Prompt from './components/Tabs/Prompt';
import Notes from './components/Tabs/Notes';
import Translate from './components/Tabs/Translate';
import Glossary from './components/Tabs/Glossary';

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', width: '450px', height: '600px' }}>
      {/* Left Tab Section */}
      <TabsSection value={selectedTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {selectedTab === 0 && <Home />}
        {selectedTab === 1 && <Prompt />}
        {selectedTab === 2 && <Notes />}
        {selectedTab === 3 && <Translate />}
        {selectedTab === 4 && <Glossary />}
      </Box>
    </Box>
  );
};

export default App;
