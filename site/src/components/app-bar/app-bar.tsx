import React from 'react';
import PropTypes from 'prop-types';
import isPropValid from '@emotion/is-prop-valid';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserMenuButton from '../user-menu-button';

type Props = {
  open: boolean;
  drawerWidth: number;
  toggleDrawer: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Appbar = ({ open, drawerWidth, toggleDrawer }: Props) => {
  return (
    <AppBar position='absolute' drawerWidth={drawerWidth} open={open}>
      <Toolbar
        sx={{
          pr: '24px',
        }}
      >
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          PrzekażPacjenta.pl
        </Typography>
        <IconButton color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <UserMenuButton />
      </Toolbar>
    </AppBar>
  );
};

Appbar.propTypes = {
  open: PropTypes.bool.isRequired,
  drawerWidth: PropTypes.number.isRequired,
};

interface AppBarProps extends MuiAppBarProps {
  open: boolean;
  drawerWidth: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => {
    return isPropValid(prop) && prop !== 'open';
  },
})<AppBarProps>(({ theme, open, drawerWidth }) => {
  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});

export default Appbar;
