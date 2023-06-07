import { createTheme, CssBaseline, IconButton, ThemeProvider } from '@mui/material';
import MainPage from './pages/MainPage';
import { Leva } from 'leva';
import ScrollNavigation from './components/ScrollNavigation/ScrollNavigation';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useState } from 'react';
import {Loader} from "@react-three/drei";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const [debugActive, setDebugActive] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <Leva hidden={!debugActive} />
      <CssBaseline />
      <MainPage />
      <IconButton
        sx={{ position: 'fixed', bottom: 25, right: 25 }}
        onClick={() => setDebugActive(!debugActive)}
      >
        <BugReportIcon color={debugActive ? 'success' : 'inherit'} />
      </IconButton>
      <Loader />
    </ThemeProvider>
  );
};

export default App;
