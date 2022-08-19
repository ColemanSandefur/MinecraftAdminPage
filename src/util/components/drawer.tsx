import {AppBar, Drawer, IconButton, Toolbar} from "@mui/material";
import {Box} from "@mui/system";
import {ReactNode, useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";


export function ResponsiveDrawer(props: {children: ReactNode, drawer?: ReactNode, toolbar?: ReactNode}) {
  const drawerWidth = 200;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }

  const TemporaryDrawer = (props: {children: ReactNode}) => (
    <Drawer
      variant='temporary'
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{keepMounted: true}}
      sx={{
        display: {xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
      }}
    >
      {props.children}
    </Drawer>
  );

  const PermanentDrawer = (props: {children: ReactNode}) => (
    <Drawer
      variant='permanent'
      sx={{
        display: {xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
      }}
      open
    >
      {props.children}
    </Drawer>
  );

  const Dynamic = (props: {children: ReactNode}) => {
    return (
      <>
        <TemporaryDrawer>
          <Toolbar />
          {props.children}
        </TemporaryDrawer>
        <PermanentDrawer>
          <Toolbar />
          {props.children}
        </PermanentDrawer>
      </>
    )
  }

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar
        position='fixed'
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar>
          <Box>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge='start'
              sx={{
                mr: 2,
                display: { sm: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {props.toolbar}
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Dynamic>
          {props.drawer}
        </Dynamic>
      </Box>
      <Box
        component='main'
        sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  )
}
