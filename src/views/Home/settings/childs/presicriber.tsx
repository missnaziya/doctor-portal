import { Box, Button, Container, Dialog, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography, styled } from '@mui/material';
import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { SettingPrescriberHandler, prescriberForm } from '../../../../services/pages/settings/PrescriberForm';
import { useAppDispatch, useAppSelector } from '../../../../store';

import { AddNewAddress } from '../../../../components/popup/AddNewAddress';
import { AddNewCard } from '../../../../components/popup/AddNewCard';
import { AddPrescriber } from '../../../../components/popup/AddPrescriber';
import { AxiosResponse } from 'axios';
import Billing from '../../../../assets/icons/billing.svg';
import { EditShippingAddress } from '../../../../components/popup/EditShippingAddress';
import Home from '../../../../assets/icons/shipping_home.svg';
import { InputEmail } from '../../../../core/forms/InputEmail';
import { InputPhone } from '../../../../core/forms/inputs/InputPhone';
import { InputSelect } from '../../../../core/forms/inputs/InputSelect';
import { InputText } from '../../../../core/forms/inputs/InputText';
import { PRESCRIBER_PROFILE_GET } from '../../../../constants/Endpoints';
import Setting_plus from '../../../../assets/icons/setting_plus.svg';
import { User } from '../../../../models/User';
import UserBlack from '../../../../assets/icons/user_black.svg';
import UserImage from '../../../../assets/icons/user.svg';
import User_profile from '../../../../assets/icons/profile_user.svg';
import cameraPic from '../../../../assets/icons/camera.svg';
import deleteIcon from '../../../../assets/icons/deleteIcon.svg';
import editIcon from '../../../../assets/icons/editIcon.svg';
import { notificationOptions } from '../../../../services/components/selectOptions.service';
import { settingsActions } from '../../../../store/Actions';
import { addNewPrescriberForm } from '../../../../services/pages/popup-form/AddNewPrescriberForm.service';
import Doctor from '../../../../constants/grx-api';
import { GoogleAutoCompleteInput } from '../../../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../../../core/forms/inputs/InputAddress';
import PrimaryButton from '../../../../core/buttons/primary-button';
import { cityOptions } from '../../../../services/components/selectOptions.service';
import { stateOptions } from '../../../../services/components/selectOptions.service';
import { toast } from 'react-toastify';

export const Prescriber = () => {
  const userData = useAppSelector((state) => state.profileReducer.user);
  const specialties = useAppSelector((state) => state.physicanReducer.dropdownData);
  const [selectedPrescriberIndex, setSelectedPrescriberIndex] = useState(0);
  const prescribers: any = useAppSelector((state) => state.settingReducer.prescribers);

  const dispatch = useAppDispatch();

  const getSpecialtyName = (id: number) => {
    return (specialties.find((item: { id: number }) => item.id === id) as any)?.label;
  };

  useEffect(() => {
    prescriberForm.reset();
    if (prescribers && prescribers.length > 0) {
      prescriberForm.patchValue({
        firstName: prescribers[selectedPrescriberIndex]?.firstName,
        lastName: prescribers[selectedPrescriberIndex]?.lastName,
        phone: prescribers[selectedPrescriberIndex]?.phoneNumber?.areaCode + '' + prescribers[selectedPrescriberIndex]?.phoneNumber?.number,
        email: prescribers[selectedPrescriberIndex]?.email,
        notification_preference: prescribers[selectedPrescriberIndex]?.notification,
        npi: prescribers[selectedPrescriberIndex]?.npi,
        speciality: getSpecialtyName(prescribers[selectedPrescriberIndex]?.Speciality),
        doctor_id: prescribers[selectedPrescriberIndex]?.doctor_id,
        street: prescribers[selectedPrescriberIndex]?.address?.address1,
        apt_suite: prescribers[selectedPrescriberIndex]?.address?.address2,
        city: prescribers[selectedPrescriberIndex]?.address?.city,
        state: prescribers[selectedPrescriberIndex]?.address?.state,
        code: prescribers[selectedPrescriberIndex]?.address?.zipCode
      });
    }
  }, [selectedPrescriberIndex, prescribers]);

  const [data, setData] = useState({
    card: false,
    prescriber: false,
    address: false,
    edit: false,
    addPrescriber: false
  });

  const SettingPrescriberInfoHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    SettingPrescriberHandler(userData);
  };

  const handleClick = (index: number) => {
    setSelectedPrescriberIndex(index);
  };

  const handleNewCard = () => {
    setData((oldData) => ({
      ...oldData,
      card: true
    }));
  };

  const handleAddPrescriber = () => {
    addNewPrescriberForm.reset();
    setData((oldData) => ({
      ...oldData,
      addPrescriber: true
    }));
  };

  const handleNewAddress = () => {
    setData((oldData) => ({
      ...oldData,
      address: true
    }));
  };

  const handleEditAddress = () => {
    setData((oldData) => ({
      ...oldData,
      edit: true
    }));
  };

  useEffect(() => {
    loadPrescriber();
  }, []);

  const loadPrescriber = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(PRESCRIBER_PROFILE_GET);
      dispatch(settingsActions.setPrescriptionData({ data: User.createFromArray(res.data) as User[] }));
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleClose = (e?: string | React.SyntheticEvent) => {
    if (e === 'New Prescriber Added') {
      loadPrescriber();
    }
    setData((oldData) => ({
      ...oldData,
      card: false,
      prescriber: false,
      address: false,
      edit: false,
      addPrescriber: false
    }));
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1)
    }
  }));

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    addNewPrescriberForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

  return (
    <>
      {data.card && (
        <BootstrapDialog onClose={() => handleClose()} open={data.card} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddNewCard handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {data.address && (
        <BootstrapDialog onClose={() => handleClose()} open={data.address} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddNewAddress handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {data.edit && (
        <BootstrapDialog onClose={() => handleClose()} open={data.edit} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <EditShippingAddress handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {data.addPrescriber && (
        <BootstrapDialog onClose={() => handleClose()} open={data.addPrescriber} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddPrescriber handleClose={handleClose} />
        </BootstrapDialog>
      )}

      <Box className="payment">
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" marginTop={{ xs: 0, sm: 1, md: 2 }}>
            <Grid item container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={12} md={12} lg={3}>
                <Stack direction="row" className="setting_profile">
                  <Box className="setting_name" mt={3} pt={3}>
                    <ul>
                      <li>
                        <Typography component="h3">Prescribers</Typography>
                      </li>
                      {prescribers &&
                        prescribers.map((prescriber: any, index: number) => {
                          return (
                            <li key={index}>
                              <Button title={prescriber.firstName} className={index === selectedPrescriberIndex ? 'active profile_prescriber_btn' : 'profile_prescriber_btn'} id={'1'} onClick={() => handleClick(index)} variant="outlined">
                                <div className="search-inputfield-btn">{index === selectedPrescriberIndex ? <img src={User_profile} alt="search" height={18} width={20} /> : <img src={UserBlack} alt="search" height={18} width={20} />}</div>
                                {prescriber.firstName}
                              </Button>
                            </li>
                          );
                        })}
                      <li>
                        <Button
                          className="edit_btn settings_btn_last"
                          variant="outlined"
                          onClick={handleAddPrescriber}
                          style={{
                            color: '#00ACBA',
                            fontSize: '22px',
                            fontWeight: '600',
                            backgroundColor: '#fff',
                            border: '1px solid #fff',
                            borderRadius: '8px',
                            boxShadow: 'none',
                            height: '45px',
                            width: '230px',
                            textAlign: 'left',
                            textTransform: 'capitalize',
                            marginTop: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingLeft: '0px'
                          }}
                        >
                          <div className="search-inputfield-btn">
                            <img src={Setting_plus} alt="search" height={22} width={22} />
                          </div>
                          Add Prescriber
                        </Button>
                      </li>
                    </ul>
                  </Box>
                </Stack>
              </Grid>

              {prescribers && prescribers.length > 0 && (
                <>
                  {/* <Grid item xs={12} sm={12} md={12} lg={2}>
                    <Stack direction="row" className="setting_profile">
                      <Stack width={{ lg: '100%' }} mt={4} pt={4} className="girlAlignment">
                        <Box className="card-user-profile-img" style={prescribers[selectedPrescriberIndex].profile_image_path ? { background: `url('https://mobileauth.imprimisrx.com/development/webservices/images/originals/${prescribers[selectedPrescriberIndex].profile_image_path}')` } : {}}>
                          <label className="camera" htmlFor="upload-button">
                            <img src={cameraPic} alt="camera" width={38} height={38} />
                          </label>
                          <input type="file" id="upload-button" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, prescribers[selectedPrescriberIndex])} />
                        </Box>
                      </Stack>
                    </Stack>
                  </Grid> */}
                  <Grid item xs={12} sm={12} md={12} lg={7}>
                    <Box className="personal_details personal_details_block">
                      <Typography className="heading">
                        <span className="profile_icon">
                          <img src={UserImage} alt="Imprimis RX A Harrow Company" width={16} />
                        </span>
                        Personal
                      </Typography>
                    </Box>
                    <FieldGroup
                      control={prescriberForm}
                      render={({ get, invalid }) => (
                        <form>
                          <Stack className="setting_info" gap={{ xs: 2.25, sm: 2.25, md: 2.25, lg: 2.25 }}>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                  <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <FieldControl name="firstName" render={InputText} meta={{ name: 'firstName', value: 'firstName', helperText: 'First Name is required', label: 'Prescriber First Name', placeholder: 'Please Enter Prescriber First Name' }} />
                                  </Grid>
                                  <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <FieldControl name="lastName" render={InputText} meta={{ name: 'lastName', value: 'lastName', helperText: 'Last Name is required', label: 'Prescriber Last Name', placeholder: 'Please Enter Prescriber Last Name' }} />
                                  </Grid>
                                </Stack>
                              </Grid>
                            </Stack>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', helperText: 'Phone is required', label: 'Phone', placeholder: 'Please Enter Phone Number' }} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', helperText: 'Email is required.', label: 'Email', placeholder: 'Please Enter Email' }} />
                                </Grid>
                                {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="notification_preference" render={InputSelect} meta={{ name: 'notification_preference', value: 'notification_preference', options: notificationOptions, label: 'Notification Preference', placeholder: 'Please Enter Notification Preference' }} />
                                </Grid> */}
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', helperText: 'Email is required.', label: 'Email', placeholder: 'Please Enter Email' }} />
                                </Grid> */}
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="npi" render={InputText} meta={{ name: 'npi', value: 'npi', helperText: 'NPI is required', label: 'NPI', placeholder: 'Please Enter NPI' }} />
                                </Grid>
                              </Stack>
                            </Grid>

                            <Grid item xs={12} lg={4}>
                              <Typography variant="h6">Shipping Address</Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
                              <GoogleAutoCompleteInput uniqueKey={'doctor-auto-complete'} handleAutoCompleteChange={handleAutoCompleteChange} required={true} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', label: 'Apt./Suite', placeholder: 'Please Enter Apt./Suite', required: false }} />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="city" render={InputAddress} meta={{ name: 'city', options: cityOptions, label: 'City', helperText: 'City is required', placeholder: 'Please Enter City', required: true }} />
                                </Grid>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="state" render={InputAddress} meta={{ name: 'state', options: stateOptions, label: 'State', helperText: 'State is required', placeholder: 'Please Enter State', required: true }} />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} lg={6} mb={2}>
                                  <FieldControl name="code" render={InputAddress} meta={{ name: 'code', label: 'Postal Code', helperText: 'Postal Code is required', placeholder: 'Please Enter Postal Code', required: true }} />
                                </Grid>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                {/* <Grid item xs={12} sm={12} md={12} lg={9}>
                                  <FieldControl
                                    name="speciality"
                                    render={InputSelect}
                                    meta={{ name: 'speciality', value: getSpecialtyName(prescribers[selectedPrescriberIndex]?.Speciality), options: specialties, label: 'Specialty', placeholder: 'Please Enter Specialty', helperText: 'Specialty is required' }}
                                  />
                                </Grid> */}
                                {/* <Grid item xs={12} sm={12} md={12} lg={3}>
                                  <Stack alignItems="center" justifyContent="center">
                                    <Box className="add_new_cart" alignItems="center" justifyContent="flex-end">
                                      <button
                                        className="edit_btn"
                                        style={{
                                          color: '#00ACBA',
                                          fontSize: '20px',
                                          fontWeight: '700',
                                          backgroundColor: '#fff',
                                          border: '2px solid #00ACBA',
                                          borderRadius: '8px',
                                          boxShadow: 'none',
                                          height: '56px',
                                          width: '198px',
                                          cursor: 'pointer',
                                          textTransform: 'capitalize'
                                        }}
                                        onClick={SettingPrescriberInfoHandler}
                                      >
                                        Save
                                      </button>
                                    </Box>
                                  </Stack>
                                </Grid> */}
                              </Stack>
                            </Grid>
                          </Stack>
                        </form>
                      )}
                    />
                    {/* <Stack className="setting_billing" direction="row" justifyContent="space-around" gap={5} mb={4} mt={4}>
                      <Grid item container xs={12} sm={12} md={6} lg={6}>
                        <Box className="exeasting gap_top personal_details">
                          <Typography className="heading">
                            <span className="profile_icon">
                              <img src={Billing} alt="Imprimis RX A Harrow Company" width={16} />
                            </span>
                            BILLING INFO
                          </Typography>
                          <Typography component="h2" mt={3}>
                            Existing Cards
                          </Typography>

                          <RadioGroup defaultValue="female" className="radio_grid" aria-labelledby="demo-customized-radios" name="customized-radios">
                            <Stack direction="row" alignItems="center">
                              <FormControlLabel value="female" control={<Radio />} label="American Express - x4458" />
                              <Stack>
                                <img src={deleteIcon} alt="Imprimis RX A Harrow Company" width={16} />
                              </Stack>
                            </Stack>
                            <Stack direction="row" alignItems="center">
                              <FormControlLabel value="male" control={<Radio />} label="Mastercard - x8597" />
                              <Stack>
                                <img src={deleteIcon} alt="Imprimis RX A Harrow Company" width={16} />
                              </Stack>
                            </Stack>
                          </RadioGroup>
                        </Box>
                        <Box className="add_new_cart">
                          <button className="edit_btn" style={{ color: '#00ACBA', fontSize: '20px', fontWeight: '700', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', height: '46px', width: '198px', textTransform: 'capitalize' }} onClick={handleNewCard}>
                            Add New Card
                          </button>
                        </Box>
                      </Grid>
                      <Grid item container xs={12} sm={12} md={6} lg={6}>
                        <Box className="exeasting gap_top personal_details">
                          <Typography className="heading">
                            <span className="profile_icon">
                              <img src={Home} alt="Imprimis RX A Harrow Company" width={16} />
                            </span>
                            SHIPPING INFO
                          </Typography>
                          <Typography component="h2" mt={3}>
                            Shipping Addresses
                          </Typography>

                          <RadioGroup defaultValue="female" className="radio_grid" aria-labelledby="demo-customized-radios" name="customized-radios">
                            <Stack direction="row" alignItems="center">
                              <FormControlLabel value="female" control={<Radio />} label="Joseph Nashville" />
                              <Stack onClick={handleEditAddress}>
                                <img src={editIcon} alt="Imprimis RX A Harrow Company" width={16} />
                              </Stack>
                            </Stack>
                            <Stack direction="row" alignItems="center">
                              <FormControlLabel value="male" control={<Radio />} label="Mary Kentucky" />
                              <Stack onClick={handleEditAddress}>
                                <img src={editIcon} alt="Imprimis RX A Harrow Company" width={16} />
                              </Stack>
                            </Stack>
                          </RadioGroup>
                        </Box>
                        <Box className="add_new_cart">
                          <button
                            className="edit_btn"
                            style={{
                              color: '#00ACBA',
                              fontSize: '20px',
                              fontWeight: '700',
                              backgroundColor: '#fff',
                              border: '2px solid #00ACBA',
                              borderRadius: '8px',
                              boxShadow: 'none',
                              height: '46px',
                              width: '198px',
                              textTransform: 'capitalize'
                            }}
                            onClick={handleNewAddress}
                          >
                            Add New Address
                          </button>
                        </Box>
                      </Grid>
                    </Stack> */}
                  </Grid>
                </>
              )}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
