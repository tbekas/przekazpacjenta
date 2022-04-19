import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import CognitoUserInfo from '../../auth/CognitoUserInfo';
import { getCurrentUserInfo, signOut } from '../../auth';

const UserMenuButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenuHandler = () => {
    setAnchorEl(null);
  };

  const [userInfo, setUserInfo] = useState<undefined | CognitoUserInfo>();
  const initials =
    userInfo?.attributes.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '';

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getCurrentUserInfo();
      setUserInfo(userInfo);
    };
    getUserInfo().catch((e) => {
      console.log(e);
    });
  }, []);

  const signOutHandler = async () => {
    await signOut();
  };
  return (
    <>
      <IconButton
        color='inherit'
        id='basic-button'
        aria-controls='basic-menu'
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={openMenuHandler}
      >
        <Avatar>{initials}</Avatar>
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenuHandler}
        onClick={closeMenuHandler}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={closeMenuHandler}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={signOutHandler}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenuButton;
