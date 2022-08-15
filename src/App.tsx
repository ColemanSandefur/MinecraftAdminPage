import {ThemeProvider} from '@emotion/react';
import {Box, createTheme} from '@mui/material';
import {ModContextProvider} from './services/modProvider';
import {ModsPage} from './pages/modList/modsPage';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <ModContextProvider>
        <Box sx={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: darkTheme.palette.background.default,
          color: darkTheme.palette.text.primary,
        }}>
          <div className="App">
            <header className="App-header">
              <ModsPage />
            </header>
          </div>
        </Box>
      </ModContextProvider>
    </ThemeProvider>
  );
}

export default App;
