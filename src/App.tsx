import {ThemeProvider} from '@emotion/react';
import {Box, createTheme, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {ModContextProvider} from './services/modProvider';
import {ModsPage} from './pages/modList/modsPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {ProfilePage} from './pages/profiles/profilePage';
import {useRef} from 'react';
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

function App() {
  let drawer = useRef<HTMLDivElement>(null);
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
              <Router>
                <ResponsiveDrawer drawer={<SideBar />} >
                  <Routes>
                    <Route path="/" element={<ModsPage />} />
                    <Route path="/profiles" element={<ProfilePage />} />
                  </Routes>
                </ResponsiveDrawer>
              </Router>
            </header>
          </div>
        </Box>
      </ModContextProvider>
    </ThemeProvider>
  );
}

export default App;
