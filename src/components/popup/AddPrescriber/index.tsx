import { AddNewPrescriberFormHandler, addNewPrescriberForm } from '../../../services/pages/popup-form/AddNewPrescriberForm.service';
import { Box, Container, DialogContent, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { cityOptions, stateOptions } from '../../../services/components/selectOptions.service';
import { GoogleAutoCompleteInput } from '../../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../../core/forms/inputs/InputAddress';

import { CheckInput } from '../../../core/forms/inputs/CheckInput';
import { InputEmail } from '../../../core/forms/InputEmail';
import { InputNumber } from '../../../core/forms/inputs/InputNumber';
import { InputText } from '../../../core/forms/inputs/InputText';
import PrimaryButton from '../../../core/buttons/primary-button';
import TertiaryButton from '../../../core/buttons/tertiary-button';
import { useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { InputPhone } from '../../../core/forms/inputs/InputPhone';

export const AddPrescriber = (props: { handleClose: () => void }) => {
  const router = useNavigate();
  const userData = useAppSelector((state) => state.profileReducer.user);

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    addNewPrescriberForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

  const handleAddNewPrescriber = () => {
    AddNewPrescriberFormHandler(router, props, userData);
  };

  const closeForm = () => {
    addNewPrescriberForm.reset();
    props.handleClose();
  };

  return (
    <>
      <DialogContent dividers className="popup_content">
        <Box component="main" className="card-info">
          <Container maxWidth="lg">
            <Box className="main-box">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center" pt={3}>
                  <Typography className="heading_bottom_without_border">Add New Prescriber</Typography>
                </Stack>
                <Box>
                  <FieldGroup
                    control={addNewPrescriberForm}
                    render={({ get, invalid }) => {
                      return (
                        <form>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="firstName" render={InputText} meta={{ name: 'firstName', value: 'firstName', helperText: 'Prescriber First Name is required', label: 'Prescriber First Name', placeholder: 'Please Enter Prescriber First Name' }} />
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="lastName" render={InputText} meta={{ name: 'lastName', value: 'lastName', helperText: 'Prescriber Last Name is required', label: 'Prescriber Last Name', placeholder: 'Please Enter Prescriber Last Name' }} />
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', helperText: 'Prescriber Phone Number is required', label: 'Prescriber Phone', placeholder: 'Please Enter Phone Number' }} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', helperText: 'Prescriber Email is required.', label: 'Prescriber Email', placeholder: 'Please Enter Email', required: false }} />
                            </Grid>

                            {get('donot_npi')?.value && (
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FieldControl name="npi" render={InputText} meta={{ name: 'npi', value: 'npi', helperText: 'Npi is required', label: 'NPI', placeholder: 'Please Enter NPI', required: false }} />
                              </Grid>
                            )}

                            {!get('donot_npi')?.value && (
                              <Grid item xs={12} sm={12} md={6} lg={6}>
                                <FieldControl name="npi" render={InputText} meta={{ name: 'npi', value: 'npi', helperText: 'Npi is required', label: 'NPI', placeholder: 'Please Enter NPI' }} />
                              </Grid>
                            )}

                            {/* <Grid item xs={12} sm={12} md={4} lg={4}>
                            <Stack direction={"row"} gap={2} mt={2} mb={2}>
                              <FormControlLabel sx={{ margin: 0 }} className="check-input-with-label" control={<FieldControl name="donot_npi" render={CheckInput} />} label="I do not have a NPI" />
                            </Stack>
                          </Grid> */}

                            <Grid item xs={12} lg={4}>
                              <Typography variant="h6">Shipping Address</Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
                              <GoogleAutoCompleteInput uniqueKey={'doctor-auto-complete'} handleAutoCompleteChange={handleAutoCompleteChange} required={true} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', label: 'Apt./Suite', placeholder: 'Please Enter Apt./Suite', required: false }} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="city" render={InputAddress} meta={{ name: 'city', options: cityOptions, label: 'City', helperText: 'City is required', placeholder: 'Please Enter City', required: true }} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="state" render={InputAddress} meta={{ name: 'state', options: stateOptions, label: 'State', helperText: 'State is required', placeholder: 'Please Enter State', required: true }} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} mb={2}>
                              <FieldControl name="code" render={InputAddress} meta={{ name: 'code', label: 'Postal Code', helperText: 'Postal Code is required', placeholder: 'Please Enter Postal Code', required: true }} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} mt={3}>
                              <Stack className="add_btnouter" direction="row" justifyContent="center" alignItems="center" gap={1.5}>
                                <Box className="add_outerbtnscancel">
                                  <TertiaryButton label={'Cancel'} onClick={closeForm} />
                                </Box>
                                <Box className="add_outerbtns">
                                  <PrimaryButton label={'Add prescriber'} onClick={() => handleAddNewPrescriber()} />
                                </Box>
                              </Stack>
                            </Grid>
                          </Grid>
                        </form>
                      );
                    }}
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
