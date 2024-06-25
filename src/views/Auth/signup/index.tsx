import { AppBar, Box, Container, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { TabPanel, tabProps } from '../../../components/tabs';

import ChatFloatingIcon from '../../../components/chat-floating-icon';
import Logo from '../../../assets/icons/logo.svg';
import PhysicianForm from '../../../pages/signup/physician-form';
import React from 'react';
import StaffForm from '../../../pages/signup/staff-form';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0); // set default tab to 0

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const router = useNavigate();

  // redirect the user to login page
  const gotoLogin = () => {
    router('/');
  };

  return (
    <Stack component="main" className="default-layout signup-page">
      <Container maxWidth="xl">
        <Box className="head">
          <Box className="logo">
            <img src={Logo} alt="" width={150} onClick={gotoLogin} />
          </Box>
          <Typography className="menu">Contact Us</Typography>
        </Box>

        <Stack className="heading" direction="row" justifyContent="center" alignItems="center" flexDirection="column">
          {/* Sign Up */}
          <p></p>
        </Stack>
      </Container>

      <Container maxWidth="lg">
        <Box className="main-box">
          <Box sx={{ bgcolor: 'background.paper' }}>
            <AppBar position="static" className="tabs-bar">
              <Tabs value={value} onChange={handleChange} style={{ background: '#ffffff' }} indicatorColor="primary" textColor="inherit" variant="fullWidth">
                <Tab className="tab-btn" label="For Prescribing Physician" {...tabProps(0)} />
                <Tab className="tab-btn" label="For Office Staff Member" {...tabProps(1)} />
              </Tabs>
            </AppBar>

            <TabPanel value={value} index={0} dir={theme.direction}>
              <PhysicianForm />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <StaffForm />
            </TabPanel>
          </Box>
        </Box>
      </Container>

      <ChatFloatingIcon />
    </Stack>
  );
}
