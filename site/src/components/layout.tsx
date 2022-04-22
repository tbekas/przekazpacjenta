import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import store from "../store";
import { Provider } from "react-redux";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import theme from "./theme";
import AppBar from "./app-bar/app-bar";
import AppDrawer from "./app-drawer/app-drawer";
import AppContent from "./app-content/app-content";


const drawerWidth: number = 240;

export interface IOpen {
  open: boolean;
}
function DashboardContent() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
          <AppDrawer open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
          <AppContent></AppContent>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
