import React, { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import Doctor from '../../../constants/grx-api';
import { AUTO_LOGIN, PRESCRIBER_PROFILE_GET } from '../../../constants/Endpoints';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useAppDispatch } from '../../../store';
import { profileActions } from '../../../store/Actions';
import { User } from '../../../models/User';
import DoctorWithoutToken from '../../../constants/grx-api-tokenless';

export default function Index() {
  const [message, setMessage] = useState<string>('');
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logInuser = async (token: string) => {
    sessionStorage.clear();
    localStorage.clear();
    try {
      const res: AxiosResponse = await DoctorWithoutToken.post(`${AUTO_LOGIN}/${token}`);
      if (res?.status === 201 && res?.data) {
        sessionStorage.setItem('isSessionOngoing', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionToken', res?.data?.token);
        localStorage.setItem('refreshToken', res?.data?.refreshToken);
        if (res?.data?.type === 'Staff') {
          const response: AxiosResponse = await DoctorWithoutToken.get(PRESCRIBER_PROFILE_GET, { headers: { Authorization: `Bearer ${res?.data?.token}` } });
          if (response.status === 200 && Array.isArray(response?.data) && response?.data?.length > 0) {
            dispatch(profileActions.setUserData({ user: User.create({ ...res?.data?.account, type: res?.data?.type, activePrescriber: response?.data[0] }, true) as User }));
            setMessage('Success');
            navigate('/home');
          }
          //  if user is a prescriber
        } else if (res?.data?.type === 'Doctor') {
          sessionStorage.setItem('isSessionOngoing', 'true');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('login_username');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('sessionToken', res?.data?.token);
          localStorage.setItem('refreshToken', res?.data?.refreshToken);
          const account = res?.data?.account;
          const user = User.create({ ...account, type: res?.data?.type }, true);
          dispatch(profileActions.setUserData({ user: user as User }));
          setMessage('Success');
          navigate('/home');
        }
      }
    } catch (error: any) {
      setMessage('Redirecting to login page...!!');
      if (error?.response?.data?.message) {
        sessionStorage.clear();
        localStorage.clear();
        toast(error?.response?.data?.message);
        navigate('/');
      }
    }
  };

  // http://localhost:3000/auto-login/eyJhbGciOiJIUzI1NiJ9.eyJJZCI6IjAwNTdkMDAwMDA3Q2VMVSJ9.M5BccX80QtOln8mdAI0WfOtYnnJS3AG0bHARp0Xq0-E
  useEffect(() => {
    if (token) {
      setMessage('Logging In...!!');
      logInuser(token);
    } else {
      setMessage('');
      navigate('/');
    }
  }, []);

  return (
    <>
      <Box className="page d-vh-center">
        <Typography> {message} </Typography>
      </Box>
    </>
  );
}
