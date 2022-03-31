import React from "react";
import PropTypes from "prop-types";
import { Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <footer>
      <Copyright />
    </footer>
  );
};

Footer.propTypes = {
  children: PropTypes.element
};

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx={{ mt: 0.8 }}>
      {"Copyright © Przekaż pacjenta "}
      {new Date().getFullYear()}
      {". | Created by: "}
      <Link color="inherit" href="https://mui.com/">
        Aplinet
      </Link>{" "}
    </Typography>
  );
}

export default Footer;
