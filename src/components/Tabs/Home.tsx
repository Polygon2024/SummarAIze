import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  useEffect(() => {
    const testFunction = async () => {
      try {
        // Assuming ai.summarizer.capabilities() is an async function
        // @ts-ignore: Ignore "Cannot find name 'ai'" error
        const result = await ai.summarizer.capabilities();
        console.log(result); // or handle the result as needed
      } catch (error) {
        console.error('Error fetching capabilities:', error);
      }
    };

    testFunction(); // Call the async function
  }, []); // Empty dependency array to run only once (like componentDidMount)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant='h1'>Home</Typography>
    </Box>
  );
};

export default Home;
