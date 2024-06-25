import { Box, Container, Typography } from '@mui/material';

import Back from '../../../assets/icons/Arrow_back.svg';
import Bottom from '../../../assets/icons/side-bottom.svg';
import Chacked from '../../../assets/icons/chacked.svg';
import ChatFloatingIcon from '../../../components/chat-floating-icon';
import PrimaryButton from '../../../core/buttons/primary-button';
import Top from '../../../assets/icons/side-top.svg';
export default function EmailVerify() {
  return (
    <Box className="page forgot_page d-vh-center">
      <Container maxWidth="sm">
        <Box className="forgot_main">
          <Typography component="h1">Verify your email</Typography>
          <Typography component="p">
            We have sent you a mail to verify your email.
            <br></br>
            Click below to send it again.
          </Typography>
          <Box className="form_box">
            <a href="/email-verify/done">
              <PrimaryButton label={'Send Email'} />
            </a>
            <a href="/forgot-password/reset-password">
              <Box className="back">
                <span>
                  <img src={Back} alt="logo" height={10} width={30} />
                </span>
                Back to log in
              </Box>
            </a>
          </Box>
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
