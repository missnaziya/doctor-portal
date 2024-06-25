import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

import Back from '../../../assets/icons/Arrow_back.svg';
import Bottom from '../../../assets/icons/side-bottom.svg';
import Chacked from '../../../assets/icons/chacked.svg';
import ChatFloatingIcon from '../../../components/chat-floating-icon';
import PrimaryButton from '../../../core/buttons/primary-button';
import Top from '../../../assets/icons/side-top.svg';
import DoctorWithoutToken from '../../../constants/grx-api-tokenless';
import { EMAIL_VERIFY } from '../../../constants/Endpoints';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EmailVerifyDone() {
  const param = useParams<any>();
  const [message, setMessage] = useState<{ success: string; error: string }>({ success: '', error: '' });
  const [isVerified, setIsVerified] = useState<{ loading: boolean; success: boolean }>({ loading: false, success: false });

  const handleVerifyEmail = async (token: string) => {
    try {
      const res = await DoctorWithoutToken.post(`${EMAIL_VERIFY}?token=${token}`);
      if (res?.status === 201 && res?.data?.success) {
        setMessage({ ...message, success: 'Your email has been successfully verified', error: '' });
        setIsVerified({ ...isVerified, loading: false, success: true });
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setMessage({ ...message, error: error?.response?.data?.message, success: '' });
        setIsVerified({ ...isVerified, loading: false, success: false });
      }
    }
  };

  useEffect(() => {
    const token = Object.values(param)[0];
    if (token !== undefined) {
      setIsVerified({ ...isVerified, loading: true });
      handleVerifyEmail(token);
    }
  }, []);

  return (
    <Box className="page forgot_page d-vh-center">
      <Container maxWidth="sm">
        <Box className="forgot_main">
          {isVerified?.loading ? (
            <Typography> Verifying </Typography>
          ) : isVerified.success ? (
            <Box m={2}>
              <Box className="logo">
                <span className="logo_img">
                  <img src={Chacked} alt="logo" height={30} width={30} />
                </span>
              </Box>
              <Typography component="h1">Email Verified</Typography>
              <Typography component="p">
                {message?.success}
                <br></br>
              </Typography>
              <Box className="form_box">
                <a href="/">
                  <PrimaryButton label={'Login'} />
                </a>
              </Box>
            </Box>
          ) : (
            <Box m={2}>
              <Box className="form_box">
                <Typography component="p">
                  {message?.error}
                  <br></br>
                </Typography>
                <Box m={2}>
                  <a href="/">
                    <PrimaryButton label={'Login'} />
                  </a>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <ChatFloatingIcon />
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
