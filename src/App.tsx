import {ThemeProvider} from '@emotion/react';
import {Backdrop, Box, CircularProgress, createTheme} from '@mui/material';
import {ModContext, ModContextProvider} from './services/modProvider/modProvider';
import {ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {AppRouter} from './Router';

function Loader(props: {children: ReactNode}) {
  const [loading, setLoading] = useState(false);
  const modContext = useRef(useContext(ModContext));

  useEffect(() => {
    setLoading(true);

    Promise.all([
      modContext.current.reloadProfiles(),
    ]).then(() => setLoading(false));

    return () => {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 1}} open>
          <CircularProgress />
        </Backdrop>
        {props.children}
      </>
    )
  }

  return (<>{props.children}</>)
}

function Providers(props: {children: ReactNode}) {
  return (
    <ModContextProvider>
      {props.children}
    </ModContextProvider>
  )
}

function App() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme] = useState(createTheme({
    palette: {
      mode: prefersDark ? "dark" : "light"
    }
  }));

  return (
    <Providers>
      <ThemeProvider theme={theme}>
        <Box sx={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}>
          <div className="App" >
            <header className="App-header" >
              <Loader>
                <AppRouter />
              </Loader>
            </header>
          </div>
        </Box>
      </ThemeProvider>
    </Providers>
  );
}

export default App;
