import {ReactNode} from "react";
import {ModsPage} from "./pages/modList/modsPage";
import {ProfilePage} from "./pages/profiles/profilePage";
import ExtensionIcon from '@mui/icons-material/Extension';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export interface Route {
  name: string;
  path: string;
  page: ReactNode;
  icon: ReactNode;
}

export const AppRoutes: Route[] = [
    {
      name: 'Mods',
      path: '/',
      page: <ModsPage />,
      icon: <ExtensionIcon />,
    },
    {
      name: 'Profiles',
      path: '/profiles',
      page: <ProfilePage />,
      icon: <AccountCircleIcon />,
    }
]
