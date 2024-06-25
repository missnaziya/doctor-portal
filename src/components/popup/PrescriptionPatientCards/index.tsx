import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { BootstrapDialog } from '../../../core/tables/tableStyles';
import { Box, Button, Container, DialogContent, DialogTitle, IconButton, Grid, Stack, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';
import CloseIcon from '@mui/icons-material/Close';
import { addPrescribeFacilityCardForm } from '../../../services/pages/popup-form/AddPrescribeFacilityCardForm.service';
import { GET_PATIENT_CARDS, DELETE_PATIENT_CARD } from '../../../constants/Endpoints';
import Volate from '../../../assets/icons/volate.svg';
import deleteIcon from '../../../assets/icons/deleteIcon.svg';
import Doctor from '../../../constants/grx-api';
import { toast } from 'react-toastify';
import { addNewCardForm } from '../../../services/pages/popup-form/AddNewCardForm.service';
import { AddPrescriptionFacilityCard } from '../AddPrescriptionFacilityCard';
import { AddNewCard } from '../AddNewCard';

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export const PrescriptionPatientCards = (props: {
  handleClose: (data?: { cardId: string; expiration: string; lastFourDigits: string; type: string; zip: string; patientId: number; blockIndex: number }) => void;
  patientId: number | undefined;
  addr1: string | undefined;
  addr2: string | undefined;
  city: string | undefined;
  state: string | undefined;
  blockIndex: number | undefined;
}) => {
  type Card = {
    lastFourDigits: string;
    expiration: string;
    cardId: string;
    default: boolean;
    billingAddress: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      zipCode: string;
    };
    type: string;
  };

  const [patientCards, setPatientcards] = useState<Card[]>([]);
  const [openAddPatientCardPopUp, setOpenAddPatientCardPopUp] = useState<boolean>(false);

  const handleAddPatientCardPopup = async (data?: any) => {
    addPrescribeFacilityCardForm.reset();
    addNewCardForm.patchValue({
      pat_id: props?.patientId,
      street: props?.addr1,
      city: props?.city,
      state: props?.state
    });
    setOpenAddPatientCardPopUp(true);
  };

  const handleAddPatientCardCallback = async () => {
    getPatientCards(props?.patientId);
    setOpenAddPatientCardPopUp(false);
  };

  const onSelectPatientCard = async (cardId: string) => {
    const cardObject = patientCards.find((card: Card) => card.cardId === cardId);
    if (cardObject) {
      props.handleClose({
        patientId: props?.patientId as number,
        cardId: cardObject?.cardId,
        expiration: cardObject?.expiration,
        lastFourDigits: cardObject?.lastFourDigits,
        type: cardObject?.type,
        zip: cardObject?.billingAddress?.zipCode,
        blockIndex: props?.blockIndex as number
      });
    }
  };

  const getPatientCards = async (patientId: number | undefined) => {
    try {
      const res: AxiosResponse = await Doctor.get(`${GET_PATIENT_CARDS}/${patientId}`);
      if (res.status === 200 && Array.isArray(res.data)) {
        setPatientcards(res.data as Card[]);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const res: AxiosResponse = await Doctor.delete(`${DELETE_PATIENT_CARD}/${cardId}/${props.patientId}`);
      if (res.status === 200) {
        getPatientCards(props.patientId);
        toast('Card deleted successfully');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    getPatientCards(props?.patientId);
  }, [props?.patientId]);

  return (
    <>
      {openAddPatientCardPopUp && (
        <BootstrapDialog onClose={() => handleAddPatientCardCallback} open={openAddPatientCardPopUp} PaperProps={{ style: { minHeight: '60%', maxHeight: '79%', minWidth: '40%', maxWidth: 780 } }}>
          <AddNewCard handleClose={handleAddPatientCardCallback} />
        </BootstrapDialog>
      )}
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => props.handleClose()}></BootstrapDialogTitle>
      <DialogContent dividers className="popup_content">
        <Box component="main" className="card-info">
          <Container maxWidth="lg">
            <Box className="main-box">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Stack className="modal_heading_main " direction="row" justifyContent="center" alignItems="center">
                  <Box className="personal_details heading_bottom_without_border" mb={2}>
                    <Typography className="heading" display="flex">
                      <span className="profile_icon">
                        <img src={Volate} alt="Imprimis RX A Harrow Company" width={16} />
                      </span>
                      BILLING INFO
                    </Typography>
                  </Box>
                  {/* <Typography className="heading_bottom_without_border">Select Card</Typography> */}
                </Stack>
                <Grid item className="details_box" xs={12} sm={12} md={12} lg={5} p="0" style={{ padding: 0 }}>
                  <Box className="payment payment_prescriber">
                    <Stack direction="row" justifyContent="flex-start" alignItems="center" className="top_alignment">
                      <Box className="exeasting gap_top" sx={{ width: '100%' }}>
                        {patientCards && (
                          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'top' }}>
                            <Typography component="h2" style={{ fontWeight: 600, fontSize: '18px', color: 'rgba(38, 50, 56, 0.7)' }}>
                              Existing Cards
                            </Typography>
                            <Box className="add_new_cart gap_top" display="flex" alignItems="center" justifyContent="end">
                              <button
                                className="edit_btn"
                                onClick={handleAddPatientCardPopup}
                                style={{ color: '#00ACBA', fontSize: '18px', fontWeight: '700', backgroundColor: '#fff', border: '2px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', height: '46px', width: '198', textTransform: 'capitalize', cursor: 'pointer' }}
                              >
                                Add New Card
                              </button>
                            </Box>
                          </Box>
                        )}
                        <FormControl>
                          <RadioGroup className="radio_grid" aria-labelledby="demo-customized-radios" name="customized-radios" onChange={(e) => onSelectPatientCard(e?.target?.value)}>
                            {patientCards.length > 0 ? (
                              patientCards.map((card: Card, index: number) => (
                                <Stack direction="row" alignItems="center" key={index}>
                                  <FormControlLabel value={card?.cardId} control={<Radio />} label={`${card?.type} - xx${card?.lastFourDigits}`} />
                                  <Stack onClick={() => handleDeleteCard(card?.cardId)}>
                                    <img src={deleteIcon} alt="Imprimis RX A Harrow Company" width={16} />
                                  </Stack>
                                </Stack>
                              ))
                            ) : (
                              <Stack>
                                <Typography variant="h6"> No billing data available </Typography>
                              </Stack>
                            )}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Box>
      </DialogContent>
    </>
  );
};
