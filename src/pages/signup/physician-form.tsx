import { Box, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { cityOptions, notificationOptions, stateOptions } from '../../services/components/selectOptions.service';
import { physicianSignUpForm, physicianSignUpHandler } from '../../services/auth/register.service';
import { useAppDispatch, useAppSelector } from '../../store';
import axios, { AxiosResponse } from 'axios';
import { CheckInput } from '../../core/forms/inputs/CheckInput';
import { GET_SPECIALTIES } from '../../constants/Endpoints';
import { GoogleAutoCompleteInput } from '../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../core/forms/inputs/InputAddress';
import { InputEmail } from '../../core/forms/InputEmail';
import InputPassword from '../../core/forms/inputs/InputPassword';
import { InputPhone } from '../../core/forms/inputs/InputPhone';
import { InputSelect } from '../../core/forms/inputs/InputSelect';
import { InputText } from '../../core/forms/inputs/InputText';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';
import PrimaryButton from '../../core/buttons/primary-button';
import { Specialty } from '../../interfaces/specialty';
import TertiaryButton from '../../core/buttons/tertiary-button';
import { physicianActions, profileActions } from '../../store/Actions';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { User } from '../../models/User';

export default function Index() {
  const router = useNavigate();
  const dispatch = useAppDispatch();
  const specialties: Specialty = useAppSelector((state) => state.physicanReducer.dropdownData);

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    physicianSignUpForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

  useEffect(() => {
    physicianSignUpForm.reset();
    physicianSignUpForm.patchValue({
      rememberMe: true
    });
    getSpecialties();
  }, []);

  const getSpecialties = async () => {
    try {
      const res: AxiosResponse = await DoctorWithoutToken.get(GET_SPECIALTIES);
      if (Array.isArray(res.data)) {
        const dropdownData = res.data.map((item: string, index: number) => {
          return { label: item, value: item, id: index };
        });
        dispatch(physicianActions.setUserData({ dropdownData }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const physicianFormSubmit = async () => {
    const newUserLogged = await physicianSignUpHandler(router);
    if (newUserLogged) {
      dispatch(profileActions.setUserData({ user: newUserLogged as User }));
    }
  };

  const form = ({ get, invalid }: any) => (
    <form>
      <Box>
        <Box>
          <li>Provide the information below (* are required fields).</li>
          <li>Your account should be processed and active within 24 hours.</li>
          <li>Once you receive your "Account Approval Notification" email, you can begin to prescribe using your account.</li>
        </Box>
        <Typography style={{ color: 'red', margin: '3px 0px', fontSize: '15px' }}>
          <i>If you require an expedited account review, please contact our CustomerService Team at (844) 446-6979.</i>
        </Typography>
      </Box>
      <Stack className="about">About You</Stack>
      <Grid container>
        <Grid item xs={12} lg={4} mb={2}>
          <Typography className="info">Personal Info</Typography>
          <span className="info-small">Please provide your personal info</span>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="firstName"
                render={InputText}
                meta={{
                  name: 'firstName',
                  value: 'firstName',
                  helperText: 'Prescriber First Name is required',
                  label: 'Prescriber First Name',
                  placeholder: 'Please Enter Prescriber First Name'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="lastName"
                render={InputText}
                meta={{
                  name: 'lastName',
                  value: 'lastName',
                  helperText: 'Prescriber Last Name is required',
                  label: 'Prescriber Last Name',
                  placeholder: 'Please Enter Prescriber Last Name'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="phone"
                render={InputPhone}
                meta={{
                  name: 'phone',
                  value: 'phone',
                  helperText: 'Phone Number is required',
                  label: 'Phone',
                  placeholder: 'Please Enter Phone Number'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="notification_preference"
                render={InputSelect}
                meta={{
                  name: 'notification_preference',
                  value: 'notification_preference',
                  options: notificationOptions,
                  label: 'Notification Preference',
                  placeholder: 'Please Enter Notification Preference'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="email"
                render={InputEmail}
                meta={{
                  name: 'email',
                  value: 'email',
                  helperText: 'Email is required.',
                  label: 'Email',
                  placeholder: 'Please Enter Email'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="password"
                render={InputPassword}
                meta={{
                  name: 'password',
                  value: 'password',
                  // helperText: "Password is required.",
                  helperText: physicianSignUpForm.get('password').errors?.required
                    ? 'Password is required'
                    : physicianSignUpForm.get('password').errors?.pattern
                    ? 'Password should contain at least one uppercase letter, one lowercase letter, one digit, one special character, and should be at least 8 characters long'
                    : '',
                  label: 'Password',
                  placeholder: 'Please Enter Password'
                }}
              />
            </Grid>

            {get('donot_npi')?.value && (
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FieldControl
                  name="npi"
                  render={InputText}
                  meta={{
                    name: 'npi',
                    value: 'npi',
                    helperText: 'Npi is required',
                    label: 'NPI',
                    placeholder: 'Please Enter NPI',
                    required: false
                  }}
                />
              </Grid>
            )}
            {!get('donot_npi')?.value && (
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <FieldControl
                  name="npi"
                  render={InputText}
                  meta={{
                    name: 'npi',
                    value: 'npi',
                    helperText: 'Npi is required',
                    label: 'NPI',
                    placeholder: 'Please Enter NPI'
                  }}
                />
              </Grid>
            )}
            {/* <Grid item xs={12} sm={12} md={6} lg={6}>
              <Stack direction={"row"} gap={2} mt={2} mb={4}>
                <FormControlLabel
                  sx={{ margin: 0 }}
                  className="check-input-with-label"
                  control={
                    <FieldControl name="donot_npi" render={CheckInput} />
                  }
                  label="I do not have a NPI"
                />
              </Stack>
            </Grid> */}

            <Grid item xs={12} md={12} lg={12}>
              <FieldControl
                name="specialty"
                render={InputSelect}
                meta={{
                  name: 'specialty',
                  value: 'specialty',
                  options: specialties,
                  label: 'Specialty',
                  placeholder: 'Please Enter Specialty',
                  helperText: 'Specialty is required'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box className="divider"></Box>

      <Grid container>
        <Grid item xs={12} lg={4} mb={2}>
          <Typography className="info">Shipping Address</Typography>
          <span className="info-small">Please provide your shipping address</span>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
              <GoogleAutoCompleteInput uniqueKey={'doctor-auto-complete'} handleAutoCompleteChange={handleAutoCompleteChange} required={true} />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="apt_suite"
                render={InputAddress}
                meta={{
                  name: 'apt_suite',
                  label: 'Apt./Suite',
                  placeholder: 'Please Enter Apt./Suite',
                  required: false
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="city"
                render={InputAddress}
                meta={{
                  name: 'city',
                  options: cityOptions,
                  label: 'City',
                  placeholder: 'Please Enter City',
                  required: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="state"
                render={InputAddress}
                meta={{
                  name: 'state',
                  options: stateOptions,
                  label: 'State',
                  placeholder: 'Please Enter State',
                  required: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FieldControl
                name="code"
                render={InputAddress}
                meta={{
                  name: 'code',
                  helperText: 'Postal Code is required',
                  label: 'Postal Code',
                  placeholder: 'Please Enter Postal Code',
                  required: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Stack direction={'row'} gap={2} mt={2} mb={4}>
                <FormControlLabel className="check-input-with-label" sx={{ margin: 0 }} control={<FieldControl name="rememberMe" render={CheckInput} />} label="I consent to receive occasional product and promotional updates from ImprimisRx via email, text, and phone." />
              </Stack>
            </Grid>
          </Grid>

          <Stack className="d-vh-between" direction="row" mt={3}>
            <Box className="mandatory">
              <span>*</span> This field is mandatory
            </Box>
            <Box className="d-vh-between" gap={1} mt={1}>
              <Box style={{ width: '160px' }}>
                <NavLink to="/">
                  <TertiaryButton label={'Cancel'} />
                </NavLink>
              </Box>
              <Box style={{ width: '160px' }}>
                <PrimaryButton label={'Register'} onClick={physicianFormSubmit} />
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );

  return <Box>{Array.isArray(specialties) && specialties.length > 0 && <FieldGroup control={physicianSignUpForm} render={form} />}</Box>;
}
