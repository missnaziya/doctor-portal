import { Box, Container, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, FormControlLabel } from '@mui/material';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { GET_ALLERGIES, NEW_PATIENT, ADD_NEW_CARD } from '../../../constants/Endpoints';
import { RootState, useAppSelector } from '../../../store';
import { cityOptions, genderOptions, stateOptions } from '../../../services/components/selectOptions.service';
import { useEffect, useState } from 'react';

import { AxiosResponse } from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { CreateNewPatientForm } from '../../../services/pages/popup-form/CreateNewPatientForm.service';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';
import Doctor from '../../../constants/grx-api';
import { GoogleAutoCompleteInput } from '../../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../../core/forms/inputs/InputAddress';
import { InputCvv } from '../../../core/forms/InputCvv';
import { InputDate } from '../../../core/forms/inputDate';
import { InputEmail } from '../../../core/forms/InputEmail';
import { CheckInput } from '../../../core/forms/inputs/CheckInput';
import { InputExpiryDate } from '../../../core/forms/InputExpiryDate';
import { InputMultiSelect } from '../../../core/forms/inputs/InputMultiSelect';
import { InputPhone } from '../../../core/forms/inputs/InputPhone';
import { InputSelect } from '../../../core/forms/inputs/InputSelect';
import { InputText } from '../../../core/forms/inputs/InputText';
import { InputTextCC } from '../../../core/forms/InputTextCC';
import PrimaryButton from '../../../core/buttons/primary-button';
import { RadioInput } from '../../../core/forms/inputs/RadioInput';
import SecondaryButton from '../../../core/buttons/secondary-button';
import { toast } from 'react-toastify';
import { FreesoloInputMultiSelect } from '../../../core/forms/inputs/FreesoloInputMultiSelect';

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

export const PrescriptionAddNewPatient = (props: { handleClose: (res: boolean, patId?: string, blockIndex?: number) => void; mdId?: string; blockIndex?: number }) => {
  const user = useAppSelector((state: RootState) => state.profileReducer.user);
  const [allergyOptions, setAllergyOptions] = useState([]);
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
    CreateNewPatientForm.reset();
    CreateNewPatientForm.patchValue({
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      email: '',
      phone: '',
      blueViewNetwork: '',
      isAllergies: 'true',
      allergies: '',
      cMedications: '',
      pCondition: '',
      street: '',
      apt_suite: '',
      city: '',
      state: '',
      code: '',
      isPaymentMethod: 'true',
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      zip_code: '',
      country: 'US'
    });
  }, []);

  const onSelectAllergies = (data: { value: string }[]) => {
    const value = data.map((item) => item).join();
    CreateNewPatientForm.patchValue({
      allergies: value
    });
  };

  const createPatientHandler = async () => {
    try {
      const controls = CreateNewPatientForm.controls;
      controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.gender.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.dob.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.blueViewNetwork.markAsTouched({ emitEvent: true, onlySelf: true });

      controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.code.markAsTouched({ emitEvent: true, onlySelf: true });

      controls.cardholderName.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.cardNumber.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.expiry.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.cvv.markAsTouched({ emitEvent: true, onlySelf: true });
      controls.zip_code.markAsTouched({ emitEvent: true, onlySelf: true });

      controls.allergies.markAsTouched({ emitEvent: true, onlySelf: true });

      if (controls.firstName.invalid || controls.lastName.invalid || controls.gender.invalid || controls.dob.invalid || controls.email.invalid || controls.phone.invalid || controls.blueViewNetwork.invalid) {
        return;
      }

      if (controls.street.invalid || controls.apt_suite.invalid || controls.city.invalid || controls.state.invalid || controls.code.invalid) {
        return;
      }

      // eslint-disable-next-line eqeqeq
      if (controls.isAllergies.value == 'true' && controls.allergies.invalid) {
        return;
      }

      // eslint-disable-next-line eqeqeq
      if (controls.isPaymentMethod.value == 'true' && (controls.cardholderName.invalid || controls.cardNumber.invalid || controls.expiry.invalid || controls.cvv.invalid || controls.zip_code.invalid)) {
        return;
      }

      const mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;

      let data = {
        md_id: user?.type === 'Staff' ? props?.mdId : user?.mdId,
        first_name: CreateNewPatientForm.value.firstName,
        last_name: CreateNewPatientForm.value.lastName,
        gender: CreateNewPatientForm.value.gender,
        dob: CreateNewPatientForm.value.dob,
        email: CreateNewPatientForm.value.email !== '' && CreateNewPatientForm.value.email !== null ? CreateNewPatientForm.value.email : '',
        mobile: CreateNewPatientForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
        blueViewNetwork: CreateNewPatientForm?.value?.blueViewNetwork !== '' ? CreateNewPatientForm?.value?.blueViewNetwork : false,
        isAllergies: CreateNewPatientForm.value.allergies,
        allergies: CreateNewPatientForm?.value?.allergies ? CreateNewPatientForm?.value?.allergies.split(',') : ['No Known Allergies'],
        cMedications: CreateNewPatientForm.value.cMedications,
        pCondition: CreateNewPatientForm.value.pCondition,
        street: CreateNewPatientForm.value.street,
        apt_suite: CreateNewPatientForm.value.apt_suite !== '' ? CreateNewPatientForm.value.apt_suite : '',
        city: CreateNewPatientForm.value.city,
        state: CreateNewPatientForm.value.state,
        code: CreateNewPatientForm.value.code,
        country: CreateNewPatientForm.value.country,
        paymentMethod: CreateNewPatientForm.value.isPaymentMethod,
        cardholderName: CreateNewPatientForm.value.cardholderName,
        cardNumber: Number(CreateNewPatientForm.value.cardNumber.replaceAll('-', '')),
        expiry: CreateNewPatientForm.value.expiry,
        cvv: CreateNewPatientForm.value.cvv.replaceAll('_', ''),
        zip_code: CreateNewPatientForm.value.zip_code,
        user: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
      };

      let cardData = {
        pat_id: '',
        default: true,
        number: CreateNewPatientForm?.value?.cardNumber?.replace(/\s/g, ''),
        cvc: CreateNewPatientForm?.value?.cvv.replaceAll('_', ''),
        expirationMonth: CreateNewPatientForm?.value?.expiry.split('/')[0],
        expirationYear: `20${CreateNewPatientForm?.value?.expiry.split('/')[1]}`,
        billingAddress: {
          address1: CreateNewPatientForm?.value?.street,
          state: CreateNewPatientForm?.value?.state,
          city: CreateNewPatientForm?.value?.city,
          zipCode: CreateNewPatientForm?.value?.zip_code
        },
        address: {
          state: CreateNewPatientForm?.value?.state,
          address1: CreateNewPatientForm?.value?.street,
          city: CreateNewPatientForm?.value?.city,
          zipCode: CreateNewPatientForm?.value?.zip_code,
          country: CreateNewPatientForm?.value?.country
        }
      };

      const res: AxiosResponse = await Doctor.post(NEW_PATIENT, data);
      if (res.data.statusCode === 420) {
        return toast(res.data.message);
      }
      if (res.status === 201 || res.status === 200) {
        toast('Patient created successfully.');
        if (CreateNewPatientForm?.value?.isPaymentMethod === 'true' && Array.isArray(res?.data?.data)) {
          cardData.pat_id = res?.data?.data[0]?.PatID;
          const addCardRes: AxiosResponse = await Doctor.post(ADD_NEW_CARD, cardData);
          if (addCardRes.status === 201) {
            toast('Card added successfully');
          } else {
            toast('Unable to add card');
          }
        }
        CreateNewPatientForm.reset();
        CreateNewPatientForm.patchValue({
          firstName: '',
          lastName: '',
          gender: '',
          dob: '',
          email: '',
          phone: '',
          blueViewNetwork: '',
          isAllergies: 'true',
          allergies: '',
          cMedications: '',
          pCondition: '',
          street: '',
          apt_suite: '',
          city: '',
          state: '',
          code: '',
          isPaymentMethod: 'true',
          cardholderName: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
          zip_code: '',
          country: 'US'
        });
        props.handleClose(true, res?.data?.data[0]?.PatID, props?.blockIndex);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
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

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => props.handleClose(false)}></BootstrapDialogTitle>
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
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="dob" render={InputDate} meta={{ name: 'dob', value: 'dob', label: 'Date of Birth', placeholder: 'Please Enter Date of Birth' }} />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', label: 'Email', placeholder: 'Please Enter email', required: false }} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={6}>
                                  <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', label: 'Mobile Phone Number', placeholder: 'Please Enter Mobile Phone Number' }} />
                                  <Typography component="p">
                                    <span className="paymentText">
                                      <span>*</span> <span>Entering a mobile phone number will allow us to reach the patient directly for payment.</span>
                                    </span>
                                  </Typography>
                                </Grid>

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
                                  <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', helperText: 'Apt./Suite  is required', label: 'Apt./Suite', placeholder: 'Please Enter Apt./Suite' }} />
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
                                    <div className="optionalText">
                                      <span>OPTIONAL. </span>
                                      <div>If you do not enter a payment method, we will contact your patient by phone for payment.</div>
                                    </div>
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
                                      <FieldControl name="zip_code" render={InputText} meta={{ name: 'zip_code', value: 'zip_code', label: 'Billing Zip Code', placeholder: 'Please Enter Billing Zip Code' }} />
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
                                        <SecondaryButton label="Cancel" onClick={() => props.handleClose(false)}></SecondaryButton>
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
