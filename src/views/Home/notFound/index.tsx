import { Box, Container, Typography } from '@mui/material';

import Back from '../../../assets/icons/Arrow_back.svg';
import Bottom from '../../../assets/icons/side-bottom.svg';
import Chacked from '../../../assets/icons/chacked.svg';
import ChatFloatingIcon from '../../../components/chat-floating-icon';
import PrimaryButton from '../../../core/buttons/primary-button';
import Top from '../../../assets/icons/side-top.svg';

export default function Index() {
  return (
    <Box className="page forgot_page d-vh-center">
      <Container maxWidth="sm">
        <Box className="forgot_main">
          <Typography component="p">
            Some Error
            <br></br>
          </Typography>
          <Box className="form_box">
            <a href="/">
              <PrimaryButton label={'Go Back To App'} />
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
