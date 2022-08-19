import {ThemeProvider} from '@emotion/react';
import {Backdrop, Box, CircularProgress, createTheme, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {ModContext, ModContextProvider} from './services/modProvider/modProvider';
import {ModsPage} from './pages/modList/modsPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {ProfilePage} from './pages/profiles/profilePage';
import {ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ResponsiveDrawer} from './util/components/drawer';
import ExtensionIcon from '@mui/icons-material/Extension';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function SideBar(props: {}) {
  const navigate = useNavigate();

  const paths: {text: string, path: string, icon?: JSX.Element}[] = [
    {
      text: 'Mods',
      path: '/',
      icon: <ExtensionIcon />
    },
    {
      text: 'Profiles',
      path: '/profiles',
      icon: <AccountCircleIcon />
    }
  ];

  const obj = paths.map((value) => {
    return (
      <ListItem key={value.path}>
        <ListItemButton onClick={() => navigate(value.path)}>
          {value.icon != null && <ListItemIcon>{value.icon}</ListItemIcon>}
          <ListItemText>{value.text}</ListItemText>
        </ListItemButton>
      </ListItem>
    )
  });

  return (
    <List>
      {obj}
    </List>
  )
}

function Loader(props: {children: ReactNode}) {
  const [loading, setLoading] = useState(false);
  const modContext = useContext(ModContext);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      modContext.reloadProfiles(),
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

function Toolbar() {
  const modContext = useContext(ModContext);

  return <>{modContext.getSelectedProfile()?.name}</>
}

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
          <div className="App" >
            <header className="App-header" >
              <Loader>
                <Router>
                  <ResponsiveDrawer drawer={<SideBar />} toolbar={<Toolbar />}>
                    <Routes>
                      <Route path="/" element={<ModsPage />} />
                      <Route path="/profiles" element={<ProfilePage />} />
                    </Routes>
                  </ResponsiveDrawer>
                </Router>
              </Loader>
            </header>
          </div>
        </Box>
      </ModContextProvider>
    </ThemeProvider>
  );
}

export default App;
