import { AppBar, Box, Container, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';

import Dot from '../../assets/icons/top_dot.svg';
import MenuItem from '@mui/material/MenuItem';
import SwipeableTemporaryDrawer from '../swipedrawer/drawer';
import Uparrow from '../../assets/icons/pol.svg';
import { User } from '../../models/User';
import cartIconRX from '../../assets/icons/cart-rx.svg';
import chevronright from '../../assets/icons/chevron-right.svg';
import gear from '../../assets/icons/gear.svg';
import logoUrl from '../../assets/icons/logo.svg';
import logout from '../../assets/icons/logout.svg';
import { profileActions } from '../../store/Actions';
import starfill from '../../assets/icons/star-fill.svg';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Header = () => {
  const router = useNavigate();

  const [open, setOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const dispatch = useAppDispatch();

  const user: User = useAppSelector((state) => state.profileReducer.user);

  const handleClick = () => {
    if (document.body.clientWidth > 900) {
      setOpenSidebar(false);
      setOpen(!open);
    } else {
      setOpenSidebar(!openSidebar);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOpenSidebar(false);
  };

  const logoutHandler = async () => {
    try {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('User');
      sessionStorage.removeItem('isSessionOngoing');
      dispatch(profileActions.setLogin(false));
      router('/');
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const gotoDashboard = () => {
    router('/home/dashboard');
  };

  const settingHandler = () => {
    router('/home/settings');
  };

  return (
    <>
      <AppBar position="absolute" className="site-header">
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" style={{ position: 'relative' }}>
            <Box>
              <Stack direction="row" alignItems="center">
                <Box className="navbar-brand">
                  <img src={logoUrl} alt="Imprimis RX A Harrow Company" width={150} onClick={gotoDashboard} />
                </Box>
                <Box className="navbar-nav">
                  <ul>
                    {user && (
                      <>
                        <li>
                          <NavLink to="/home/dashboard" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                            <div>
                              <img src={Dot} alt="Imprimis RX A Harrow Company" />
                            </div>
                            Dashboard
                          </NavLink>
                        </li>

                        {user.isApproved ? (
                          <>
                            <li>
                              <NavLink to="/home/patient" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                                <div>
                                  <img src={Dot} alt="Imprimis RX A Harrow Company" />
                                </div>
                                Patients
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/home/prescriptions" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                                <div>
                                  <img src={Dot} alt="Imprimis RX A Harrow Company" />
                                </div>
                                Prescriptions
                              </NavLink>
                            </li>
                          </>
                        ) : (
                          <>
                            <li>
                              <NavLink to="/home/patient" className="link-not-available">
                                Patients
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/home/prescriptions" className="link-not-available">
                                Prescriptions
                              </NavLink>
                            </li>
                          </>
                        )}
                      </>
                    )}
                    <li>
                      <NavLink to="/home/settings" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                        <div>
                          <img src={Dot} alt="Imprimis RX A Harrow Company" />
                        </div>
                        Settings
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/home/product" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                        <div>
                          <img src={Dot} alt="Imprimis RX A Harrow Company" />
                        </div>
                        Product Catalog
                      </NavLink>
                    </li>
                  </ul>
                </Box>
              </Stack>
            </Box>
            <Box className="site-header-profile-side">
              <Stack direction="row" alignItems="center" gap={3} className="sidebar_alignment">
                <Box className="user_welcome_name">
                  <Typography title={user?.firstName + ' ' + user?.lastName}>
                    Welcome, <span>{user?.firstName + ' ' + user?.lastName}</span>
                  </Typography>
                </Box>
                <Box className="user_profile_head_pic" onClick={handleClick}>
                  <Box className="profile_pic_block" style={user?.profileImage?.small ? { background: `url('${user?.profileImage?.small}')` } : {}}></Box>
                </Box>
              </Stack>
            </Box>

            <Box className="swipeable-right-drawer user-profile-menu" style={{ display: open ? 'block' : 'none' }}>
              <Box maxWidth="400px" width="300px" height="135px" display="flex" flexDirection="column">
                <Box id="basic-menu">
                  <MenuItem>
                    <Stack direction="row" justifyContent="space-between" align-items="center" className="dashboard_dropdown" onClick={settingHandler}>
                      <Stack direction="row">Profile Settings</Stack>
                      <Stack direction="row">
                        <IconButton aria-label="Example" className="logout-sidebar-btn">
                          <img src={gear} alt="Imprimis RX A Harrow Company" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </MenuItem>
                  <MenuItem>
                    <Stack direction="row" justifyContent="space-between" align-items="center" className="dashboard_dropdown" onClick={logoutHandler}>
                      <Stack direction="row">Sign Out</Stack>
                      <Stack direction="row">
                        <IconButton aria-label="Example" className="logout-sidebar-btn">
                          <img src={logout} alt="Imprimis RX A Harrow Company" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </MenuItem>
                </Box>
                <div className="arrow_icon">
                  <img src={Uparrow} height={22} width={22} alt="logo" />
                </div>
              </Box>
            </Box>
          </Stack>
        </Container>
      </AppBar>

      {openSidebar && (
        <Box className="swipeable-right-drawer" overflow="clip">
          <SwipeableTemporaryDrawer open={openSidebar} onClose={handleClose} onOpen={() => {}}>
            <Box maxWidth="400px" width="300px" height="100%" className="sidebar-drawer-wrap" display="flex" flexDirection="column">
              <IconButton aria-label="Example" onClick={handleClose} className="close-sidebar-btn">
                <img src={chevronright} alt="Imprimis RX A Harrow Company" />
              </IconButton>
              <List className="sidebar-drawer-list">
                {/* <ListItem>
                  <ListItemButton>
                    <ListItemText>My Favorites</ListItemText>
                    <ListItemIcon>
                      <img src={starfill} alt="Imprimis RX A Harrow Company" />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <ListItemText>View Cart</ListItemText>
                    <ListItemIcon className="cart-header-rx">
                      <img src={cartIconRX} alt="Imprimis RX A Harrow Company" /> <span>0</span>
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton>
                    <ListItemText>Profile Settings</ListItemText>
                    <ListItemIcon>
                      <img src={gear} alt="Imprimis RX A Harrow Company" />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem> */}
                <Box className="addon_small_screen">
                  <ul>
                    <ListItem>
                      <ListItemButton className="sidebar_btn">
                        <NavLink to="/home/dashboard" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                          <ListItemText>Dashboard</ListItemText>
                          {/* <ListItemIcon>
                            <img src={gear} alt="Imprimis RX A Harrow Company" />
                          </ListItemIcon> */}
                        </NavLink>
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton className="sidebar_btn">
                        <NavLink to="/home/patient" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                          <ListItemText>patients</ListItemText>
                          {/* <ListItemIcon>
                            <img src={gear} alt="Imprimis RX A Harrow Company" />
                          </ListItemIcon> */}
                        </NavLink>
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton className="sidebar_btn">
                        <NavLink to="/home/prescriptions" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                          <ListItemText>prescriptions</ListItemText>
                          {/* <ListItemIcon>
                            <img src={gear} alt="Imprimis RX A Harrow Company" />
                          </ListItemIcon> */}
                        </NavLink>
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton className="sidebar_btn">
                        <NavLink to="/home/settings" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                          <ListItemText>settings</ListItemText>
                          {/* <ListItemIcon>
                            <img src={gear} alt="Imprimis RX A Harrow Company" />
                          </ListItemIcon> */}
                        </NavLink>
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton className="sidebar_btn">
                        <NavLink to="/home/product" className={({ isActive }) => (isActive ? 'active && navbar-link' : 'navbar-link ')}>
                          <ListItemText>product catalog</ListItemText>
                          {/* <ListItemIcon>
                            <img src={gear} alt="Imprimis RX A Harrow Company" />
                          </ListItemIcon> */}
                        </NavLink>
                      </ListItemButton>
                    </ListItem>
                  </ul>
                </Box>
              </List>
              <Stack direction="row" alignItems="center" className="sidebar-profile-block">
                {/* <IconButton aria-label="Example" onClick={logoutHandler} className="logout-sidebar-btn">
                  <img src={logout} alt="Imprimis RX A Harrow Company" />
                </IconButton> */}

                <Box className="sidebar-profile-details" flex="1">
                  <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <Box className="sidebar-profile-desc" textAlign="right">
                      <Typography variant="h5" component="h5">
                        {user?.firstName + ' ' + user?.lastName}
                      </Typography>
                      <Typography>{user?.email}</Typography>
                    </Box>
                    <Box className="user_profile_head_pic">
                      <Box className="profile_pic_block" style={user?.profileImage?.small ? { background: `url(${user?.profileImage?.small})` } : {}}></Box>
                    </Box>
                  </Stack>
                      <Stack className="dashboard_dropdown textColor logoutBtn"   onClick={logoutHandler} >Sign Out</Stack>
                </Box>
              </Stack>
                {/* <Box> */}
                {/* </Box> */}
            </Box>
          </SwipeableTemporaryDrawer>
        </Box>
      )}
    </>
  );
};

export default Header;
