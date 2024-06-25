import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate, useParams } from 'react-router-dom';

import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { AddPescription } from '../../../components/popup/AddPescription';
import { AxiosResponse } from 'axios';
import Back from '../../../assets/icons/back_arrow.svg';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import { GET_ORDER_DETAIL } from '../../../constants/Endpoints';
import Header from '../../../components/header/header';
import Order from '../../../assets/icons/order.svg';
import { OrderInterface } from '../../../interfaces/order';
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
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useAppSelector, RootState } from '../../../store';
import { PatientInterface } from '../../../interfaces/patient';
import { Block } from '../../../models/Order';
import { PrescriptionInterface } from '../../../interfaces/prescription';
import { Medication } from '../../../models/Medication';

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

const ViewOrderPage = () => {
  const params = useParams();
  const router = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [prescription, setPrescription] = useState(false);
  const [order, setOrder] = useState<OrderInterface | null>(null);
  const ViewOrderData = useAppSelector((state: RootState) => state.prescriptionReducer.reviewOrder);
  const [viewOrder, setViewOrder] = useState<any>([]);
  const handlePrescription = () => {
    setPrescription(true);
  };
  useEffect(() => {
    console.log(ViewOrderData, 'viewOrderData');
    const data: string | null = localStorage.getItem('order');
    if (data) {
      let newData = JSON.parse(data);
      setViewOrder(newData);
    }
  }, []);
  const handlePrescriptionHistory = () => {
    router('/home/prescriptions');
  };

  const handleClose = () => {
    setOpen(false);
    setPrescription(false);
  };

  const getOrderDetail = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(GET_ORDER_DETAIL, {
        params: { orderId: params.id }
      });
      if (res.data) {
        setOrder(res.data[0] as OrderInterface);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

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
      <Stack component="main" className="default-layout">
        <Header />
        <Box>
          <Box component="main" className="genral_order">
            <Box className="main-content-wrapper-full">
              <Container maxWidth="xl">
                <Box className="main-box">
                  <Container maxWidth="xl">
                    {/*------ ORDER GENTRAL MAIN ------*/}
                    <Box className="order_general">
                      <Stack direction="row">
                        <Grid container>
                          <Grid item xs={12} sm={12} md={12} lg={5}>
                            <Box className="rx_img">
                              <img src={Rx} alt="Imprimis RX A Harrow Company" />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={7}>
                            <Box className="order_general_info">
                              <Box className="personal_details">
                                <Typography className="heading">
                                  <span className="profile_icon">
                                    <img src={Order} alt="Imprimis RX A Harrow Company" width={16} />
                                  </span>
                                  <span className="profile_icon_heading">Order General Info</span>
                                </Typography>
                              </Box>
                              <Stack direction="row">
                                <Grid container className="prescribe">
                                  <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi">
                                      <Typography component="h3">
                                        Prescriber:<br></br>
                                        <span>{order?.md_first_name && order?.md_last_name ? order?.md_first_name + ' ' + order?.md_last_name : 'Alonso Woodman'}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi_last">
                                      <Typography component="h3">
                                        NPI:<br></br>
                                        <span>{order?.md_npi ? order?.md_npi : '45876585'}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Stack>
                              <Stack direction="row">
                                <Grid container className="prescribe prescribe_bottom">
                                  <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi order_npi_border">
                                      <Typography component="h3">
                                        order No. <br></br>
                                        <span>{order?.order_id ? order?.order_id : '0001254854875'}</span>
                                      </Typography>
                                    </Box>
                                    <Box className="order_npi order_npi_border">
                                      <Typography component="h3">
                                        Tracking No. <br></br>
                                        <span>{order?.tracking_code ? order?.tracking_code : '0005878554887'}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi_last">
                                      <Typography component="h3">
                                        Ship/Bill To: <br></br>
                                        <span>
                                          {viewOrder?.shipTo?.type} {'/'} {viewOrder?.billTo?.type}
                                        </span>
                                      </Typography>
                                    </Box>
                                    <Box className="order_npi_last">
                                      <Typography component="h3">
                                        Date Issued: <br></br>
                                        <span>{moment(viewOrder?.needByDate).format('MM/DD/YYYY')}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Stack>
                            </Box>
                          </Grid>
                        </Grid>
                      </Stack>
                      {viewOrder &&
                        viewOrder?.blocks &&
                        viewOrder?.blocks.map((item: Block, index: number) => {
                          return (
                            <Stack>
                              <Box className="prescription prescription_top">
                                <Box className="prescription_in">Prescription regimen 1</Box>
                              </Box>
                              <Box className="personal_details personal_details_top ">
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
                                    {item?.patients &&
                                      item?.patients.map((data: PatientInterface, index: number) => {
                                        return (
                                          <StyledTableRow key={index}>
                                            <StyledTableCell component="td">{index + 1}</StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>{data?.pt_name}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>{moment.utc(data?.birth_date).format('MM/DD/YYYY')}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>
                                                {order?.addr1} {order?.city} {order?.state_cd} {order?.zip}
                                              </Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>
                                                {order?.addr1} {order?.city} {order?.state_cd} {order?.zip}
                                              </Stack>
                                            </StyledTableCell>
                                          </StyledTableRow>
                                        );
                                      })}

                                    {(!item?.patients || item?.patients.length === 0) && (
                                      <StyledTableRow>
                                        <StyledTableCell component="td" className="NoDataFound">
                                          <Stack>Oops!...Order Not Found.</Stack>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    )}
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
                                    {item.prescriptions &&
                                      item?.prescriptions?.map((data: Medication, index: number) => {
                                        return (
                                          <StyledTableRow key={index}>
                                            <StyledTableCell component="td">
                                              <Stack>{index + 1}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td" onClick={handlePrescription} className="plusIcon table_product">
                                              <img src={data?.selectedMedication?.icon} height={120} alt="logo" />
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>{data?.selectedMedication?.medicationName}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>{data?.choose_dosing_instruction}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack>{data?.choose_medical_necessity}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack className="table_text_center">{data?.quantity}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack className="table_text_center">{data?.quantity}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack className="table_text_center">{data?.refills}</Stack>
                                            </StyledTableCell>
                                            <StyledTableCell component="td">
                                              <Stack className="table_text_center">${data?.price}</Stack>
                                            </StyledTableCell>
                                          </StyledTableRow>
                                        );
                                      })}

                                    {(!item.prescriptions || item.prescriptions.length === 0) && (
                                      <StyledTableRow>
                                        <StyledTableCell component="td" className="NoDataFound">
                                          <Stack>Oops!...Order Not Found.</Stack>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Stack className="qty_box_outer" alignItems="flex-end">
                                <Box className="qty_box">
                                  <Box className="order">Order Quantity: {order?.written_qty}</Box>
                                  <Box className="order_pipe">|</Box>
                                  <Box className="total">Block Total: ${Number(order?.rx_price) * Number(order?.written_qty)}</Box>
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
                                    <SecondaryButton label="Back to Prescription History" onClick={handlePrescriptionHistory}></SecondaryButton>
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
                            </Stack>
                          );
                        })}
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

export default ViewOrderPage;
