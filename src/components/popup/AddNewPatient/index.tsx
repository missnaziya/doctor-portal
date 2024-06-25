import { Box, Container, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Stack, Typography, FormControl, TextField } from '@mui/material';
import { CreateNewPatientForm, CreatePatientHandler } from '../../../services/pages/popup-form/CreateNewPatientForm.service';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { RootState, useAppSelector } from '../../../store';
import { cityOptions, genderOptions, stateOptions } from '../../../services/components/selectOptions.service';
import { useEffect, useState } from 'react';

import { AxiosResponse } from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';
import { GET_ALLERGIES } from '../../../constants/Endpoints';
import { GoogleAutoCompleteInput } from '../../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../../core/forms/inputs/InputAddress';
import { InputCvv } from '../../../core/forms/InputCvv';
import { InputDate } from '../../../core/forms/inputDate';
import { InputEmail } from '../../../core/forms/InputEmail';
import { InputExpiryDate } from '../../../core/forms/InputExpiryDate';
import { InputMultiSelect } from '../../../core/forms/inputs/InputMultiSelect';
import { InputPhone } from '../../../core/forms/inputs/InputPhone';
import { InputSelect } from '../../../core/forms/inputs/InputSelect';
import { InputText } from '../../../core/forms/inputs/InputText';
import { InputTextCC } from '../../../core/forms/InputTextCC';
import { InputZipCode } from '../../../core/forms/inputs/InputZipCode';
import Doctor from '../../../constants/grx-api';
import PrimaryButton from '../../../core/buttons/primary-button';
import { RadioInput } from '../../../core/forms/inputs/RadioInput';
import SecondaryButton from '../../../core/buttons/secondary-button';
import { CheckInput } from '../../../core/forms/inputs/CheckInput';
import { FreesoloInputMultiSelect } from '../../../core/forms/inputs/FreesoloInputMultiSelect';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { Color } from '../../../interfaces/Color';
import moment from 'moment';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}{' '}
      {onClose ? (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export const AddNewPatient = (props: { handleClose: () => void }) => {
  const user = useAppSelector((state: RootState) => state.profileReducer.user);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [birthDate, setBirthDate] = useState<any>('');

  const getAllergies = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(GET_ALLERGIES);
      setAllergyOptions(
        res.data.records.map((item: any) => {
          return { label: item?.Name, value: item?.Name };
        })
      );
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    getAllergies();
  }, []);

  const onSelectAllergies = (data: { value: string }[]) => {
    const value = data.map((item) => item).join();
    CreateNewPatientForm.patchValue({
      allergies: value
    });
  };

  const createPatientHandler = () => {
    CreatePatientHandler(user, props);
  };

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    CreateNewPatientForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

  const handleDatePicker = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
    const getColor = () => {
      if (touched) {
        if (hasError('required' || hasError('pattern'))) {
          return Color.ERROR;
        }
        return Color.SUCCESS;
      }
      return Color.PRIMARY;
    };

    const getError = () => {
      if (typeof meta.required != 'undefined' && meta.required === false) {
        return false;
      }
      if (touched) {
        if (hasError('required') || hasError('pattern')) {
          return true && meta.helperText;
        }
        return false;
      }
      return false;
    };

    const isRequired = () => {
      if (typeof meta.required != 'undefined') {
        return meta.required;
      }
      return true;
    };
    return (
      <FormControl className="form-input" sx={{ width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs(birthDate)}
            onChange={(e: any) => {
              if (e && e.$d && e.$d !== null) {
                setBirthDate(moment(e.$d).format('MM-DD-YYYY'));
                CreateNewPatientForm.patchValue({
                  dob: moment(e.$d).format('YYYY-MM-DD')
                });
              } else {
                setBirthDate('');
                CreateNewPatientForm.patchValue({
                  dob: ''
                });
              }
            }}
            className="centered-text"
            slotProps={{
              textField: {
                helperText: getError(),
                error: getError(),
                required: isRequired(),
                label: meta.label
              }
            }}
          />
        </LocalizationProvider>
      </FormControl>
    );
  };

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleClose}></BootstrapDialogTitle>
      <DialogContent dividers className="create_patient_content">
        {allergyOptions.length > 0 && (
          <FieldGroup
            control={CreateNewPatientForm}
            render={({ get, invalid }) => (
              <form>
                <Box component="main" className="create_patient_info">
                  <Container maxWidth="lg">
                    <Box className="main-box">
                      <Box sx={{ bgcolor: 'background.paper' }}>
                        <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center">
                          <Typography className="heading_bottom">Create New Patient</Typography>
                        </Stack>
                        <Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                              <Typography className="field-info-details-desc">
                                Personal Info
                                <span>Provide your personal info</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={8}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                  <FormControlLabel sx={{ margin: 0 }} className="check-input-with-label" control={<FieldControl name="blueViewNetwork" render={CheckInput} />} label="Blue View Vision Patient" />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="firstName" render={InputText} meta={{ name: 'firstName', value: 'firstName', helperText: 'Patient First Name is required', label: 'Patient First Name', placeholder: 'Please Enter Patient First Name' }} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="lastName" render={InputText} meta={{ name: 'lastName', value: 'lastName', helperText: 'Patient Last Name is required', label: 'Patient Last Name', placeholder: 'Please Enter Patient Last Name' }} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="gender" render={InputSelect} meta={{ name: 'gender', value: 'gender', options: genderOptions, label: 'Gender', placeholder: 'Please Enter Gender' }} />
                                </Grid>
                                {/* <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="dob" render={InputDate} meta={{ name: 'dob', value: 'dob', label: 'Date of Birth', placeholder: 'Please Enter Date of Birth' }} />
                                </Grid> */}
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl
                                    name="dob"
                                    render={handleDatePicker}
                                    meta={{
                                      name: 'dob',
                                      value: 'dob',
                                      label: 'Date of Birth',
                                      placeholder: 'Please Enter Date of Birth',
                                      required: true,
                                      helperText: CreateNewPatientForm.get('dob').errors?.required ? 'Patient Date of Birth is required' : CreateNewPatientForm.get('dob').errors?.pattern ? 'Please enter valid Date of Birth' : ''
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', label: 'Email', placeholder: 'Please Enter email', required: false }} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', label: 'Phone Number', placeholder: 'Please Enter Phone Number' }} />
                                  <Typography component="p">
                                    <span className="paymentText">
                                      <span>*</span> <span>Entering a phone number will allow us to reach the patient directly for payment.</span>
                                    </span>
                                  </Typography>
                                </Grid>

                                {/* <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="memberId" render={InputText} meta={{ name: 'memberId', value: 'memberId', helperText: 'Member Id is required', label: 'Member Id', placeholder: 'Please Enter Member Id', required: false }} />
                                </Grid> */}

                                <Grid item xs={12} sm={12} md={4} lg={4} className="allergies choose_allergies">
                                  <Typography component="p">
                                    Patient allergies? <span>*</span>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={8}>
                                  <FieldControl
                                    name="isAllergies"
                                    render={RadioInput}
                                    meta={{
                                      name: 'isAllergies',
                                      defaultValue: get('isAllergies').value,
                                      options: [
                                        { label: 'Yes', value: 'true' },
                                        { label: 'No', value: 'false' }
                                      ]
                                    }}
                                  />
                                </Grid>

                                {get('isAllergies') && get('isAllergies').value === 'true' && (
                                  <>
                                    <Grid item xs={12} sm={12} md={12} lg={12} pt={0}>
                                      <FieldControl name="allergies" render={FreesoloInputMultiSelect} meta={{ value: 'allergies', name: 'allergies', label: 'Allergies', placeholder: 'Please Enter Allergies', options: allergyOptions, onChange: onSelectAllergies }} />
                                    </Grid>
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Box className="divider-horizontal"></Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                              <Typography className="field-info-details-desc">
                                Patient Address
                                <span>Please provide patient’s address</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={8}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
                                  <GoogleAutoCompleteInput uniqueKey={'newPatient-auto-complete'} handleAutoCompleteChange={handleAutoCompleteChange} required={true} />
                                </Grid>

                                <Grid item xs={12} md={6} lg={6}>
                                  <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', label: 'Apt./Suite', placeholder: 'Please Enter Apt./Suite', required: false }} />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                  <FieldControl name="city" render={InputAddress} meta={{ name: 'city', options: cityOptions, label: 'City', placeholder: 'Please Enter City', required: true }} />
                                </Grid>

                                <Grid item xs={12} md={6} lg={6}>
                                  <FieldControl name="state" render={InputAddress} meta={{ name: 'state', options: stateOptions, label: 'State', placeholder: 'Please Enter State', required: true }} />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                  <FieldControl name="code" render={InputAddress} meta={{ name: 'code', helperText: 'Postal Code is required', label: 'Postal Code', placeholder: 'Please Enter Postal Code', required: true }} />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Box className="divider-horizontal"></Box>
                          <Grid item container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                              <Typography className="field-info-details-desc">
                                Billing Information
                                <span>Please provide patient billing information</span>
                              </Typography>
                            </Grid>
                            <Grid className="billing_info" item xs={12} sm={12} md={12} lg={8}>
                              <Grid item container spacing={2} className="gridTop">
                                <Grid item xs={12} sm={12} md={6} lg={5} pr={4} className="allergies choose_allergies">
                                  <Typography component="p" pr={4}>
                                    Add a payment method? <span>*</span>
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={7}>
                                  <FieldControl
                                    name="isPaymentMethod"
                                    render={RadioInput}
                                    meta={{
                                      name: 'isPaymentMethod',
                                      defaultValue: get('isPaymentMethod').value,
                                      options: [
                                        { label: 'Yes', value: true },
                                        { label: 'No', value: false }
                                      ]
                                    }}
                                  />
                                </Grid>
                                <Stack className="inputs_fields_ratio" direction="row">
                                  <Typography component="h5">
                                    <Box className="optionalText">
                                      <span>OPTIONAL.</span>
                                      <Box sx={{ ml: 0.5 }}> If you do not enter a payment method, we will contact your patient by phone for payment. </Box>
                                    </Box>
                                  </Typography>
                                </Stack>
                                {get('isPaymentMethod') && get('isPaymentMethod').value === 'true' && (
                                  <>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                      <Box className="credit_card">
                                        <Typography>Add Credit Card</Typography>
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
                                  </>
                                )}
                                <Grid item xs={12} sm={12} md={12} lg={12} pl={0}>
                                  <Stack className="mandatory-out" direction="row" mt={3}>
                                    <Box className="mandatory">
                                      <span>*</span> This field is mandatory
                                    </Box>
                                    <Box className="d-vh-between" gap={1} mt={1}>
                                      <Box style={{ width: '160px' }}>
                                        <SecondaryButton label="Cancel" onClick={props.handleClose}></SecondaryButton>
                                      </Box>
                                      <Box style={{ width: '160px' }}>
                                        <PrimaryButton label="Create Patient" onClick={createPatientHandler}></PrimaryButton>
                                      </Box>
                                    </Box>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </form>
            )}
          />
        )}
      </DialogContent>
    </>
  );
};
