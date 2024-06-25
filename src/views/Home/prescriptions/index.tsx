import { Box, Container, Stack } from '@mui/material';
import React, { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';

import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { AxiosResponse } from 'axios';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import { GET_PRESCRIPTION_HISTORY } from '../../../constants/Endpoints';
import Header from '../../../components/header/header';
import Prescribe from '../../../assets/icons/prescribe_icon.svg';
import { PrescriptionHistoryTable } from '../../../components/tables/PrescriptionHistoryTable';
import { PrescriptionInterface } from '../../../interfaces/prescription';
import SearchBar from '../../../components/search-bar';
import { User } from '../../../models/User';
import { prescriptionActions } from '../../../store/Actions';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../components/footer/footer';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export default function PrescriptionPage() {
  const router = useNavigate();
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state) => state.profileReducer.user);
  const prescriptionData = useAppSelector((state) => state.prescriptionReducer.prescription);

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const setValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePrescribeDetail = () => {
    router('/home/prescribe-now');
  };

  const handleClose = () => {
    setOpen(false);
  };

  // recent orders
  useEffect(() => {
    if (user) {
      getPrescriptionHistory();
    }
  }, [user]);

  const getPrescriptionHistory = async () => {
    try {
      let mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      const res: AxiosResponse = await Doctor.get(GET_PRESCRIPTION_HISTORY, { params: { md_id: mdId } });
      dispatch(prescriptionActions.setPrescriptionHistory(res.data));
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // prevent the user to access patient page if account is not approved
  useEffect(() => {
    if (!user.isApproved) {
      alert('Requested page will be visible, after your account is approved');
      router('/home/dashboard');
    }
  }, []);

  return (
    <>
      {open && (
        <BootstrapDialog onClose={handleClose} open={open} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '75%', maxWidth: 1298 } }}>
          <AddNewPatient handleClose={handleClose} />
        </BootstrapDialog>
      )}
      <Stack component="main" className="default-layout">
        <Header />
        <Box>
          <Container maxWidth="xl">
            <Box component="main" className="patient-page">
              <Box className="main-content-wrapper-full">
                <Box className="main-box prescriptions_main">
                  <Container maxWidth="xl">
                    {user?.type === 'Staff' ? <Box className="heading_top">{`Prescription History For ${user?.activePrescriber?.firstName} ${user?.activePrescriber?.lastName}`}</Box> : <Box className="heading_top">Prescription History</Box>}

                    {user.isApproved && (
                      <>
                        <SearchBar value={search} setValue={setValue} />

                        <Box className="recent-order-table-layout">
                          {prescriptionData && (
                            <PrescriptionHistoryTable
                              data={prescriptionData?.filter((item: PrescriptionInterface) => {
                                return (search.length > 0 && (item.Rx_Number + ' ' + item.Order_id + ' ' + item.Patient_Name + ' ' + item.Prescriber_Name + ' ' + item.Medication).toLowerCase().includes(search.toLowerCase())) || search.length === 0;
                              })}
                            />
                          )}
                        </Box>
                      </>
                    )}
                  </Container>
                </Box>
              </Box>
            </Box>
          </Container>
          <Box className="chat-floating-icon">
            <img src={Chat} alt="logo" height={65} width={65} />
          </Box>
          <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
            <img src={Prescribe} alt="logo" height={100} width={180} />
          </Box>
        </Box>
      </Stack>
      <Footer />
    </>
  );
}
