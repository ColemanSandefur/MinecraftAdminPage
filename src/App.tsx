import {ThemeProvider} from '@emotion/react';
import {Box, Paper, createTheme} from '@mui/material';
//import './App.css';
import {ModContextProvider} from './modProvider';
import {ModsPage} from './Mods';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  console.log(darkTheme);
  return (
    <ThemeProvider theme={darkTheme}>
      <ModContextProvider>
        <Box sx={{
          width: "100vw",
          height: "100vh",
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
