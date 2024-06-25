import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { CREATE_ORDER, GET_ORDER_DETAIL, GET_AR_GROUPS } from '../../../constants/Endpoints';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import React, { useEffect, useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate, useParams } from 'react-router-dom';

import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { AddPescription } from '../../../components/popup/AddPescription';
import { AxiosResponse } from 'axios';
import { Block } from '../../../models/Order';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import Header from '../../../components/header/header';
import { Order } from '../../../models/Order';
import { InputText } from '../../../core/forms/inputs/InputText';
import { Medication } from '../../../models/Medication';
import { Modal } from '../../../components/popup/Modal';
import OrderImage from '../../../assets/icons/order.svg';
import { OrderInterface } from '../../../interfaces/order';
import Paper from '@mui/material/Paper';
import { PatientInterface } from '../../../interfaces/patient';
import PrimaryButton from '../../../core/buttons/primary-button';
import Rx from '../../../assets/icons/RX.svg';
import Rx_icon from '../../../assets/icons/rx_icon.svg';
import SecondaryButton from '../../../core/buttons/secondary-button';
import SubmitRx from '../../../assets/icons/submit.svg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import UserIcon from '../../../assets/icons/user.svg';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../store';
import { useDispatch } from 'react-redux';
import { User } from '../../../models/User';
import { prescriptionActions } from '../../../store/Actions';

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
  [`&.${tableCellClasses.head}:first-child`]: {
    textAlign: 'left !important',
    paddingLeft: '30px !important'
  },
  [`&.${tableCellClasses.body}:first-child`]: {
    textAlign: 'left !important',
    paddingLeft: '30px !important'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const ReviewOrderPage = () => {
  const router = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [order, setOrder] = useState<OrderInterface | null>(null);
  const user: User = useAppSelector((state) => state.profileReducer.user);
  const reviewOrder: Order = useAppSelector((state) => state.prescriptionReducer.reviewOrder);
  const billing: any | undefined = useAppSelector((state) => state.prescriptionReducer.billing);
  const shipping: any | undefined = useAppSelector((state) => state.prescriptionReducer.shipping);
  const dispatch = useDispatch();

  console.log(billing, shipping);
  const handlePrescriptionHistory = () => {
    router('/home/prescribe-now');
  };
  const handleCancelOrder = () => {
    let resetOrder = {
      prescriber: '',
      billTo: { type: '', value: '' },
      shipTo: { type: '', value: '' },
      comment: '',
      credit_card: '',
      needByDate: '',
      selectPrescriber: '',
      selectedPrescriberName: '',
      npi: '',
      blocks: [{ patients: [], prescriptions: [] }]
    };
    dispatch(prescriptionActions.setPrescribeOrder(resetOrder));
    dispatch(prescriptionActions.setReviewOrder(resetOrder));
    dispatch(prescriptionActions.setShippingInfo({ data: {} }));
    dispatch(prescriptionActions.setBillingInfo({ data: {} }));
    handleClose();
    router('/home/dashboard');
  };

  const handleOrderConfirmation = () => {
    setCancelOrder(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCancelOrder(false);
  };

  // return structured date for create order, create pdf images
  const getStructureData = async (order: any) => {
    const blocks = [...order.blocks];
    let prescriptionArray: any = [];
    let commentStringArray: string[] = [];
    let commentString: string = '';
    let mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
    if (blocks.length > 0) {
      let blocks = reviewOrder.blocks;
      blocks.map((block: any) => {
        let patients = block?.patients;
        let prescriptions = block?.prescriptions;
        patients.map((patient: any) => {
          prescriptions.map((prescription: any) => {
            let newPriscriptionObj: any = {};
            newPriscriptionObj.pat_id = patient?.pat_id;
            newPriscriptionObj.blue_view = patient?.blue_view;
            newPriscriptionObj.item_id = prescription?.selectedMedication?.grxItemId;
            newPriscriptionObj.md_id = mdId;
            newPriscriptionObj.written_quantity = prescription?.quantity;
            newPriscriptionObj.written_quantity_label = prescription?.quantityLabel;
            newPriscriptionObj.refills_orig = prescription?.refills;
            newPriscriptionObj.refills_left = prescription?.refills;
            newPriscriptionObj.ndc = prescription?.selectedMedication?.ndc.replaceAll('-', '');
            newPriscriptionObj.sig_text = prescription?.choose_dosing_instruction;
            newPriscriptionObj.medicalNecessity = prescription?.choose_medical_necessity;
            newPriscriptionObj.otherClinicalDifference = prescription?.other_clinical_difference;
            newPriscriptionObj.comments = prescription?.comments;
            newPriscriptionObj.strength = prescription?.selectedMedication?.strength;
            // newPriscriptionObj.days_supply = prescription?.supply;

            prescriptionArray.push(newPriscriptionObj);
            return 1;
          });
          // pdf prescription data
          return 1;
        });
        if (order?.billTo?.type === 'patient' && order?.blocks[0].patients[0]?.active_yn === 1) {
          commentStringArray.push('Blue view patient');
        }
        return 1;
      });
      commentString = commentStringArray.join(',');
      return { prescriptionArray, commentString };
    }
  };

  const handleOrderSubmitConfirmation = async () => {
    try {
      let data: any = {
        acct_id: '',
        exp_date: '',
        bill_to: {
          type: '',
          value: ''
        },
        ship_to: {
          type: '',
          value: ''
        },
        comments: '',
        // credit_card: '',
        prescriptions: []
      };

      const { prescriptionArray, commentString }: any = await getStructureData(reviewOrder);

      // Get Ar group info
      const mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      const resArGroup: AxiosResponse = await Doctor.get(GET_AR_GROUPS, { params: { md_id: mdId } });
      if (resArGroup.status === 200 && Array.isArray(resArGroup.data)) {
        data.acct_id = reviewOrder?.billTo?.value;
      }
      // set exp_date
      data.exp_date = reviewOrder?.needByDate;
      // set bill_to
      data.bill_to = reviewOrder?.billTo;
      // set ship_to
      data.ship_to = reviewOrder?.shipTo;
      // set comment
      if (reviewOrder?.comment) {
        data.comments = reviewOrder?.comment + ',' + commentString;
      } else {
        data.comments = commentString;
      }
      // set prescription
      data.prescriptions = prescriptionArray;
      // set credit card info
      data.credit_card = reviewOrder?.credit_card !== '' ? reviewOrder?.credit_card : 'Not specified';

      const res: AxiosResponse = await Doctor.post(CREATE_ORDER, data);
      if (res.status === 201) {
        toast('Order Created Successfully');
        dispatch(
          prescriptionActions.setPrescribeOrder({
            billTo: { type: '', value: '' },
            shipTo: { type: '', value: '' },
            comment: '',
            credit_card: '',
            needByDate: '',
            selectPrescriber: '',
            blocks: [{ patients: [], prescriptions: [] }]
          })
        );
        dispatch(prescriptionActions.setShippingInfo({ data: {} }));
        dispatch(prescriptionActions.setBillingInfo({ data: {} }));

        router(`/home/prescribe-now/submit-order/${res?.data[0]?.order_id}-${res?.data[0]?.invoice_nbr}`);
        return true;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // console.log(reviewOrder, 'reviewOrder');

  const calculateTotalPrice = async () => {
    let blockPrices = 0;
    reviewOrder?.blocks.map((block: any) => {
      let patientlength = block?.patients?.length;
      let tempPrice = 0;
      block?.prescriptions.map((prescription: any) => {
        tempPrice += parseFloat(prescription?.price);
      });
      tempPrice = tempPrice * patientlength;
      blockPrices += tempPrice;
    });
    setTotalAmount(blockPrices);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, []);

  return (
    <>
      {cancelOrder && (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-titles"
          open={cancelOrder}
          className="modalOuter"
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
                    <Box className="order order_fill"></Box>
                    <Box className="order"></Box>
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
                                    <img src={OrderImage} alt="Imprimis RX A Harrow Company" width={16} />
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
                                        <span>{user && user.type === 'Staff' ? `${reviewOrder?.selectedPrescriberName}` : `${user?.firstName} ${user?.lastName}`}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Box className="order_npi_last">
                                      <Typography component="h3" style={{ lineHeight: '40px' }}>
                                        NPI:<br></br>
                                        <span>{user && user?.type === 'Staff' ? reviewOrder?.npi : user?.npi}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Stack>
                              <Stack direction="row">
                                <Grid container className="prescribe prescribe_bottom">
                                  <Grid item xs={8} sm={4} md={4} lg={4}>
                                    <Box className="order_npi order_npi_border">
                                      <Typography component="h3" style={{ paddingBottom: '10px' }}>
                                        Ship To: <br></br>
                                        <span>{reviewOrder?.shipTo?.type}</span>
                                      </Typography>
                                    </Box>
                                    <Box className="order_npi order_npi_border">
                                      <Typography component="h3">
                                        Bill To: <br></br>
                                        <span>{reviewOrder?.billTo?.type}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={6} lg={6} className="order_npi_last_box">
                                    <Box className="order_npi_last">
                                      <Typography component="h3" style={{ lineHeight: '40px' }}>
                                        Need by Date: <br></br>
                                        <span>{moment(reviewOrder?.needByDate).format('MM/DD/YYYY')}</span>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Stack>
                            </Box>
                          </Grid>
                        </Grid>
                      </Stack>

                      {/* -------------SHIP TO BILL TO ADDRESS----------- */}
                      <Grid container className="prescription_address">
                        <Grid item xs={5} sm={5} md={5} lg={5} style={{ justifyItems: 'center' }}>
                          <Box className="prescription_address_shipping">
                            <Typography component="h3">
                              Shipping: <br></br>
                              {Object.keys(shipping) && Object.values(shipping).length > 0 && (
                                <span>
                                  {shipping?.company ? shipping?.company : ''} {shipping?.company && <br></br>}
                                  {shipping?.addr1 ? shipping?.addr1 : ''} {shipping?.addr2 ? shipping?.addr2 : ''} <br></br>
                                  {shipping?.city ? shipping?.city : ''} {shipping?.state ? shipping?.state : ''} {shipping?.zip ? shipping?.zip : ''} <br></br>
                                </span>
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} lg={5} style={{ justifyItems: 'center' }}>
                          <Box className="prescription_address_billing">
                            <Typography component="h3">
                              Billing: <br></br>
                              {Object.keys(billing) && Object.values(billing).length > 0 && (
                                <span>
                                  {billing?.company ? billing?.company : ''} {billing?.company && <br></br>}
                                  {billing?.addr1 ? billing?.addr1 : ''} {billing?.addr2 ? billing?.addr2 : ''} <br></br>
                                  {billing?.city ? billing?.city : ''} {billing?.state ? billing?.state : ''} {billing?.zip ? billing?.zip : ''} <br></br>
                                </span>
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* ----------- PRESCRIPTION REGIMEN LIST --------- */}
                      {reviewOrder &&
                        reviewOrder?.blocks &&
                        reviewOrder?.blocks.map((item: Block, index: number) => (
                          <Stack sx={{ mb: 5 }}>
                            <Box className="prescription prescription_top">
                              <Box className="prescription_in">Prescription Block {index + 1}</Box>
                            </Box>
                            {/* ---------- PATIENT TABLE ---------- */}
                            <Box className="personal_details personal_details_top ">
                              <Typography component="h1">
                                <span className="profile_icon">
                                  <img src={UserIcon} alt="Imprimis RX A Harrow Company" width={16} />
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
                                    <StyledTableCell>Address</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody className="table_body">
                                  {item?.patients &&
                                    item?.patients.map((data: PatientInterface, index: number) => (
                                      <StyledTableRow key={index}>
                                        <StyledTableCell component="td">{index + 1}</StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack> {`${data?.fname} ${data?.lname}`}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack style={{ textAlign: 'center' }}>{moment.utc(data?.birth_date).format('MM/DD/YYYY')}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack> {data?.lastFourDigits ? `Card xxx - ${data?.lastFourDigits}` : 'No card on file'}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack>
                                            {data?.addr1} {data?.city} {data?.state_cd} {data?.zip}
                                          </Stack>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    ))}
                                  {(!item?.patients || item?.patients.length === 0) && (
                                    <StyledTableRow>
                                      <StyledTableCell component="td" className="NoDataFound">
                                        <Stack>Oops!...Patient Not Found.</Stack>
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            {/* --------- MEDICATION TABLE ---------- */}
                            <Box className="personal_details">
                              <Typography component="h1" sx={{ width: '100%' }}>
                                <span className="profile_icon">
                                  <img src={Rx_icon} alt="Imprimis RX A Harrow Company" width={13} />
                                </span>
                                Medication Details Per Patient
                              </Typography>
                            </Box>
                            <TableContainer component={Paper} className="table_customizedrx">
                              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead className="table_head">
                                  <TableRow>
                                    <StyledTableCell>No</StyledTableCell>
                                    <StyledTableCell>Image</StyledTableCell>
                                    <StyledTableCell>Medication name</StyledTableCell>
                                    <StyledTableCell>Dosing Instructions</StyledTableCell>
                                    <StyledTableCell>Medical necessity</StyledTableCell>
                                    <StyledTableCell>Quantity</StyledTableCell>
                                    <StyledTableCell>Refill</StyledTableCell>
                                    <StyledTableCell>Price($)</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody className="table_body_prescriber_order">
                                  {item.prescriptions &&
                                    item?.prescriptions?.map((data: any, index: number) => (
                                      <StyledTableRow key={index}>
                                        <StyledTableCell component="td">
                                          <Stack>{index + 1}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td" className="plusIcon table_product">
                                          <img src={`https://www.imprimisrx.com/s/sfsites/c/cms/delivery/media/${data?.selectedMedication?.contentKey}`} height={120} alt="logo" />
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack>{data?.selectedMedication?.shortName}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack>{data?.choose_dosing_instruction}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack>{data?.choose_medical_necessity}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack className="table_text_center">{data?.quantityLabel.replace(/Ml/gi, 'ML')}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td">
                                          <Stack className="table_text_center">{data?.refills}</Stack>
                                        </StyledTableCell>
                                        <StyledTableCell component="td" sx={{ p: 'auto' }}>
                                          <Stack className="table_text_center">${data?.price}</Stack>
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    ))}
                                  {(!item.prescriptions || item.prescriptions.length === 0) && (
                                    <StyledTableRow>
                                      <StyledTableCell component="td" className="NoDataFound">
                                        <Stack>Oops!...Medication Not Found</Stack>
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Stack>
                        ))}
                      <Stack className="qty_box_outer" alignItems="flex-end">
                        <Box className="qty_box" sx={{ textAlign: 'center' }}>
                          {/* <Box className="order">Order Quantity: {order?.written_qty ? order?.written_qty : 2}</Box> */}
                          {/* <Box className="order_pipe">|</Box> */}
                          {/* <Box className="total">Block Total: ${Number(order?.rx_price) * Number(order?.written_qty) ? Number(order?.rx_price) * Number(order?.written_qty) : '51.00'}</Box> */}
                          <Box className="total" sx={{ width: '100%' }}>
                            Order Total: ${totalAmount.toFixed(2)}
                          </Box>
                        </Box>
                      </Stack>
                      {/* -------- COUPON SECTION --------- */}

                      <Stack>
                        <Stack className="qty_box_outer" alignItems="flex-end">
                          {/* Coupon section start */}
                          {false && (
                            <Box className="qty_box_new">
                              <Box className="new_payment_total">
                                <Typography component="h3">
                                  {/* Ship/Bill To: <br></br> */}
                                  <span className="heading-payment">Subtotal: $102.00</span>
                                </Typography>
                                <Typography component="h3">
                                  {/* Ship/Bill To: <br></br> */}
                                  <span className="heading_payment_h1">Promo Code / Coupon</span>
                                </Typography>
                                <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2} className="promocodeAlignment">
                                  <Stack>
                                    <FieldGroup
                                      render={({ get, invalid }) => (
                                        <form>
                                          <Grid item xs={12} sm={12} md={12} lg={12}>
                                            <FieldControl name="choose_dosing_instruction" render={InputText} meta={{ name: 'choose_dosing_instruction', label: 'Please Enter Code', placeholder: 'Please Enter Code' }} />
                                          </Grid>
                                        </form>
                                      )}
                                    />
                                  </Stack>
                                  <Stack>
                                    <Box>
                                      <PrimaryButton label="Apply"></PrimaryButton>
                                    </Box>
                                  </Stack>
                                </Stack>
                                <Typography component="h3">
                                  <span className="heading_payment_h2">
                                    You saved{' '}
                                    <span style={{ fontWeight: 600 }}>
                                      10% <span style={{ color: '#00ACBA' }}>|</span> -$12.00
                                    </span>
                                  </span>
                                </Typography>
                              </Box>
                              <Box className=" general_new">
                                <Box className="order genral_total_orders">Grand Total: $51.00</Box>
                              </Box>
                            </Box>
                          )}
                          {/* Coupon section end */}
                        </Stack>
                        <Box className="re_order">
                          <ul>
                            <li>
                              <SecondaryButton label="Back" onClick={handlePrescriptionHistory}></SecondaryButton>
                            </li>
                            <li>
                              <PrimaryButton label="Cancel" onClick={handleOrderConfirmation}></PrimaryButton>
                            </li>
                            <li>
                              <Box className="submit_btn" onClick={handleOrderSubmitConfirmation}>
                                <img src={SubmitRx} alt="logo" height={42} width={190} />
                              </Box>
                            </li>
                          </ul>
                        </Box>
                      </Stack>
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

export default ReviewOrderPage;
