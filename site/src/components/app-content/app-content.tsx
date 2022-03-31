import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
//Components
import Footer from "../footer/footer";
import Main from "../../routes/main";
import Pacjent from "../../routes/pacjent";
import Miejsce from "../../routes/miejsce";
import { Routes, Route } from "react-router-dom";
// type Props = {
//   open: boolean;
//   drawerWidth: number;
//   toggleDrawer: (event: React.MouseEvent<HTMLButtonElement>) => void;
// };

const AppContent = () => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto"
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/pacjent" element={<Pacjent />} />
            <Route path="/miejsce" element={<Miejsce />} />
          </Routes>
        </Grid>
        <Footer />
      </Container>
    </Box>
  );
};

AppContent.propTypes = {
  // open: PropTypes.bool.isRequired,
  // drawerWidth: PropTypes.number.isRequired
};

export default AppContent;
