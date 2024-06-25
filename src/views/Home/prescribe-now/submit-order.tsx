import { Box, Container, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { AddPescription } from '../../../components/popup/AddPescription';
import { AxiosResponse } from 'axios';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import { GET_ORDER_DETAIL } from '../../../constants/Endpoints';
import Header from '../../../components/header/header';
import { Modal } from '../../../components/popup/Modal';
import NotePad from '../../../assets/icons/notePad.svg';
import { OrderInterface } from '../../../interfaces/order';
import PrimaryButton from '../../../core/buttons/primary-button';
import SecondaryButton from '../../../core/buttons/secondary-button';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const OrderSubmitPage = () => {
  const params = useParams();
  const router = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [prescription, setPrescription] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [order, setOrder] = useState<OrderInterface | null>(null);

  const handleCancelOrder = () => {
    router('/home/dashboard');
  };
  const handleBackToDashboard = () => {
    router('/home/dashboard');
  };
  const handleCreatePrescription = () => {
    router('/home/prescribe-now');
  };
  const handleOrderDetail = () => {
    router(`/home/prescriptions/order/${params?.id?.split('-')[0]}`);
  };

  const handleClose = () => {
    setOpen(false);
    setPrescription(false);
    setConfirmOrder(false);
  };

  return (
    <>
      {open && (
        <BootstrapDialog
          onClose={handleClose}
          open={open}
          PaperProps={{
            style: {
              minHeight: '95%',
              maxHeight: '90%',
              minWidth: '95%',
              maxWidth: '95%'
            }
          }}
        >
          <AddNewPatient handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {prescription && (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={prescription}
          PaperProps={{
            style: {
              minHeight: '95%',
              maxHeight: '90%',
              minWidth: '95%',
              maxWidth: '95%'
            }
          }}
        >
          <AddPescription handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {confirmOrder && (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-titles"
          open={confirmOrder}
          PaperProps={{
            style: {
              minHeight: 276,
              maxHeight: '50%',
              minWidth: '40%',
              maxWidth: 676
            }
          }}
        >
          <Modal handleClose={handleClose} handleCancelOrder={handleCancelOrder} />
        </BootstrapDialog>
      )}
      <Stack component="main" className="default-layout">
        <Header />
        <Box>
          <Box component="main" className="genral_order">
            <Box className="main-content-wrapper-full">
              <Container maxWidth="xl">
                <Box className="main-box">
                  <Box className="prescription_heading">Prescription Ordering</Box>

                  <Box className="orderline_box_new">
                    <Box className="order_fill_new">
                      <Box className="order_fill_right"></Box>
                      <Box className="order_fill_rightr"></Box>
                    </Box>
                    <Box className="order_fill_new">
                      <Box className="order_fill_right"></Box>
                      <Box className="order_fill_rightr"></Box>
                    </Box>
                    <Box className="order_fill_new">
                      <Box className="order_fill_right"></Box>
                      <Box className="order_fill_rightr"></Box>
                    </Box>
                    {/* <Box className="order order_fill"></Box>
                    <Box className="order"></Box> */}
                    <Box className="order_line "></Box>
                  </Box>
                  <Box className="order_location_new">
                    <Box className="location start">
                      Build<br></br>Order
                    </Box>
                    <Box className="location">
                      Review<br></br>Order
                    </Box>
                    <Box className="location end">
                      Send to<br></br>Pharmacy
                    </Box>
                  </Box>
                  <Container maxWidth="xl">
                    {/*------ ORDER GENTRAL MAIN ------*/}
                    <Box className="order_general_submit order_general">
                      <Stack direction="row" flexDirection="column">
                        <Box className="submit-order-notes">
                          <img src={NotePad} alt="Imprimis RX A Harrow Company" />
                        </Box>
                        <Box className="order_npi">
                          {/* <Typography component="h3"> */}
                          <div className="thanks_heading">
                            <span>Thanks for submitting your order.</span>
                          </div>
                          <div className="order_number_heading">
                            Your order Id. <span style={{ color: '#00ACBA' }}>{params?.id?.split('-')[1]}</span> will be processed and sent to the pharmacy
                          </div>
                          {/* </Typography> */}
                        </Box>
                      </Stack>

                      <Box className="re_order_new">
                        <ul>
                          <li>
                            <SecondaryButton label="Go Back to Dashboard " onClick={handleBackToDashboard}></SecondaryButton>
                          </li>
                          <li>
                            <PrimaryButton label="Create New Prescription" onClick={handleCreatePrescription}></PrimaryButton>
                          </li>
                          <li>
                            <PrimaryButton label="View Order Details" onClick={handleOrderDetail}></PrimaryButton>
                          </li>
                        </ul>
                      </Box>
                    </Box>
                  </Container>
                  <Box className="chat-floating-icon">
                    <img src={Chat} alt="logo" height={65} width={65} />
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default OrderSubmitPage;
