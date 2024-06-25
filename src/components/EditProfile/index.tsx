import { Box, Button, Container, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { FieldControl, FieldGroup, FormBuilder, Validators } from 'react-reactive-form';
import { RootState, useAppSelector } from '../../store';
import { useEffect, useState } from 'react';

import { AddNewCard } from '../popup/AddNewCard';
import { AxiosResponse } from 'axios';
import Back from '../../assets/icons/back.svg';
import { BootstrapDialog } from '../../core/tables/tableStyles';
import Doctor from '../../constants/grx-api';
import { InputDate } from '../../core/forms/inputDate';
import { InputEmail } from '../../core/forms/InputEmail';
import { InputPhone } from '../../core/forms/inputs/InputPhone';
import { InputSelect } from '../../core/forms/inputs/InputSelect';
import { InputText } from '../../core/forms/inputs/InputText';
import { PatientInterface } from '../../interfaces/patient';
import { UPDATE_PATIENT, GET_PATIENT_CARDS, DELETE_PATIENT_CARD, GET_ALLERGIES } from '../../constants/Endpoints';
import User_icon from '../../assets/icons/user.svg';
import Volate from '../../assets/icons/volate.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';
import { genderOptions } from '../../services/components/selectOptions.service';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addNewCardForm } from '../../services/pages/popup-form/AddNewCardForm.service';
import { GoogleAutoCompleteInput } from '../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../core/forms/inputs/InputAddress';
import { cityOptions } from '../../services/components/selectOptions.service';
import { stateOptions } from '../../services/components/selectOptions.service';
import { patientForm } from './editPatientForm.service';
import { patientFormHandler } from './editPatientForm.service';
import { useAppDispatch } from '../../store';
import { patientActions } from '../../store/Actions';
import { CheckInput } from '../../core/forms/inputs/CheckInput';
import { FreesoloInputMultiSelect } from '../../core/forms/inputs/FreesoloInputMultiSelect';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { Color } from '../../interfaces/Color';
import dayjs from 'dayjs';

export default function EditProfile(props: { profile: PatientInterface; handleProfile: (check: boolean) => void }) {
  type card = {
    billingAddress: {};
    cardId: string;
    default: boolean;
    expiration: string;
    lastFourDigits: string;
    type: string;
  };

  const router = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.profileReducer.user);
  const cards: card[] = useAppSelector((state) => state.patientReducer.patientCards);

  const [allergyOptions, setAllergyOptions] = useState([]);

  const [birthDate, setBirthDate] = useState<any>(moment.utc(props.profile.birth_date).format('YYYY-MM-DD'));

  const [data, setData] = useState({
    card: false
  });

  const handleNewCard = () => {
    addNewCardForm.patchValue({
      pat_id: props?.profile?.pat_id,
      street: props?.profile?.addr1 + ' ' + props?.profile?.addr2,
      city: props?.profile?.city,
      state: props?.profile?.state_cd
    });
    setData((oldData) => ({
      ...oldData,
      card: true
    }));
  };

  const handleClose = () => {
    getCards(props?.profile?.pat_id);
    setData((oldData) => ({
      ...oldData,
      card: false
    }));
  };

  useEffect(() => {
    patientForm.patchValue({
      firstName: props?.profile?.fname,
      lastName: props?.profile?.lname,
      gender: props?.profile?.gender_cd,
      dob: moment(props.profile.birth_date).format('YYYY-MM-DD'),
      email: props?.profile?.email !== 'null' ? props?.profile?.email : '',
      phone_id: props?.profile?.phone_id,
      phone_no: props?.profile?.area_code + props?.profile?.phone_no,
      mobile: props?.profile?.area_code + props?.profile?.phone_no,
      addr_id: props?.profile?.addr_id,
      street: props?.profile?.addr1 !== 'null' ? props?.profile?.addr1 : '',
      apt_suite: props?.profile?.addr2 !== 'null' ? props?.profile?.addr2 : '',
      city: props?.profile?.city,
      state: props.profile?.state_cd,
      code: props?.profile?.zip,
      country: props?.profile?.country,
      pat_id: props?.profile?.pat_id,
      blueViewNetwork: props?.profile?.active_yn === 1 ? true : false,
      allergies: props?.profile?.allergies.map((allergy: any) => allergy.name).join(',')
    });
  }, [patientForm]);

  const handleBack = () => {
    router('/home/patient');
  };
  const saveProfile = async () => {
    await patientFormHandler({ ...props, user });
  };

  const backProfile = () => {
    props.handleProfile(false);
  };

  const getCards = async (pat_id: string) => {
    try {
      const res: AxiosResponse = await Doctor.get(`${GET_PATIENT_CARDS}/${pat_id}`);
      if (Array.isArray(res.data)) {
        dispatch(patientActions.setCurrentPatientCards(res.data));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleDeleteCard = async (cardId: string, index: number) => {
    try {
      const res: AxiosResponse = await Doctor.delete(`${DELETE_PATIENT_CARD}/${cardId}/${props?.profile?.pat_id}`);
      if (res.status === 200) {
        let updatedCards = [...cards];
        updatedCards.splice(index, 1);
        dispatch(patientActions.setCurrentPatientCards([...updatedCards]));
        toast('Card deleted successfully');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    patientForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

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
    patientForm.patchValue({
      allergies: value
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
                patientForm.patchValue({
                  dob: moment(e.$d).format('YYYY-MM-DD')
                });
              } else {
                setBirthDate('');
                patientForm.patchValue({
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
      {data.card && (
        <BootstrapDialog onClose={handleClose} open={data.card} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddNewCard handleClose={handleClose} />
        </BootstrapDialog>
      )}
      <Box className="contact_profile">
        <Container maxWidth="xl">
          <Stack className="Contact_img" display="flex" alignItems="center" justifyContent="center">
            <Box className="tw_icon_out tw_icon_out_padding">
              <span className="tw_icon">
                {props.profile?.fname.slice(0, 1)}
                {props.profile?.lname.slice(0, 1)}
              </span>
              {props.profile?.fname} {props.profile?.lname}
            </Box>
          </Stack>
          <Grid container spacing={2} padding={0} className="main_info_alignment">
            <Grid item className="details_box details_border" xs={12} sm={12} md={12} lg={7} p="0">
              <Box className="personal_details" mb={4}>
                <Typography className="heading">
                  <span className="profile_icon">
                    <img src={User_icon} alt="Imprimis RX A Harrow Company" width={16} />
                  </span>
                  PERSONAL INFO
                </Typography>
              </Box>
              <FieldGroup
                control={patientForm}
                render={({ get, invalid }) => (
                  <form>
                    <Grid item xs={12} lg={12}>
                      <Grid container spacing={1} className="contact_outer">
                        {/* <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Office / Residential Phone</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="other_phone_no" render={InputPhone} meta={{ name: 'other_phone_no', helperText: 'Office / Residential Phone is required', label: 'Office / Residential Phone', placeholder: 'Please Enter Office / Residential Phone' }} />
                          </Grid>
                        </Stack> */}
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Mobile Phone</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="phone_no" render={InputPhone} meta={{ name: 'phone_no', helperText: 'Mobile Phone is required', label: 'Mobile Phone', placeholder: 'Please Enter Mobile Phone' }} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Email</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', helperText: 'Email is required.', label: 'Email', placeholder: 'Please Enter Email', required: false }} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">DOB</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl
                              name="dob"
                              render={handleDatePicker}
                              meta={{
                                name: 'dob',
                                value: 'dob',
                                // helperText: 'DOB is required',
                                label: 'DOB',
                                placeholder: 'Please Enter DOB',
                                required: true,
                                helperText: patientForm.get('dob').errors?.required ? 'DOB is required' : patientForm.get('dob').errors?.pattern ? 'Please enter valid DOB' : ''
                              }}
                            />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Gender</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="gender" render={InputSelect} meta={{ name: 'gender', value: 'gender', options: genderOptions, label: 'Gender', placeholder: 'Please Enter Gender' }} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Allergies</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7}>
                            <FieldControl
                              name="allergies"
                              render={FreesoloInputMultiSelect}
                              meta={{
                                value: 'allergies',
                                name: 'allergies',
                                label: 'Allergies',
                                placeholder: 'Please Enter Allergies',
                                options: allergyOptions,
                                onChange: onSelectAllergies,
                                selectedAllergyOptions: props?.profile?.allergies?.map((allergy: any) => allergy.name),
                                required: false
                              }}
                            />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Blue View Vision Patient</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7}>
                            <FormControlLabel sx={{ margin: 0 }} className="check-input-with-label" control={<FieldControl name="blueViewNetwork" render={CheckInput} />} label="" />
                          </Grid>
                        </Stack>

                        <Stack className="contact" direction="row" alignItems="center" mt={2}>
                          <Box className="personal_details" mb={4}>
                            <Typography className="heading">SHIPPING ADDRESS</Typography>
                          </Box>
                        </Stack>

                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Street</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment google-auto-complete-container" style={{ zIndex: 9999 }}>
                            <GoogleAutoCompleteInput uniqueKey={'staff-auto-complete'} handleAutoCompleteChange={handleAutoCompleteChange} required={true} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Apt. Suite</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', helperText: 'Apt./Suite is required', label: 'Apt./Suite', placeholder: 'Please Enter Apt./Suite', required: false }} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">City</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="city" render={InputAddress} meta={{ name: 'city', options: cityOptions, label: 'City', placeholder: 'Please Enter City', required: true }} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">State</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="state" render={InputAddress} meta={{ name: 'state', options: stateOptions, label: 'State', placeholder: 'Please Enter State', required: true }} />
                          </Grid>
                        </Stack>
                        <Stack className="contact" direction="row" alignItems="center">
                          <Box className="contact_side">Postal Code</Box>
                          <Grid item xs={12} sm={12} md={12} lg={7} className="alignment">
                            <FieldControl name="code" render={InputAddress} meta={{ name: 'code', helperText: 'Postal Code is required', label: 'Postal Code', placeholder: 'Please Enter Postal Code', required: true }} />
                          </Grid>
                        </Stack>
                        {/* <FieldControl name="street" render={InputText} meta={{ name: 'street', helperText: 'Shipping Address is required', label: 'Shipping Address', placeholder: 'Please Enter Shipping Address' }} /> */}
                      </Grid>
                    </Grid>
                  </form>
                )}
              />
            </Grid>
            <Grid item className="details_box" xs={12} sm={12} md={12} lg={5} paddingLeft={{ xs: 0, md: 0, lg: 0 }}>
              <Box className="payment payment_prescriber">
                <Box className="personal_details" mb={4}>
                  <Typography className="heading">
                    <span className="profile_icon">
                      <img src={Volate} alt="Imprimis RX A Harrow Company" width={16} />
                    </span>
                    BILLING INFO
                  </Typography>
                </Box>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" className="top_alignment">
                  {/* <Grid container xs={12} sm={12} md={12} lg={12}> */}
                  <Box className="exeasting gap_top">
                    <Typography component="h2">Existing Cards</Typography>

                    {cards &&
                      cards.map((card, index) => (
                        <Stack direction="row" alignItems="center" m={1} key={index}>
                          <Typography variant="subtitle1" mr={2}>{`${card.type} - xx${card.lastFourDigits}`}</Typography>
                          <Stack onClick={(e: React.SyntheticEvent) => handleDeleteCard(card.cardId, index)}>
                            <img src={deleteIcon} alt="Imprimis RX A Harrow Company" width={16} />
                          </Stack>
                        </Stack>
                      ))}
                    <Box className="add_new_cart gap_top">
                      <button className="edit_btn" onClick={handleNewCard} style={{ color: '#00ACBA', fontSize: '18px', fontWeight: '700', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', height: '46px', width: '198', textTransform: 'capitalize' }}>
                        Add New Card
                      </button>
                    </Box>
                  </Box>
                  {/* </Grid> */}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className="back_patient">
        <Box className="patient_list" mr={3} onClick={handleBack} style={{ cursor: 'pointer' }}>
          <span>
            <img src={Back} alt="input_icon" width={30} height={30} />
          </span>
          <p>Back to Patients List</p>
        </Box>
        <Box className="patient_head">
          <ul>
            <li>
              <Button
                className="contact_btn"
                variant="outlined"
                style={{ color: '#00ACBA', fontSize: '17px', height: '49', width: '212', fontWeight: '600', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize', marginRight: '20px' }}
                onClick={backProfile}
              >
                Cancel
              </Button>

              <Button
                className="contact_btn"
                variant="outlined"
                style={{ color: '#00ACBA', fontSize: '17px', height: '49', width: '212', fontWeight: '600', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize' }}
                onClick={saveProfile}
              >
                Save
              </Button>
            </li>
          </ul>
        </Box>
      </Box>
    </>
  );
}
