import { Components, Theme } from '@mui/material';
import Tabs from './components/Tabs';
import Button from './components/Button';
import Divider from './components/Divider';
import Appbar from './components/AppBar';

const components: Components<Omit<Theme, 'components'>> = {
  ...Button,
  ...(Appbar as Components<Omit<Theme, 'components'>>),
  ...(Divider as Components<Omit<Theme, 'components'>>),
  ...(Tabs as Components<Omit<Theme, 'components'>>),
};

export default components;
