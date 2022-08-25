import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {ModContext} from './services/modProvider/modProvider';
import { useNavigate, } from "react-router-dom";
import {ResponsiveDrawer} from './util/components/drawer';
import ExtensionIcon from '@mui/icons-material/Extension';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {ReactNode, useContext} from 'react';
import {AppRoutes} from './routes.consts';

function SideBar(_props: {}) {
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

  const obj = AppRoutes.map((value) => {
    return (
      <ListItem key={value.path}>
        <ListItemButton onClick={() => navigate(value.path)}>
          {value.icon != null && <ListItemIcon>{value.icon}</ListItemIcon>}
          <ListItemText>{value.name}</ListItemText>
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

function Toolbar() {
  const modContext = useContext(ModContext);

  return <>{modContext.getSelectedProfile()?.name}</>
}


export function AppSidebar(props: {children: ReactNode}) {
  return (
      <ResponsiveDrawer drawer={<SideBar />} toolbar={<Toolbar />}>
        {props.children}
      </ResponsiveDrawer>
  )
}
