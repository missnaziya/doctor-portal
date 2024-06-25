import { Box, Button, Container, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import { FieldControl, FieldGroup } from "react-reactive-form";
import { cityOptions, stateOptions } from "../../../services/components/selectOptions.service";

import CloseIcon from "@mui/icons-material/Close";
import { DialogTitleProps } from "../../../interfaces/DialogTitleProps";
import Home from "../../../assets/icons/shipping_home.svg";
import { InputSelect } from "../../../core/forms/inputs/InputSelect";
import { InputText } from "../../../core/forms/inputs/InputText";
import { InputTextArea } from "../../../core/forms/inputs/InputTextArea";

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500]}}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export const EditShippingAddress = (props: { handleClose: (e?: React.SyntheticEvent) => void }) => {

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => props.handleClose()}></BootstrapDialogTitle>
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
                    Edit Shipping Address
                  </Typography>
                </Stack>
                <Box>
                  <FieldGroup
                    render={({ get, invalid }) => (
                      <form>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12} lg={12}>
                            <FieldControl name="street" render={InputTextArea} meta={{ name: "street", value: "street", helperText: "Street is required", label: "Street", placeholder: "Please Enter Street" }} />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="apt_suite" render={InputText} meta={{ name: "apt_suite", value: "apt_suite", helperText: "Apt./Suite  is required", label: "Apt./Suite", placeholder: "Please Enter Apt./Suite" }} />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="city" render={InputSelect} meta={{ name: "city", value: "city", options: cityOptions, label: "City", placeholder: "Please Enter City" }} />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="state" render={InputSelect} meta={{ name: "state", value: "state", options: stateOptions, label: "State", placeholder: "Please Enter State" }} />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="code" render={InputText} meta={{ name: "code", value: "code", helperText: "Postal Code is required", label: "Postal Code", placeholder: "Please Enter Postal Code" }} />
                          </Grid>

                          <Grid item xs={12} md={12} lg={12}>
                            <FieldControl name="address" render={InputText} meta={{ name: "address", value: "address", helperText: "Address’ Name is required", label: "Address’ Name", placeholder: "Please Enter Postal Code" }} />
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12} mt={2}>
                            <Stack className="add_btnouter" direction="row" justifyContent="center" alignItems="center" gap={1.5}>
                              <Box className="add_outerbtns">
                                <Button className="cancel_btn" variant="contained" style={{
                                    fontSize: "16px", fontWeight: "600", backgroundColor: "#00ACBA", border: "1px solid #00ACBA", borderRadius: "8px", boxShadow: "none",
                                    textTransform: "capitalize", flex: 1, width: "100%", height: "49px"}}>
                                  Update
                                </Button>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </DialogContent>
    </>
  );
};
