import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';

import List from '@mui/material/List';

import { mainListItems } from '../list';

type Props = {
  open: boolean;
  drawerWidth: number;
  toggleDrawer: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const AppDrawer = ({ open, drawerWidth, toggleDrawer }: Props) => {
  return (
    <Drawer variant='permanent' drawerwidth={drawerWidth} open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component='nav'>
        {mainListItems}
        <Divider sx={{ my: 1 }} />
      </List>
    </Drawer>
  );
};

AppDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  drawerWidth: PropTypes.number.isRequired,
};

interface DrawerProps extends MuiDrawerProps {
  open: boolean;
  drawerwidth: number;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => {
    return prop !== 'open';
  },
})<DrawerProps>(({ theme, open, drawerwidth }) => {
  const drawerWidth = drawerwidth;
  return {
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  };
});

export default AppDrawer;
