import { AddNewShippingAddressFormHandler, addNewShippingAddressForm } from "../../../services/pages/popup-form/AddNewShippingAddressForm.service";
import { Box, Button, Container, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import { FieldControl, FieldGroup } from "react-reactive-form";
import { cityOptions, stateOptions } from "../../../services/components/selectOptions.service";

import CloseIcon from "@mui/icons-material/Close";
import { DialogTitleProps } from "../../../interfaces/DialogTitleProps";
import { GoogleAutoCompleteInput } from "../../../core/forms/inputs/GoogleAutoCompleteInput";
import Home from "../../../assets/icons/shipping_home.svg";
import { InputAddress } from "../../../core/forms/inputs/InputAddress";
import { InputText } from "../../../core/forms/inputs/InputText";
import { useNavigate } from "react-router-dom";

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

export const AddNewAddress = (props: { handleClose: (e?: string) => void }) => {

  const router = useNavigate();

  const handleShippingAddress = (e: React.SyntheticEvent) => {
    AddNewShippingAddressFormHandler(e, router);
  };
  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: 
    { address1: string, locality: string, short_name: string, postcode: string, country: string }) => {
    addNewShippingAddressForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode,
      country: country,
    });
  };

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
                    Add New Shipping Address
                  </Typography>
                </Stack>
                <Box>
                  <FieldGroup
                  control={addNewShippingAddressForm}
                    render={({ get, invalid }) => (
                      <form>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
                            <GoogleAutoCompleteInput uniqueKey={"staff-auto-complete"} handleAutoCompleteChange={handleAutoCompleteChange} />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="apt_suite" render={InputAddress} meta={{ name: "apt_suite", helperText: "Apt./Suite is required", label: "Apt./Suite", placeholder: "Please Enter Apt./Suite" }} />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="city" render={InputAddress} meta={{ name: "city", options: cityOptions, label: "City", placeholder: "Please Enter City" }} />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="state" render={InputAddress} meta={{ name: "state", options: stateOptions, label: "State", placeholder: "Please Enter State" }} />
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            <FieldControl name="code" render={InputAddress} meta={{ name: "code", helperText: "Postal Code is required", label: "Postal Code", placeholder: "Please Enter Postal Code" }} />
                          </Grid>
                  
                          <Grid item xs={12} md={12} lg={12}>
                            <FieldControl name="address" render={InputText} meta={{ name: "address", value: "address", helperText: "Address’ Name is required", label: "Address’ Name", placeholder: "Please Enter Postal Code" }} />
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12} mt={2}>
                            <Stack className="add_btnouter" direction="row" justifyContent="center" alignItems="center" gap={1.5}>
                              <Box className="add_outerbtns">
                                <Button
                                  className="cancel_btn"
                                  variant="contained"
                                  onClick={handleShippingAddress}
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    backgroundColor: "#00ACBA",
                                    border: "1px solid #00ACBA",
                                    borderRadius: "8px",
                                    boxShadow: "none",
                                    textTransform: "capitalize",
                                    flex: 1,
                                    width: "100%",
                                    height: "49px",
                                  }}
                                >
                                  Add New Address
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
