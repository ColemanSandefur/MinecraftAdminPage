import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {AppSidebar} from './AppSidebar';
import {AppRoutes} from './routes.consts';

export function AppRouter() {

  const routes = AppRoutes.map((route) => {
    return <Route key={route.path} path={route.path} element={route.page} />
  });

  return (
    <Router>
      <AppSidebar>
        <Routes>
          {routes}
        </Routes>
      </AppSidebar>
    </Router>
  )
}
