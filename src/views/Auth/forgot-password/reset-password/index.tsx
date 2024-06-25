import { Box, Container, Typography } from "@mui/material";
import { FieldControl, FieldGroup } from "react-reactive-form";
import { useEffect, useState } from "react";

import Back from "../../../../assets/icons/Arrow_back.svg";
import Bottom from "../../../../assets/icons/side-bottom.svg";
import ChatFloatingIcon from "../../../../components/chat-floating-icon";
import InputPassword from "../../../../core/forms/inputs/InputPassword";
import Key from "../../../../assets/icons/forgot_key.svg";
import PrimaryButton from "../../../../core/buttons/primary-button";
import RestPassword from "../../../../services/auth/resetPassword.service";
import Top from "../../../../assets/icons/side-top.svg";

export default function ResetPasswordPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // const { token } = router.query;
  const token  = '';

  const reset = new RestPassword();

  useEffect(() => {
    reset.changePasswordForm.patchValue({
      token: token,
    });
    setIsLoaded(true);
  }, [reset.changePasswordForm]);

  const passwordChangeHandler = () => {
    reset.resetPasswordHandler();
  };

  return (
   <>
   {
     isLoaded && (
      <Box className="page forgot_page set_nwe_password d-vh-center">
        <Container maxWidth="sm">
          <Box className="forgot_main">
            <div className="logo">
              <span className="logo_img">
                <img src={Key} alt="logo" height={30} width={30} />
              </span>
            </div>
            <Typography component="h1">Set new password</Typography>
            <Typography component="p">
              Your new password must be different to
              <br></br>
              previously used passwords.
            </Typography>

            <Box className="form_box">
              <FieldGroup
                control={reset.changePasswordForm}
                render={({ get, invalid }) => (
                  <form>
                    <FieldControl name="password" render={InputPassword} meta={{ label: "Password" }} />
                    <Typography className="hint">Must be at least 8 characters.</Typography>

                    <Box mt={2}>
                      <FieldControl name="confirm_password" render={InputPassword} meta={{ label: "Confirm" }} />
                    </Box>

                    <Box mt={3}>
                      <PrimaryButton label={"Reset password"} onClick={passwordChangeHandler} />
                    </Box>
                  </form>
                )}
              />

              <a href="/forgot-password">
                <div className="back">
                  <span>
                    <img src={Back} alt="logo" height={10} width={30} />
                  </span>
                  Back to log in
                </div>
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
    )
   }
   </>
  );
}
