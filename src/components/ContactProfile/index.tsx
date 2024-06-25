import { Box, Button, Container, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

import { AUTH_DOCTOR_PORTAL, GET_PATIENT_CARDS, DELETE_PATIENT_CARD } from '../../constants/Endpoints';
import Doctor from '../../constants/grx-api';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { AddNewCard } from '../popup/AddNewCard';
import Add_white from '../../assets/icons/add_white.svg';
import Back from '../../assets/icons/back.svg';
import { BootstrapDialog } from '../../core/tables/tableStyles';
import Edit from '../../assets/icons/edit.svg';
import { PatientInterface } from '../../interfaces/patient';
import userSvg from '../../assets/icons/user.svg';
import Volate from '../../assets/icons/volate.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';
import { AddMedication } from '../popup/AddMedication';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addNewCardForm } from '../../services/pages/popup-form/AddNewCardForm.service';
import { Order } from '../../models/Order';
import { useAppSelector } from '../../store';
import { patientActions } from '../../store/Actions';
import { useAppDispatch } from '../../store';
import { User } from '../../models/User';

const ContactProfile = (props: { profile: PatientInterface; handleProfile: (check: boolean) => void }) => {
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state) => state.profileReducer.user);

  type card = {
    billingAddress: {};
    cardId: string;
    default: boolean;
    expiration: string;
    lastFourDigits: string;
    type: string;
  };

  const cards: card[] = useAppSelector((state) => state.patientReducer.patientCards);

  const [order, setOrder] = useState<Order>();

  const router = useNavigate();
  const [data, setData] = useState({
    card: false,
    prescription: false,
    address: false,
    edit: false,
    addPrescriber: false,
    accountId: ''
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
    setData((oldData) => ({
      ...oldData,
      card: false,
      prescription: false,
      address: false,
      edit: false,
      addPrescriber: false,
      accountId: ''
    }));
  };

  const handleCardClose = () => {
    getCards(props?.profile?.pat_id);
    handleClose();
  };

  const handlePrescription = () => {
    let newOrder = {
      billTo: {
        type: '',
        value: ''
      },
      shipTo: {
        type: '',
        value: ''
      },
      comment: '',
      credit_card: '',
      needByDate: '',
      selectPrescriber: '',
      selectedPrescriberName: '',
      npi: '',
      blocks: [
        {
          patients: [props.profile],
          prescriptions: []
        }
      ]
    };
    setOrder(newOrder);
    setData((oldData) => ({
      ...oldData,
      prescription: true,
      accountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
    }));
  };

  const handleBack = () => {
    router('/home/patient');
  };

  const gotoEditProfile = () => {
    props.handleProfile(true);
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
  return (
    <>
      {data.card && (
        <BootstrapDialog onClose={handleCardClose} open={data.card} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddNewCard handleClose={handleCardClose} />
        </BootstrapDialog>
      )}
      {data.prescription && (
        <BootstrapDialog onClose={handleClose} open={data.prescription} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: ' 40%', maxWidth: 650 } }}>
          <AddMedication handleClose={handleClose} order={order} accountId={data.accountId} />
        </BootstrapDialog>
      )}
      <Box className="contact_profile">
        <Container maxWidth="xl">
          <Stack className="Contact_img" display="flex" alignItems="center" justifyContent="center">
            <Box className="tw_icon_out">
              <span className="tw_icon">
                {props.profile?.fname.slice(0, 1)}
                {props.profile?.lname.slice(0, 1)}
              </span>
              {props.profile?.fname} {props.profile?.lname}
            </Box>
          </Stack>
          <Grid container spacing={2}>
            <Grid item className="details_box details_border" sm={12} md={12} lg={7} p="0">
              <Box className="personal_details" mb={4}>
                <Typography className="heading">
                  <span className="profile_icon">
                    <img src={userSvg} alt="Imprimis RX A Harrow Company" width={16} />
                  </span>
                  PERSONAL INFO
                </Typography>
              </Box>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">Mobile Phone</Box>
                <Box className="info_contact">
                  {props.profile?.area_code.trim() === '' ? '' : `(${props.profile?.area_code})`} {props.profile?.phone_no.trim().replace(/(\d{3})(\d{4})$/, '$1-$2')}
                </Box>
              </Stack>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">Email</Box>
                <Box className="info_contact">{props.profile?.email === 'null' ? '' : props.profile?.email}</Box>
              </Stack>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">DOB</Box>
                <Box className="info_contact">{moment.utc(props.profile?.birth_date).format('MM-DD-YYYY')}</Box>
              </Stack>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">Gender</Box>
                <Box className="info_contact">{props.profile?.gender_cd}</Box>
              </Stack>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">Shipping Address</Box>
                <Box className="info_contact long">
                  {props.profile?.addr1 !== 'null' ? props.profile?.addr1 : ''} {props.profile?.addr2 !== 'null' ? props.profile?.addr2 : ''} {props.profile?.state_cd !== 'null' ? props.profile?.state_cd : ''} {props.profile?.zip !== 'null' ? props.profile?.zip : ''}
                </Box>
              </Stack>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">Allergies</Box>
                <Box className="info_contact long">
                  {props?.profile?.allergies?.map((allergy: any) => {
                    return (
                      <span>
                        {allergy?.name}
                        <br />
                      </span>
                    );
                  })}
                </Box>
              </Stack>
              <Stack className="contact" direction="row" alignItems="center">
                <Box className="contact_side">Blue View Vision Patient</Box>
                <Box className="info_contact long">{props?.profile?.active_yn === 1 ? 'Yes' : 'No'}</Box>
              </Stack>
            </Grid>
            <Grid item className="details_box" xs={12} sm={12} md={12} lg={5} p="0" style={{ padding: 0 }}>
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
                  <Box className="exeasting gap_top">
                    {cards && <Typography component="h2">Existing Cards</Typography>}
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
              <Button className="contact_btn" variant="contained" onClick={handlePrescription} style={{ fontSize: '17px', height: '49', width: '212', fontWeight: '600', backgroundColor: '#00ACBA', border: '1px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize' }}>
                {' '}
                <Box mr={1}>
                  <img src={Add_white} alt="input_icon" width={15} />
                </Box>{' '}
                Add Prescription
              </Button>
            </li>
            <li>
              <Button
                className="contact_btn"
                variant="outlined"
                style={{ color: '#00ACBA', fontSize: '17px', height: '49', width: '212', fontWeight: '600', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize' }}
                onClick={gotoEditProfile}
              >
                {' '}
                <Box mr={1}>
                  <img src={Edit} alt="input_icon" width={15} />
                </Box>{' '}
                Edit Info
              </Button>
            </li>
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default ContactProfile;
