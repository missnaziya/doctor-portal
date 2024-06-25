import { AppBar, Box, Container, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { GET_SPECIALTIES, PRESCRIBER_PROFILE_GET } from '../../../constants/Endpoints';
import React, { useEffect, useState } from 'react';
import { TabPanel, tabProps } from '../../../components/tabs';
import { personalLoginForm, personalUserForm } from '../../../services/pages/settings/personalLoginForm';
import { physicianActions, settingsActions } from '../../../store/Actions';
import { useAppDispatch, useAppSelector } from '../../../store';

import { AxiosResponse } from 'axios';
import Chat from '../../../assets/icons/chat.svg';
import Header from '../../../components/header/header';
import Doctor from '../../../constants/grx-api';
import Prescribe from '../../../assets/icons/prescribe_icon.svg';
import { Prescriber } from './childs/presicriber';
import { User } from '../../../models/User';
import { UserInfo } from './childs/user-info';
import { isLoggedIn } from '../../../services/auth/auth.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Facility } from './childs/facility';
import Footer from '../../../components/footer/footer';

export default function SettingPage() {
  const router = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState(0);
  const userData: User = useAppSelector((state) => state.profileReducer.user);

  const handlePrescribeDetail = () => {
    router('/home/prescribe-now');
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  useEffect(() => {
    if (userData) {
      personalUserForm.patchValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData?.phoneNumber?.areaCode + userData?.phoneNumber?.number,
        email: userData.email,
        doctor_id: userData?.doctorAccountId
      });
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      personalLoginForm.patchValue({
        username: userData.email,
        password: userData.password
      });
    }
  }, [userData]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router('/');
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  return isLoaded ? (
    <>
      <Stack component="main" className="default-layout">
        <Header />
        <Box component="main" className="setting-page" position="relative">
          <Box className="main-content-wrapper-full">
            <Container maxWidth="xl">
              <Box className="main-content-wrap">
                <Box className="main-box settings_main_box">
                  {userData.type === 'Doctor' ? (
                    <Box sx={{ bgcolor: 'background.paper' }}>
                      <Container maxWidth="lg">
                        <Box className="top_tab_out signup_header">
                          <AppBar position="static" className="tabs-bar">
                            <Tabs value={value} onChange={handleChange} style={{ background: '#ffffff' }} indicatorColor="primary" textColor="inherit" variant="fullWidth">
                              <Tab className="tab-btn" label="User Info" {...tabProps(0)} />
                              <Tab className="tab-btn" label="Facility" {...tabProps(1)} />
                            </Tabs>
                          </AppBar>
                        </Box>
                      </Container>
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <UserInfo />
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        <Box>
                          <Facility />
                        </Box>
                      </TabPanel>
                    </Box>
                  ) : (
                    <Box sx={{ bgcolor: 'background.paper' }}>
                      <Container maxWidth="lg">
                        <Box className="top_tab_out signup_header">
                          <AppBar position="static" className="tabs-bar">
                            <Tabs value={value} onChange={handleChange} style={{ background: '#ffffff' }} indicatorColor="primary" textColor="inherit" variant="fullWidth">
                              <Tab className="tab-btn" label="User Info" {...tabProps(0)} />
                              <Tab className="tab-btn" label="Prescribers" {...tabProps(1)} />
                              <Tab className="tab-btn" label="Facility" {...tabProps(2)} />
                            </Tabs>
                          </AppBar>
                        </Box>
                      </Container>
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <UserInfo />
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        <Prescriber />
                      </TabPanel>
                      <TabPanel value={value} index={2} dir={theme.direction}>
                        <Box>
                          <Facility />
                        </Box>
                      </TabPanel>
                    </Box>
                  )}
                </Box>
              </Box>
            </Container>
          </Box>
          <Box className="chat-floating-icon">
            <img src={Chat} alt="logo" height={65} width={65} />
          </Box>
          <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
            <img src={Prescribe} alt="logo" height={100} width={180} />
          </Box>
        </Box>
        <Box className="chat-floating-icon">
          <img src={Chat} alt="logo" height={65} width={65} />
        </Box>
        <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
          <img src={Prescribe} alt="logo" height={100} width={180} />
        </Box>
      </Stack>
      <Footer />
    </>
  ) : (
    <div></div>
  );
}
