import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BedIcon from "@mui/icons-material/Bed";
import PatientIcon from "@mui/icons-material/Contacts";

type LinkStyledProps = {
  icon: React.ReactElement;
  name: React.ReactNode;
};
const LinkStyled = ({ icon, name }: LinkStyledProps) => {
  return (
    <ListItemButton>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </ListItemButton>
  );
};

export const mainListItems = (
  <React.Fragment>
    <Link to="/">
      <LinkStyled icon={<DashboardIcon />} name="Dash" />
    </Link>
    <Link to="/patient">
      <LinkStyled icon={<PatientIcon />} name="Patient" />
    </Link>
    <Link to="/bed">
      <LinkStyled icon={<BedIcon />} name="Miejsce" />
    </Link>
  </React.Fragment>
);
