import React, { useState } from 'react';
import { Box, Container, FormControlLabel, Stack, Typography } from '@mui/material';
import { FieldControl, FieldGroup } from 'react-reactive-form';

import AuthService from '../../services/auth/login.service';
import BottomImage from '../../assets/icons/side-bottom.svg';
import ChatFloatingIcon from '../../components/chat-floating-icon';
import { CheckInput } from '../../core/forms/inputs/CheckInput';
import EmailInputIcon from '../../core/forms/inputs/EmailInputIcon';
import LogoImage from '../../assets/icons/logo.svg';
import PasswordInputIcon from '../../core/forms/inputs/PasswordInputIcon';
import PrimaryButton from '../../core/buttons/primary-button';
import ShadowImage from '../../assets/icons/login_shadow.svg';
import TopImage from '../../assets/icons/side-top.svg';
import { User } from '../../models/User';
import { profileActions } from '../../store/Actions';
import { useAppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';
import { PRESCRIBER_PROFILE_GET } from '../../constants/Endpoints';
import Doctor from '../../constants/grx-api';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';

export const LoginPage = () => {
  const navigate = useNavigate();

  let auth: AuthService;

  const getController = () => {
    auth = new AuthService();
    return auth.loginForm;
  };

  const dispatch = useAppDispatch();

  const submit = async () => {
    // remove session, loginstatus and tokens before making api call
    sessionStorage.removeItem('isSessionOngoing');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('refreshToken');
    // handle login
    let { res, data }: any = await auth.loginHandler();
    // save user info
    if (res?.data && data) {
      // if user type is staff then fetch list of prescribers and save the first prescriber info in the activePrescriber
      if (res?.data?.type === 'Staff') {
        try {
          // api call to fetch prescribers
          const response: AxiosResponse = await DoctorWithoutToken.get(PRESCRIBER_PROFILE_GET, { headers: { Authorization: `Bearer ${res?.data?.token}` } });
          if (response.status === 200 && Array.isArray(response?.data) && response?.data?.length > 0) {
            // set session info
            sessionStorage.setItem('isSessionOngoing', 'true');
            if (data.rememberMe === true) {
              localStorage.setItem('rememberMe', 'true');
              localStorage.setItem('login_username', data?.email);
            } else {
              localStorage.removeItem('rememberMe');
              localStorage.removeItem('login_username');
            }
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('sessionToken', res?.data?.token);
            localStorage.setItem('refreshToken', res?.data?.refreshToken);
            // add user data in localstorage along with active prescriber info
            dispatch(profileActions.setUserData({ user: User.create({ ...res?.data?.account, type: res?.data?.type, activePrescriber: response?.data[0] }, true) as User }));
            // navigate the user to home routes
            navigate('/home');
          }
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toast(error?.response?.data?.message);
          }
        }
      }
      // if user type is doctor, then just save the user info in the local storage
      else if (res?.data?.type === 'Doctor') {
        // set session info
        sessionStorage.setItem('isSessionOngoing', 'true');
        if (data?.rememberMe === true) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('login_username', data?.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('login_username');
        }
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionToken', res?.data?.token);
        localStorage.setItem('refreshToken', res?.data?.refreshToken);
        //  set user info in localstorage
        const account = res?.data?.account;
        const user = User.create({ ...account, type: res?.data?.type }, true);
        dispatch(profileActions.setUserData({ user: user as User }));
        // redirect the user to home routes
        navigate('/home');
      }
    }
  };

  return (
    <>
      <Box className="page login-page d-vh-center">
        <Container maxWidth={false} className="login_outer">
          <Stack direction="column" className="login-card">
            <Box className="logo-box d-vh-center">
              <img src={LogoImage} alt="logo" width={320} />
            </Box>

            <Stack direction="column" className="login-form-box">
              <Stack>
                <Typography className="title">Prescriber Portal</Typography>
              </Stack>
              <Stack>
                <Typography className="subtitle">Access your account to get a prescription online.</Typography>
              </Stack>

              <FieldGroup
                control={getController()}
                render={() => (
                  <form autoComplete="off">
                    <Stack className="form-fields dark">
                      <Box mb={2}>
                        <FieldControl name="email" render={EmailInputIcon} meta={{ label: 'Email', placeholder: 'Please Enter Email' }} />
                      </Box>
                      <Box>
                        <FieldControl name="password" render={PasswordInputIcon} meta={{ label: 'Password', placeholder: 'Please Enter Password', type: 'password' }} />
                      </Box>
                      <Box mt={2} mb={3}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 0 }} justifyContent="start" alignItems="start" className="checkbox_outer">
                          <Box className="dark-checkbox">
                            <FormControlLabel sx={{ margin: 0 }} control={<FieldControl name="rememberMe" render={CheckInput} />} label="Remember me" />
                          </Box>
                          <Box>
                            <a href="/forgot-password" style={{ color: '#fff', textDecoration: 'none' }}>
                              <Typography style={{ cursor: 'pointer' }}>Forgot your Password?</Typography>
                            </a>
                          </Box>
                        </Stack>
                      </Box>
                      <Box className="login-button-outer">
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 0 }} justifyContent="start" className="loginSubmitBtn">
                          <Box className="loginSubmitBtnInfo">
                            <PrimaryButton label={'LOG IN'} onClick={submit} />
                          </Box>
                          <Box className="loginSubmitBtnInfo">
                            <a href="/signup" style={{ textDecoration: 'none' }}>
                              <PrimaryButton label={'REGISTER'} />
                            </a>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </form>
                )}
              />
            </Stack>
            <Stack className="bottom_shadow" direction="row" justifyContent="center">
              <img src={ShadowImage} alt="" width={700} />
            </Stack>
          </Stack>

          <ChatFloatingIcon />
        </Container>

        <Box className="left_top_img">
          <img src={TopImage} alt="" />
        </Box>
        <Box className="right_bottom_img">
          <img src={BottomImage} alt="" />
        </Box>
      </Box>
    </>
  );
};
