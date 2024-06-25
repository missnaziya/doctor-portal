import { Box, Container, Typography } from "@mui/material";
import { FieldControl, FieldGroup } from "react-reactive-form";
import { forgotPasswordHandler, forgotPswForm } from "../../../services/auth/forgotPassword.service";

import Back from "../../../assets/icons/Arrow_back.svg";
import Bottom from "../../../assets/icons/side-bottom.svg";
import ChatFloatingIcon from "../../../components/chat-floating-icon";
import { InputEmail } from "../../../core/forms/InputEmail";
import Key from "../../../assets/icons/forgot_key.svg";
import { MouseEventHandler } from "react";
import PrimaryButton from "../../../core/buttons/primary-button";
import Top from "../../../assets/icons/side-top.svg";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const router = useNavigate();
  const handleForgotPwd: MouseEventHandler<HTMLButtonElement> | undefined = (e) => {
    forgotPasswordHandler(router);
  };
  return (
    <Box className="page forgot_page d-vh-center">
      <Container maxWidth="sm">
        <Box className="forgot_main">
          <div className="logo">
            <span className="logo_img">
              <img src={Key} alt="logo" height={30} width={30} />
            </span>
          </div>
          <Typography component="h1">Forgot password?</Typography>
          <Typography component="p">No worries, we'll send you reset instructions.</Typography>

          <FieldGroup control={forgotPswForm} render={({ get, invalid }) => (
            <form>
              <Box className="form_box forgetInputAlignment">
                <FieldControl name="email" render={InputEmail} meta={{ name: "email", value: "email", helperText: "Email is required.", label: "Email", placeholder: "Please Enter Email" }} />
                <Box mt={2}>
                  <PrimaryButton onClick={handleForgotPwd} label={'Reset password'} />
                </Box>
                <a href="/">
                  <div className="back">
                    <span>
                      <img src={Back} alt="logo" height={10} width={30} />
                    </span>
                    Back to log in
                  </div>
                </a>
              </Box>
            </form>
          )}
          />
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
