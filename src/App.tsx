import React, { useEffect, useState } from 'react';
import TabsSection from './components/TabsSection';
import { Box } from '@mui/material';
import Home from './components/Tabs/Home';
import Prompt from './components/Tabs/Prompt';
import Notes from './components/Tabs/Notes';
import Translate from './components/Tabs/Translate';
import Glossary from './components/Tabs/Glossary';
import { Resizable } from 're-resizable';

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Resizable
      defaultSize={{
        width: 600,
        height: 500,
      }}
      minWidth={400}
      minHeight={500}
      maxWidth={'80vw'}
      maxHeight={'90vh'}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          border: `2px solid #123412 !important`,
        }}
      >
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
    </Resizable>
  );
};

export default App;
