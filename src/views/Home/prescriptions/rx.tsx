import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { AddPescription } from '../../../components/popup/AddPescription';
import Back from '../../../assets/icons/back_arrow.svg';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Header from '../../../components/header/header';
import Order from '../../../assets/icons/order.svg';
import Paper from '@mui/material/Paper';
import Pdf from '../../../assets/icons/view-pdf.svg';
import PrimaryButton from '../../../core/buttons/primary-button';
import Product from '../../../assets/icons/table_product.svg';
import Rx from '../../../assets/icons/RX.svg';
import Rx_icon from '../../../assets/icons/rx_icon.svg';
import SecondaryButton from '../../../core/buttons/secondary-button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import User from '../../../assets/icons/user.svg';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

function createData(id: number, name: string, calories: number, carbs: number, protein: number) {
  return { id, name, calories, carbs, protein };
}

const rows = [createData(1, 'ggg', 6.0, 24, 4.0), createData(2, 'ggg', 6.0, 24, 4.0)];
const patients = [createData(1, 'ggg', 6.0, 24, 4.0)];

export default function RxPage() {
  const router = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [prescription, setPrescription] = useState(false);

  const handlePrescriptionHistory = () => {
    router('/home/prescriptions');
  };
  const handlePrescription = () => {
    setPrescription(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPrescription(false);
  };

  return (
    <>
      {open && (
        <BootstrapDialog onClose={handleClose} open={open} PaperProps={{ style: { minHeight: '95%', maxHeight: '90%', minWidth: '95%', maxWidth: '95%' } }}>
          <AddNewPatient handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {prescription && (
        <BootstrapDialog onClose={handleClose} open={prescription} PaperProps={{ style: { minHeight: '95%', maxHeight: '90%', minWidth: '95%', maxWidth: '95%' } }}>
          <AddPescription handleClose={handleClose} />
        </BootstrapDialog>
      )}
      <Stack component="main" className="default-layout">
        <Header />
        <Box>
          <Box component="main" className="genral_order">
            <Box className="main-content-wrapper-full">
              <Container maxWidth="xl">
                <Box className="main-box">
                  <Container maxWidth="xl">
                    {/*------ ORDER GENTRAL TOP BACK ------*/}
                    <Box className="genral_top" onClick={handlePrescriptionHistory}>
                      <span className="back_arrow">
                        <img src={Back} alt="Imprimis RX A Harrow Company" />
                      </span>
                      Back to Prescription History
                    </Box>
                    {/*------ ORDER GENTRAL MAIN ------*/}
                    <Box className="order_general">
                      <Stack direction="row">
                        <Grid container>
                          <Grid xs={12} sm={12} md={12} lg={6}>
                            <Box className="rx_img">
                              <img src={Rx} alt="Imprimis RX A Harrow Company" />
                            </Box>
                          </Grid>
                          <Grid xs={12} sm={12} md={12} lg={6}>
                            <Box className="order_general_info">
                              <Box className="personal_details">
                                <Typography className="heading">
                                  <span className="profile_icon">
                                    <img src={Order} alt="Imprimis RX A Harrow Company" width={16} />
                                  </span>
                                  Order General Info
                                </Typography>
                              </Box>
                              <Stack direction="row">
                                <Grid container className="prescribe">
                                  <Grid xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi">
                                      <Typography component="h3">
                                        Prescriber:<br></br>
                                        <span>Alonso Woodman</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi">
                                      <Typography component="h3">
                                        NPI:<br></br>
                                        <span>45876585</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Stack>
                              <Stack direction="row">
                                <Grid container className="prescribe prescribe_bottom">
                                  <Grid xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi order_npi_border">
                                      <Typography component="h3">
                                        order No. <br></br>
                                        <span>0001254854875</span>
                                      </Typography>
                                    </Box>
                                    <Box className="tracking_npi order_npi_border">
                                      <Typography component="h3">
                                        Tracking No. <br></br>
                                        <span>0005878554887</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi">
                                      <Typography component="h3">
                                        Ship/Bill To: <br></br>
                                        <span>Patient/Patient</span>
                                      </Typography>
                                    </Box>
                                    <Box className="tracking_npi">
                                      <Typography component="h3">
                                        Date Issued: <br></br>
                                        <span>11/20/2021</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Stack>
                            </Box>
                          </Grid>
                        </Grid>
                      </Stack>
                      <Box className="personal_details">
                        <Typography component="h1">
                          <span className="profile_icon">
                            <img src={User} alt="Imprimis RX A Harrow Company" width={16} />
                          </span>
                          patient details
                        </Typography>
                      </Box>
                      <TableContainer component={Paper} className="table_customizedrx">
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                          <TableHead className="table_head">
                            <TableRow>
                              <StyledTableCell>No</StyledTableCell>
                              <StyledTableCell>Name</StyledTableCell>
                              <StyledTableCell>Date of birth</StyledTableCell>
                              <StyledTableCell>Billing Information</StyledTableCell>
                              <StyledTableCell>Shipping Information</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className="table_body">
                            {patients.map((row) => (
                              <StyledTableRow key={row.name}>
                                <StyledTableCell component="td">
                                  {/* <Stack direction="row" alignItems="center">
                                                                        <span className="table_profile_image">TW</span>{" "}
                                                                        1
                                                                    </Stack> */}
                                  {row.id}
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>Theresa Woodman</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>02/05/1995</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>105 Rockcastle Dr, Murfreesboro, TN 37210</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>105 Rockcastle Dr, Murfreesboro, TN 37210</Stack>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box className="personal_details">
                        <Typography component="h1">
                          <span className="profile_icon">
                            <img src={Rx_icon} alt="Imprimis RX A Harrow Company" width={13} />
                          </span>
                          Medication Items
                        </Typography>
                      </Box>
                      <TableContainer component={Paper} className="table_customizedrx">
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                          <TableHead className="table_head">
                            <TableRow>
                              <StyledTableCell>No</StyledTableCell>
                              <StyledTableCell>presentation</StyledTableCell>
                              <StyledTableCell>Medication name</StyledTableCell>
                              <StyledTableCell>Dosing Instructions</StyledTableCell>
                              <StyledTableCell>medical necessity</StyledTableCell>
                              <StyledTableCell>quantity</StyledTableCell>
                              <StyledTableCell>Total Quantity</StyledTableCell>
                              <StyledTableCell>Refill</StyledTableCell>
                              <StyledTableCell>Price($)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className="table_body">
                            {rows.map((row) => (
                              <StyledTableRow key={row.name}>
                                <StyledTableCell component="td">
                                  <Stack>{row.id}</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td" onClick={handlePrescription} className="plusIcon table_product">
                                  <img src={Product} height={120} alt="logo" />
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>
                                    Tri-Moxi+™* 0.6mL - <br></br>
                                    Single Use Vial -<br></br>
                                    0.6mL -<br></br>
                                    15mg/1mg/mL
                                  </Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>
                                    ntravitreal injection<br></br>
                                    to be administered<br></br>
                                    by physician
                                  </Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack>
                                    No commercially<br></br>
                                    available product.
                                  </Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack className="table_text_center">1 Vial (0.6mL)</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack className="table_text_center">1</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack className="table_text_center">1</Stack>
                                </StyledTableCell>
                                <StyledTableCell component="td">
                                  <Stack className="table_text_center">$25.5</Stack>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Stack className="qty_box_outer" alignItems="flex-end">
                        <Box className="qty_box">
                          <Box className="order">Order Quantity: 2</Box>
                          <Box className="order_pipe">|</Box>
                          <Box className="total">Block Total: $51.00</Box>
                        </Box>
                      </Stack>
                      <Stack className="qty_box_outer" alignItems="flex-end">
                        <Box className="qty_box genral_total">
                          <Box className="order genral_total_order">Grand Total: $51.00</Box>
                        </Box>
                      </Stack>
                      <Box className="re_order">
                        <ul>
                          <li>
                            <SecondaryButton label="Back to Prescription History"></SecondaryButton>
                          </li>
                          <li>
                            <PrimaryButton label="Re-order Rx"></PrimaryButton>
                          </li>
                          <li>
                            <Button className="contact_btn" variant="contained" style={{ fontSize: '17px', height: '46px', width: '218px', fontWeight: '600', backgroundColor: '#00ACBA', border: '1px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize' }}>
                              View PDF{' '}
                              <Box ml={1}>
                                <img src={Pdf} alt="input_icon" width={15} />
                              </Box>
                            </Button>
                          </li>
                        </ul>
                      </Box>
                    </Box>
                  </Container>
                  <Box className="chat-floating-icon">
                    <img src={Chat} alt="logo" height={50} width={50} />
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
