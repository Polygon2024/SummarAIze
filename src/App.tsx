import { Button, Typography, Container, Box } from '@mui/material';
import { Blue } from './theme/color';

function App() {
  return (
    // <Container sx={{ width: '600px', height: '450px' }}>
    <Box
      sx={{
        width: '600px',
        height: '450px',
        backgroundColor: Blue.Blue0,
        p: 0,
        m: 0,
      }}
    >
      <Typography
        variant='h4'
        gutterBottom
      >
        SummarAIze Chrome Extension
      </Typography>
      <Button
        variant='contained'
        color='primary'
      >
        Summarize Page
      </Button>
    </Box>
    // </Container>
  );
}

export default App;
