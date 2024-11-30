import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import {
  FormatListBulleted,
  DriveFileRenameOutline,
  Inventory,
  Cloud,
  ContentCopy,
  OpenInNew,
  Tune,
  Send,
  Sync,
  Edit,
  Delete,
  Settings,
  HelpOutline,
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';
import { Blue, Grays } from '../../theme/color';

const Guide: React.FC = () => {
  const { darkMode } = useThemeContext();

  // Choose colors based on darkMode
  const primaryTextColor = darkMode ? Grays.White : Blue.Blue7;
  const secondaryTextColor = darkMode ? Grays.Gray3 : Blue.Blue6;

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: '600px',
        margin: 'auto',
      }}
    >
      {/* Page Title */}
      <Typography
        variant='h4'
        sx={{
          textAlign: 'center',
          marginBottom: 3,
          color: primaryTextColor,
        }}
      >
        User Guide
      </Typography>

      <Stack spacing={3}>
        {/* Summarizer Section */}
        <Box>
          <Typography
            variant='h5'
            sx={{
              marginBottom: 2,
              color: primaryTextColor,
            }}
          >
            <FormatListBulleted
              sx={{
                verticalAlign: 'middle',
                marginRight: 1,
                color: primaryTextColor,
              }}
            />
            Summarizer
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <OpenInNew sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Open Link'
                secondary='Access the researched page stored via the context menu. Useful for revisiting saved pages.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Tune sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='API Settings'
                secondary='Customize summarizer settings, including type, format, and length.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Send sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Send Prompt'
                secondary='Send the entered text to generate a summary based on the settings.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ContentCopy sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Copy Summary'
                secondary='Copy the generated summary to your clipboard for easy sharing.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
          </List>
          <Typography
            variant='body2'
            sx={{
              marginTop: 1,
              color: secondaryTextColor,
            }}
          >
            The text field for entering prompts is located at the bottom of the
            page, and the generated summary appears at the top.
          </Typography>
        </Box>

        <Divider />

        {/* Writer/Rewriter Section */}
        <Box>
          <Typography
            variant='h5'
            sx={{
              marginBottom: 2,
              color: primaryTextColor,
            }}
          >
            <DriveFileRenameOutline
              sx={{
                verticalAlign: 'middle',
                marginRight: 1,
                color: primaryTextColor,
              }}
            />
            Writer/Rewriter
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Tune sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='API Settings'
                secondary='Customize writer settings, including type, format, and length.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Edit sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Context Dropdown'
                secondary='Provide additional context for the Writer API through an editable dropdown.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ContentCopy sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Copy Summary'
                secondary='Copy the generated content directly to your clipboard.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
          </List>
          <Typography
            variant='body2'
            sx={{
              marginTop: 1,
              color: secondaryTextColor,
            }}
          >
            Similar to the Summarizer, the input field is at the bottom, and the
            output is displayed at the top.
          </Typography>
        </Box>

        <Divider />

        {/* Local Storage Section */}
        <Box>
          <Typography
            variant='h5'
            sx={{
              marginBottom: 2,
              color: primaryTextColor,
            }}
          >
            <Inventory
              sx={{
                verticalAlign: 'middle',
                marginRight: 1,
                color: primaryTextColor,
              }}
            />
            Local Storage
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary='View Stored Content'
                secondary='Access summarized content stored locally on your current device.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary='Details'
                secondary="Displays the researched page's URL, summary, and original text."
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Edit sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Edit Title'
                secondary='Add or modify titles for each data entry with an inline pen icon.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Delete sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Delete Entry'
                secondary='Remove specific data entries as needed.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
          </List>
          <Typography
            variant='body2'
            sx={{
              marginTop: 1,
              color: secondaryTextColor,
            }}
          >
            Optionally, sync your data to Chrome Sync Storage for accessibility
            across devices.
          </Typography>
        </Box>

        <Divider />

        {/* Cloud Storage Section */}
        <Box>
          <Typography
            variant='h5'
            sx={{
              marginBottom: 2,
              color: primaryTextColor,
            }}
          >
            <Cloud
              sx={{
                verticalAlign: 'middle',
                marginRight: 1,
                color: primaryTextColor,
              }}
            />
            Sync Storage
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary='Cross-Device Access'
                secondary='Your stored data is available on any device logged into Chrome with the same account.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Sync sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Same Features'
                secondary='Features are identical to Local Storage but accessible across devices.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider />

        {/* Additional Features Section */}
        <Box>
          <Typography
            variant='h5'
            sx={{
              marginBottom: 2,
              color: primaryTextColor,
            }}
          >
            Additional Features
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Settings sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Settings'
                secondary='Toggle translation and select your preferred language for summarization. Default is English.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HelpOutline sx={{ color: primaryTextColor }} />
              </ListItemIcon>
              <ListItemText
                primary='Help'
                secondary='Find detailed instructions and tips for maximizing the features.'
                primaryTypographyProps={{ color: primaryTextColor }}
                secondaryTypographyProps={{ color: secondaryTextColor }}
              />
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default Guide;
