import { Box, Button, Container, Dialog, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography, styled } from '@mui/material';
import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { useAppDispatch, useAppSelector } from '../../../../store';

import { AddNewAddress } from '../../../../components/popup/AddNewAddress';
import { AddNewFacilityCard } from '../../../../components/popup/AddNewFacilityCard';
import { AddFacility } from '../../../../components/popup/AddFacility';
import { AxiosResponse } from 'axios';
import Billing from '../../../../assets/icons/billing.svg';
import { EditShippingAddress } from '../../../../components/popup/EditShippingAddress';
import Home from '../../../../assets/icons/shipping_home.svg';
import { InputEmail } from '../../../../core/forms/InputEmail';
import { InputPhone } from '../../../../core/forms/inputs/InputPhone';
import { InputSelect } from '../../../../core/forms/inputs/InputSelect';
import { InputText } from '../../../../core/forms/inputs/InputText';
import { PRESCRIBER_PROFILE_GET, GET_FACILITIES, ADD_FACILITY, DELETE_FACILITY, GET_FACILITY_CARD, DELETE_FACILITY_CARD } from '../../../../constants/Endpoints';
import Doctor from '../../../../constants/grx-api';
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
import { GoogleAutoCompleteInput } from '../../../../core/forms/inputs/GoogleAutoCompleteInput';
import { InputAddress } from '../../../../core/forms/inputs/InputAddress';
import { cityOptions, stateOptions } from '../../../../services/components/selectOptions.service';
import { FacilityForm } from '../../../../services/pages/settings/FacilityForm';
import { toast } from 'react-toastify';
import { addFacilityNewCardForm } from '../../../../services/pages/popup-form/AddFacilityNewCardForm.service';
import { AddNewFacilityForm } from '../../../../services/pages/popup-form/AddNewFacilityForm.service';
import { SettingFacilityHandler } from '../../../../services/pages/settings/FacilityForm';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export const Facility = () => {
  const userData: User = useAppSelector((state) => state.profileReducer.user);
  const specialties = useAppSelector((state) => state.physicanReducer.dropdownData);
  const facilities: any = useAppSelector((state) => state.settingReducer.facilities);
  const facilityCard: any = useAppSelector((state) => state.settingReducer.facilityCard);
  const currentFacility: any = useAppSelector((state) => state.settingReducer.currentFacility);

  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(0);
  const [currentFacilityId, setcurrentFacilityId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  const getSpecialtyName = (id: number) => {
    return (specialties.find((item: { id: number }) => item.id === id) as any)?.label;
  };

  const handleAutoCompleteChange = ({ address1, locality, short_name, postcode, country }: { address1: string; locality: string; short_name: string; postcode: string; country: string }) => {
    FacilityForm.patchValue({
      street: address1,
      city: locality,
      state: short_name,
      code: postcode.split('-')[0],
      country: country
    });
  };

  // useEffect(() => {
  //   if (currentFacility > selectedFacilityIndex) setSelectedFacilityIndex(currentFacility);
  // }, [currentFacility]);

  const [data, setData] = useState({
    card: false,
    prescriber: false,
    address: false,
    edit: false,
    addPrescriber: false
  });

  const settingFacilityInfoHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const response = await SettingFacilityHandler(facilities[selectedFacilityIndex]?.id);
    if (response === true) {
      loadFacilities();
      toast('Facility Updated Successfully');
    }
  };

  const onSelectfacility = async (index: number, facilityId: number) => {
    setSelectedFacilityIndex(index);
  };

  const handleNewCard = async () => {
    addFacilityNewCardForm.reset();
    addFacilityNewCardForm.patchValue({
      facilityId: facilities[selectedFacilityIndex]?.id,
      city: facilities[selectedFacilityIndex]?.city,
      state: facilities[selectedFacilityIndex]?.state,
      street: facilities[selectedFacilityIndex]?.addr1
    });
    setData((oldData) => ({
      ...oldData,
      card: true
    }));
  };

  const handleAddFacility = () => {
    AddNewFacilityForm.reset();
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

  const loadFacilities = async () => {
    try {
      const mdId = userData?.type === 'Staff' ? userData?.activePrescriber?.mdId : userData?.mdId;
      const res: AxiosResponse = await Doctor.get(GET_FACILITIES, { params: { md_id: parseInt(mdId) } });
      if (Array.isArray(res.data)) {
        dispatch(settingsActions.setFacilityData({ data: res.data }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const getFacilityCard = async (facilityId: number) => {
    try {
      const res: AxiosResponse = await Doctor.get(`${GET_FACILITY_CARD}/${facilityId}`);
      if (Array.isArray(res.data)) {
        dispatch(settingsActions.setFacilityCardData({ data: res.data }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleDeleteCard = async (cardId: string, index: number) => {
    try {
      const res: AxiosResponse = await Doctor.delete(`${DELETE_FACILITY_CARD}/${cardId}/${facilities[selectedFacilityIndex]?.id}`);
      if (res?.status === 200) {
        console.log('CARD::', facilities[selectedFacilityIndex]?.id);
        getFacilityCard(facilities[selectedFacilityIndex]?.id);
        toast('Card deleted successfully');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };
  const handleFacilityCardClose = async (res: boolean) => {
    if (res) {
      getFacilityCard(facilities[selectedFacilityIndex]?.id);
    }
    handleClose();
  };

  const handleFacilityFormClose = async (res: number | boolean) => {
    if (typeof res === 'number') {
      loadFacilities();
      if (facilities.length > 0) {
        setcurrentFacilityId(res);
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setData((oldData) => ({
      ...oldData,
      card: false,
      prescriber: false,
      address: false,
      edit: false,
      addPrescriber: false
    }));
  };

  useEffect(() => {
    FacilityForm.reset();
    if (facilities && facilities.length > 0) {
      FacilityForm.patchValue({
        firstName: facilities[selectedFacilityIndex]?.company,
        street: facilities[selectedFacilityIndex]?.addr1,
        apt_suite: facilities[selectedFacilityIndex]?.addr2 === 'null' ? '' : facilities[selectedFacilityIndex]?.addr2,
        city: facilities[selectedFacilityIndex]?.city,
        state: facilities[selectedFacilityIndex]?.state,
        code: facilities[selectedFacilityIndex]?.zip.split('-')[0],
        phone: facilities[selectedFacilityIndex]?.phone,
        fax: facilities[selectedFacilityIndex]?.fax
      });
      getFacilityCard(facilities[selectedFacilityIndex]?.id);
    }
  }, [selectedFacilityIndex, facilities]);

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    if (facilities.length > 0) {
      if (currentFacilityId !== null) {
        setSelectedFacilityIndex(currentFacility);
        getFacilityCard(currentFacilityId);
      }
    }
  }, [currentFacility, currentFacilityId]);

  return (
    <>
      {data.card && (
        <BootstrapDialog onClose={() => handleClose()} open={data.card} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddNewFacilityCard handleClose={handleFacilityCardClose} />
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
          <AddFacility handleClose={handleFacilityFormClose} />
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
                        <Typography component="h3">Approved Facilities</Typography>
                      </li>
                      {facilities &&
                        facilities.map((facility: any, index: number) => {
                          return (
                            <li key={index}>
                              <Button title={facility.company} className={index === selectedFacilityIndex ? 'active profile_prescriber_btn' : 'profile_prescriber_btn'} id={'1'} onClick={() => onSelectfacility(index, facility.id)} variant="outlined">
                                {facility.company}
                              </Button>
                            </li>
                          );
                        })}
                      <li>
                        <Button
                          className="edit_btn settings_btn_last"
                          variant="outlined"
                          onClick={handleAddFacility}
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
                          Add Facility
                        </Button>
                      </li>
                    </ul>
                  </Box>
                </Stack>
              </Grid>

              {facilities && facilities.length > 0 && (
                <>
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
                      control={FacilityForm}
                      render={({ get, invalid }) => (
                        <form>
                          <Stack className="setting_info" gap={{ xs: 2.25, sm: 2.25, md: 2.25, lg: 2.25 }}>
                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="firstName" render={InputText} meta={{ name: 'firstName', value: 'firstName', helperText: 'Name is required', label: 'Name', placeholder: 'Please Enter Name' }} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', helperText: 'Phone Number is required', label: 'Phone', placeholder: 'Please Enter Phone Number' }} />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                              <FieldControl name="fax" render={InputPhone} meta={{ name: 'fax', value: 'fax', helperText: 'Fax is required', label: 'Fax', placeholder: 'Please Enter Fax' }} />
                            </Grid>
                            <Grid item xs={12} lg={12}>
                              <Typography variant="h6">Address</Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} className="google-auto-complete-container" style={{ zIndex: 9999 }}>
                              <GoogleAutoCompleteInput uniqueKey={'doctor-auto-complete'} handleAutoCompleteChange={handleAutoCompleteChange} type="addFacility" required={true} />
                            </Grid>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                  <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <FieldControl name="apt_suite" render={InputAddress} meta={{ name: 'apt_suite', label: 'Address 2', helperText: 'Address 2 is required', placeholder: 'Please Enter Address 2' }} />
                                  </Grid>

                                  <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <FieldControl name="city" render={InputAddress} meta={{ name: 'city', options: cityOptions, label: 'City', helperText: 'City is required', placeholder: 'Please Enter City', required: true }} />
                                  </Grid>
                                </Stack>
                              </Grid>
                            </Stack>
                            <Stack className="inputs_fields_ratio" direction="row">
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
                            </Stack>
                          </Stack>
                          <Grid item xs={12} sm={12} md={12} lg={3} display="flex" gap={2}>
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
                                  onClick={settingFacilityInfoHandler}
                                >
                                  Save
                                </button>
                              </Box>
                            </Stack>
                          </Grid>
                          {/* <Stack className="setting_info" gap={{ xs: 2.25, sm: 2.25, md: 2.25, lg: 2.25 }}>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                  <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <FieldControl name="firstName" render={InputText} meta={{ name: 'firstName', value: 'firstName', helperText: 'First Name is required', label: 'Name', placeholder: 'Please Enter Name' }} />
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
                                  <FieldControl name="notification_preference" render={InputSelect} meta={{ name: 'notification_preference', value: 'notification_preference', options: notificationOptions, label: 'Notification Preference', placeholder: 'Please Enter Notification Preference' }} />
                                </Grid>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="email" render={InputEmail} meta={{ name: 'email', value: 'email', helperText: 'Email is required.', label: 'Email', placeholder: 'Please Enter Email' }} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  <FieldControl name="npi" render={InputText} meta={{ name: 'npi', value: 'npi', helperText: 'NPI is required', label: 'NPI', placeholder: 'Please Enter NPI' }} />
                                </Grid>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Stack className="inputs_fields_ratio" direction="row" gap={{ xs: 1.5, sm: 1.5, md: 1.5, lg: 1.5 }}>
                                <Grid item xs={12} sm={12} md={12} lg={9}>
                                  <FieldControl
                                    name="speciality"
                                    render={InputSelect}
                                    meta={{ name: 'speciality', value: getSpecialtyName(facilities[selectedFacilityIndex]?.Speciality), options: specialties, label: 'Specialty', placeholder: 'Please Enter Specialty', helperText: 'Specialty is required' }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={3}>
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
                                </Grid>
                              </Stack>
                            </Grid>
                          </Stack> */}
                        </form>
                      )}
                    />
                    <Stack className="setting_billing" direction="row" justifyContent="space-around" gap={5} mb={4} mt={4}>
                      <Grid item container xs={12} sm={12} md={12} lg={12}>
                        <Box className="exeasting gap_top personal_details">
                          <Typography className="heading">
                            <span className="profile_icon">
                              <img src={Billing} alt="Imprimis RX A Harrow Company" width={16} />
                            </span>
                            BILLING INFO
                          </Typography>
                          {facilityCard && facilityCard.length > 0 && (
                            <Typography component="h2" mt={3}>
                              Existing Cards
                            </Typography>
                          )}
                          {facilityCard &&
                            facilityCard.map((card: any, index: number) => {
                              return (
                                <Stack direction="row" alignItems="center" m={1} key={index}>
                                  <Typography variant="subtitle1" mr={2}>{`${card.type} - xx${card.lastFourDigits}`}</Typography>
                                  <Stack onClick={(e: React.SyntheticEvent) => handleDeleteCard(card.cardId, index)}>
                                    <img src={deleteIcon} alt="Imprimis RX A Harrow Company" width={16} />
                                  </Stack>
                                </Stack>
                              );
                            })}
                        </Box>
                        <Box className="add_new_cart">
                          <button className="edit_btn" style={{ color: '#00ACBA', fontSize: '20px', fontWeight: '700', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', height: '46px', width: '198px', textTransform: 'capitalize' }} onClick={handleNewCard}>
                            Add New Card
                          </button>
                        </Box>
                      </Grid>
                    </Stack>
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
