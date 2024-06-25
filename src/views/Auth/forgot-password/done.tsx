import { Box, Container, Link, Typography } from '@mui/material';
import { Dispatch, useEffect } from 'react';

import { AxiosError } from '../../../interfaces/api';
import { AxiosResponse } from 'axios';
import Back from '../../../assets/icons/Arrow_back.svg';
import Bottom from '../../../assets/icons/side-bottom.svg';
import Chat from '../../../assets/icons/chat.svg';
import Email from '../../../assets/icons/email.svg';
import { FORGOT_PASSWORD } from '../../../constants/Endpoints';
import PrimaryButton from '../../../core/buttons/primary-button';
import Top from '../../../assets/icons/side-top.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Doctor from '../../../constants/grx-api';
import DoctorWithoutToken from '../../../constants/grx-api-tokenless';

export default function Index() {
  const [email, setEmail]: [string | null, Dispatch<string | null>] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('forget-email') : null);

  const router = useNavigate();
  // useEffect(() => {
  //   if (email === null) {
  //     router('/forgot-password');
  //   }
  // }, [email, router]);

  const openApp = () => {
    if (email) {
      const linkArr = email.split('@');
      window.open('http://' + linkArr[1], '_blank');
    }
  };

  const resend = async () => {
    try {
      // const res: AxiosResponse = await PhysicianDoctor.post(FORGOT_PASSWORD, {
      //   email
      // });
      const res: AxiosResponse = await DoctorWithoutToken.post(`${FORGOT_PASSWORD}/${email}`);
      // if (res.data.status === 'Error') {
      //   return toast(res.data.message);
      // }
      if (res.status === 201) {
        email && localStorage.setItem('forget-email', email);
        toast('Kindly check your email to reset your password.');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  return (
    <Box className="page forgot_page email_page d-vh-center">
      <Container maxWidth="sm" className="login_out ">
        <Box className="forgot_main">
          <Box className="logo">
            <span className="logo_img">
              <img src={Email} alt="logo" height={30} width={30} />
            </span>
          </Box>
          <Typography component="h1">Check your email</Typography>
          <Typography component="p">
            We sent a password reset link to <br></br>
            {email}
          </Typography>

          <Box className="inpuit_box form_box">
            <PrimaryButton label={'Open email app'} onClick={openApp} />
            <Box className="click_option">
              <Typography component="p">
                Didn't receive the email?{' '}
                <span style={{ cursor: 'pointer' }} onClick={resend}>
                  {' '}
                  Click to resend
                </span>
              </Typography>
            </Box>
            <Link href="/">
              <Box className="back">
                <span>
                  <img src={Back} alt="logo" height={10} width={30} />
                </span>
                Back to log in
              </Box>
            </Link>
          </Box>
        </Box>
        <Box className="chat-floating-icon">
          <img src={Chat} alt="" height={65} width={65} />
        </Box>
      </Container>

      <Box className="left_top_img">
        <img src={Top} alt="" />
      </Box>
      <Box className="right_bottom_img">
        <img src={Bottom} alt="" />
      </Box>
    </Box>
  );
}
