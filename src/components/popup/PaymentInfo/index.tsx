import { Box, Container, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { DialogTitleProps } from "../../../interfaces/DialogTitleProps";
import Home from "../../../assets/icons/shipping_home.svg";
import { useState } from "react";

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export const PaymentInfo = (props: { handleClose: () => void }) => {
  const [data, setData] = useState({
    medication: "",
    quantity: "",
    supply: "",
    refills: "",
    doseInstruction: "",
    medicalNecessity: "",
    comments: "",
  });

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleClose}></BootstrapDialogTitle>
      <DialogContent dividers className="popup_content">
        <Box component="main" className="card-info">
          <Container maxWidth="lg">
            <Box className="main-box" mt={4}>
              <Box sx={{ bgcolor: "background.paper" }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center" mt={3}>
                  <Typography className="heading_bottom_without_border">
                    <span className="profile_icon">
                      <img src={Home} alt="Imprimis RX A Harrow Company" width={16} />
                    </span>
                    Payment Info
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Container>
        </Box>
      </DialogContent >
    </>
  );
};
