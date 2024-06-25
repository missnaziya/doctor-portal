import { Box, Button, Container, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import { FieldControl, FieldGroup } from "react-reactive-form";

import CloseIcon from "@mui/icons-material/Close";
import { DialogTitleProps } from "../../../interfaces/DialogTitleProps";
import { InputSelect } from "../../../core/forms/inputs/InputSelect";
import { InputText } from "../../../core/forms/inputs/InputText";
import { notificationOptions } from "../../../services/components/selectOptions.service";

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

export const AddPescription = (props: { handleClose: () => void }) => {
  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleClose}></BootstrapDialogTitle>
      <DialogContent dividers className="popup_content">
        <Box component="main" className="pupup-info">
          <Container maxWidth="lg">
            <Box className="main-box">
              <Box sx={{ bgcolor: "background.paper" }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center">
                  <Typography className="heading_bottom_without_border">Add Pescription</Typography>
                </Stack>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack className="inputs_fields_ratio" direction="row">
                        <FieldControl name="gender" render={InputSelect} meta={{ name: "gender", value: "gender", options: notificationOptions, label: "Medication", placeholder: "Please Enter Medication" }} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack className="inputs_fields_ratio" direction="row">
                        <Grid xs={12} sm={12} md={12} lg={6}>
                          <FieldControl name="gender" render={InputSelect} meta={{ name: "gender", value: "gender", options: notificationOptions, label: "Quantity", placeholder: "Please Enter Quantity" }} />
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={6}>
                          <FieldControl name="gender" render={InputSelect} meta={{ name: "gender", value: "gender", options: notificationOptions, label: "Day Supply (Edit As Needed)", placeholder: "Please Enter Day Supply (Edit As Needed)" }} />
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack className="inputs_fields_ratio" direction="row">
                        <Grid xs={12} sm={12} md={12} lg={6}>
                          <FieldControl name="gender" render={InputSelect} meta={{ name: "gender", value: "gender", options: notificationOptions, label: "Refills", placeholder: "Please Enter Refills" }} />
                        </Grid>
                        <Grid xs={12} sm={12} md={12} lg={6}>
                          <FieldControl name="gender" render={InputSelect} meta={{ name: "gender", value: "gender", options: notificationOptions, label: "Choose Dosing Instructions", placeholder: "Please Enter Choose Dosing Instructions" }} />
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack className="inputs_fields_ratio" direction="row">
                        <Grid xs={12}>
                          <FieldControl name="gender" render={InputSelect} meta={{ name: "gender", value: "gender", options: notificationOptions, label: "Choose Medical Necessity", placeholder: "Please Enter Choose Medical Necessity" }} />
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack className="inputs_fields_ratio" direction="row">
                        <Grid xs={12}>
                          <FieldGroup
                            render={({ get, invalid }) => (
                              <form>
                                <FieldControl name="firstName" render={InputText} meta={{ label: "-zAllergies", placeholder: "Please Enter -zAllergies" }} />
                              </form>
                            )}
                          />
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Stack className="add_btnouter" direction="row" justifyContent="center" alignItems="center">
                        <Box className="add_outerbtnscancel" onClick={props.handleClose}>
                          <Button
                            className="add_cancel_btn"
                            variant="outlined"
                            style={{
                              color: "#00ACBA",
                              fontSize: "16px",
                              fontWeight: "600",
                              backgroundColor: "#fff",
                              border: "1px solid #00ACBA",
                              borderRadius: "8px",
                              boxShadow: "none",
                              textTransform: "capitalize",
                              justifyContent: "center",
                              display: "flex",
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                        <Box className="add_outerbtns">
                          <Button
                            className="cancel_btn"
                            variant="contained"
                            style={{
                              color: "#FFFFFF",
                              fontSize: "16px",
                              fontWeight: "600",
                              backgroundColor: "#00ACBA",
                              border: "1px solid #00ACBA",
                              borderRadius: "8px",
                              boxShadow: "none",
                              textTransform: "capitalize",
                            }}
                          >
                            Add Medication
                          </Button>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </DialogContent>
    </>
  );
};
