import { Box, Container, Typography } from "@mui/material";

import Back from "../../../../assets/icons/Arrow_back.svg";
import Bottom from "../../../../assets/icons/side-bottom.svg";
import Chacked from "../../../../assets/icons/chacked.svg";
import ChatFloatingIcon from "../../../../components/chat-floating-icon";
import PrimaryButton from "../../../../core/buttons/primary-button";
import Top from "../../../../assets/icons/side-top.svg";

export default function DonePage() {
  return (
    <Box className="page forgot_page d-vh-center">
      <Container maxWidth="sm">
        <Box className="forgot_main">
          <Box className="logo">
            <span className="logo_img">
              <img src={Chacked} alt="logo" height={30} width={30} />
            </span>
          </Box>
          <Typography component="h1">Password reset</Typography>
          <Typography component="p">
            Your password has been successfully reset.
            <br></br>
            Click below to log in magically.
          </Typography>
          <Box className="form_box">
            <a href="/">
              <PrimaryButton label={"Continue"} />
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
