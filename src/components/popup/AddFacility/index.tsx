import { AddNewFacilityForm, AddNewFacilityFormHandler } from '../../../services/pages/popup-form/AddNewFacilityForm.service';
import { Box, Container, DialogContent, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { cityOptions, stateOptions } from '../../../services/components/selectOptions.service';
import { GoogleAutoCompleteInput } from '../../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../../core/forms/inputs/InputAddress';

import { CheckInput } from '../../../core/forms/inputs/CheckInput';
import { InputEmail } from '../../../core/forms/InputEmail';
import { InputNumber } from '../../../core/forms/inputs/InputNumber';
import { InputText } from '../../../core/forms/inputs/InputText';
import { InputTextCC } from '../../../core/forms/InputTextCC';
import { InputExpiryDate } from '../../../core/forms/InputExpiryDate';
import { InputCvv } from '../../../core/forms/InputCvv';
import { InputZipCode } from '../../../core/forms/inputs/InputZipCode';
import PrimaryButton from '../../../core/buttons/primary-button';
import TertiaryButton from '../../../core/buttons/tertiary-button';
import { useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { InputPhone } from '../../../core/forms/inputs/InputPhone';
import { useAppDispatch } from '../../../store';
import { settingsActions } from '../../../store/Actions';

export const AddFacility = (props: { handleClose: (res: number | boolean) => void }) => {
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const userData = useAppSelector((state) => state.profileReducer.user);
  const facilities: any = useAppSelector((state) => state.settingReducer.facilities);

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    AddNewFacilityForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

  const handleAddNewFacility = async () => {
    const res = await AddNewFacilityFormHandler(router, props, userData);
    if (typeof res === 'number') {
      if (res) {
        dispatch(settingsActions.setCurrentFacility({ data: facilities?.length }));
      }
      closeForm(res);
    }
  };

  const closeForm = (res: number | boolean) => {
    AddNewFacilityForm.reset();
    props.handleClose(res);
  };

  return (
    <>
      <DialogContent dividers className="popup_content">
        <Box component="main" className="card-info">
          <Container maxWidth="lg">
            <Box className="main-box">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center" pt={3}>
                  <Typography className="heading_bottom_without_border">Add New Facility</Typography>
                </Stack>
                <Box>
                  <FieldGroup
                    control={AddNewFacilityForm}
                    render={({ get, invalid }) => {
                      return (
                        <form>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="firstName" render={InputText} meta={{ name: 'firstName', value: 'firstName', helperText: 'Name is required', label: 'Name', placeholder: 'Please Enter Name' }} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', helperText: 'Phone Number is required', label: 'Phone', placeholder: 'Please Enter Phone Number' }} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} mb={2}>
                              <FieldControl name="fax" render={InputPhone} meta={{ name: 'fax', value: 'fax', helperText: 'Fax is required', label: 'Fax', placeholder: 'Please Enter Fax' }} />
                            </Grid>

                            <Grid item xs={12} lg={12}>
                              <Box>
                                <Typography variant="h6">Address</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
                              <GoogleAutoCompleteInput uniqueKey={'doctor-auto-complete1'} handleAutoCompleteChange={handleAutoCompleteChange} type="addFacility" required={true} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', label: 'Address 2', helperText: 'Address 2 is required', placeholder: 'Please Enter Address 2', required: false }} />
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

                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Box>
                                <Typography variant="h6">Add Credit Card</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="cardholderName" render={InputText} meta={{ name: 'cardholderName', value: 'cardholderName', label: 'Cardholder Name', placeholder: 'Please Enter Cardholder Name' }} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="cardNumber" render={InputTextCC} meta={{ name: 'cardNumber', value: 'cardNumber', label: 'Card Number', placeholder: 'Please Enter Card Number' }} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="expiry" render={InputExpiryDate} meta={{ name: 'expiry', value: 'expiry', label: 'Expiry Date', placeholder: 'Please Enter Expiry Date' }} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="cvv" render={InputCvv} meta={{ name: 'cvv', value: 'cvv', label: 'CVC/CVV', placeholder: 'Please Enter CVC/CVV' }} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl name="zip_code" render={InputZipCode} meta={{ name: 'zip_code', value: 'zip_code', label: 'Billing Zip Code', placeholder: 'Please Enter Billing Zip Code', helperText: 'Zip Code is Required' }} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} mt={3}>
                              <Stack className="add_btnouter" direction="row" justifyContent="center" alignItems="center" gap={1.5}>
                                <Box className="add_outerbtnscancel">
                                  <TertiaryButton label={'Cancel'} onClick={() => closeForm(false)} />
                                </Box>
                                <Box className="add_outerbtns">
                                  <PrimaryButton label={'Add Facility'} onClick={() => handleAddNewFacility()} />
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
