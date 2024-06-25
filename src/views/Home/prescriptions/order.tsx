import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate, useParams } from 'react-router-dom';

import { AxiosResponse } from 'axios';
import Back from '../../../assets/icons/back_arrow.svg';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import { GET_ORDER_DETAIL, GET_SINGLE_PATIENT, GET_CURRENT_PATIENT, PRODUCT_CATALOG, PRODUCT_CATALOG_BLUE_VIEW } from '../../../constants/Endpoints';
import { PatientInterface } from '../../../interfaces/patient';
import { User } from '../../../models/User';
import Header from '../../../components/header/header';
import Ordersvg from '../../../assets/icons/order.svg';
import { OrderInterface } from '../../../interfaces/order';
import Paper from '@mui/material/Paper';
import Pdf from '../../../assets/icons/view-pdf.svg';
import PrimaryButton from '../../../core/buttons/primary-button';
import Rx from '../../../assets/icons/RX.svg';
import Rx_icon from '../../../assets/icons/rx_icon.svg';
import SecondaryButton from '../../../core/buttons/secondary-button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Usersvg from '../../../assets/icons/user.svg';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../../store';
import { prescriptionActions } from '../../../store/Actions';
import { Block, Order } from '../../../models/Order';
import { Product } from '../../../models/Product';
import { patientActions, productActions } from '../../../store/Actions';
import GeneratePdf from './GeneratePdf';
import Decimal from 'decimal.js';

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
    color: theme.palette.common.white,
    textAlign: 'center'
  },
  [`&.${tableCellClasses.head}:first-child`]: {
    textAlign: 'left !important' // Align only the first cell item of the header to the left
  },
  [`&.${tableCellClasses.body}:first-child`]: {
    textAlign: 'left !important' // Align only the first cell item of the header to the left
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 10
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

const OrderPage = () => {
  const params = useParams();
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const [patients, setPatients] = useState<any>([]);
  const [prescriptions, setPrescriptions] = useState<any>([]);

  const [medicationTableObject, setMedicationTableObj] = useState<any>({});

  const [order, setOrder] = useState<any | null>({ order_blocks: [{ patients: [], prescriptions: [] }], total_qty: 0 });
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const componentRef = useRef(null);
  const user: User = useAppSelector((state) => state.profileReducer.user);

  const handlePrescriptionHistory = () => {
    // router("/home/prescriptions");
    dispatch(patientActions.setRedirectToPatientPreHistory(true));
    window.history.back();
  };

  // console.log("HTML:::", ReactDOMServer.renderToString(<GeneratePdf patients={patients} prescriptions={prescriptions} medicationTableObject={medicationTableObject} order={order} />));

  // const setMedicationDetailsAndPrice = async (data: any, patients: any) => {
  //   try {
  //     let price: number = 0;
  //     let total_t_price: number = 0;
  //     let qty: number = 0;
  //     let prescription: any = data?.prescription;
  //     let doctorAccountId = data?.doctorAccountId;

  //     if (prescription[0]?.account_type === 'AR Group') {
  //       const payload = {
  //         doctorAccountId: doctorAccountId,
  //         type: 'Prescriber',
  //         enable: false
  //       };

  //       let products: any = {};
  //       let uniquePrescriptionObj: any = {};

  //       const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, payload);

  //       if (res?.status === 201 && Array.isArray(res?.data) && res?.data?.length > 0) {
  //         // medication table product info
  //         for (let obj of res?.data) {
  //           if (!products[obj?.ndc?.replaceAll('-', '')]) {
  //             products[obj?.ndc?.replaceAll('-', '')] = obj;
  //           }
  //         }

  //         // get unique prescriptions from order response by ndc and calculate pricing
  //         for (let obj of prescription) {
  //           if (!uniquePrescriptionObj[obj?.ndc?.replaceAll('-', '')]) {
  //             uniquePrescriptionObj[obj?.ndc?.replaceAll('-', '')] = obj;
  //           }
  //         }

  //         const uniquePrescriptionsArray: any = Object.values(uniquePrescriptionObj);
  //         // price & quantity calculation
  //         for (let elem of uniquePrescriptionsArray) {
  //           let quantityObj = products[elem?.ndc?.replaceAll('-', '')]?.productQuantities?.find((obj: any) => parseInt(obj?.quantityVolume) === parseInt(elem?.written_qty));
  //           if (elem?.Status === 'Shipped' && elem?.t_price_paid !== undefined && elem?.t_price_paid !== 0) {
  //             total_t_price += parseFloat(elem?.t_price_paid);
  //           } else {
  //             price += parseFloat(quantityObj?.quantityVolume) * parseFloat(quantityObj.staticPrice);
  //           }
  //           qty += elem.written_qty;
  //         }

  //         // set state values
  //         if (patients.length > 0 && qty > 0 && uniquePrescriptionsArray.length > 0) {
  //           console.log(patients.length, qty, price, uniquePrescriptionsArray.length);
  //           setMedicationTableObj(products);
  //           setOrder({ ...order, total_qty: qty * patients?.length, total_price: prescription[0]?.t_price_paid ? total_t_price : price * patients.length });
  //           setPrescriptions(uniquePrescriptionsArray);
  //         }
  //       }
  //     } else {
  //       const patientRes: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
  //         params: { patId: data?.prescription[0]?.pat_id }
  //       });

  //       if (patientRes.status === 200) {
  //         const payload = {
  //           doctorAccountId: doctorAccountId,
  //           type: 'Patient',
  //           enable: patientRes?.data?.active_yn === 1
  //         };

  //         let products: any = {};
  //         let uniquePrescriptionObj: any = {};

  //         const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, payload);

  //         if (res?.status === 201 && Array.isArray(res?.data) && res?.data?.length > 0) {
  //           // medication table product info
  //           for (let obj of res?.data) {
  //             if (!products[obj?.ndc?.replaceAll('-', '')]) {
  //               products[obj?.ndc?.replaceAll('-', '')] = obj;
  //             }
  //           }
  //           // get unique prescriptions from order response by ndc and calculate pricing
  //           for (let obj of prescription) {
  //             if (!uniquePrescriptionObj[obj?.ndc?.replaceAll('-', '')]) {
  //               uniquePrescriptionObj[obj?.ndc?.replaceAll('-', '')] = obj;
  //             }
  //           }
  //           const uniquePrescriptionsArray: any = await Object.values(uniquePrescriptionObj);
  //           console.log(uniquePrescriptionsArray);
  //           // price & quantity calculation
  //           for (let elem of uniquePrescriptionsArray) {
  //             let quantityObj = products[elem?.ndc?.replaceAll('-', '')]?.productQuantities?.find((obj: any) => parseInt(obj?.quantityVolume) === parseInt(elem?.written_qty));
  //             if (elem?.Status === 'Shipped' && elem?.t_price_paid !== undefined && elem?.t_price_paid !== 0) {
  //               total_t_price += parseFloat(elem?.t_price_paid);
  //             } else {
  //               price += parseFloat(quantityObj?.quantityVolume) * parseFloat(quantityObj.staticPrice);
  //             }
  //             qty += elem.written_qty;
  //           }
  //           // console.log('Test');
  //           // set state values
  //           if (patients.length > 0 && qty > 0 && uniquePrescriptionsArray.length > 0) {
  //             console.log(patients.length, qty, price, uniquePrescriptionsArray.length);
  //             setMedicationTableObj(products);
  //             setOrder({ ...order, total_qty: qty * patients?.length, total_price: prescription[0]?.t_price_paid ? total_t_price : price });
  //             setPrescriptions(uniquePrescriptionsArray);
  //           }
  //         }
  //       }
  //     }
  //     return price;
  //   } catch (error: any) {
  //     if (error?.response?.data?.message) {
  //       toast(error?.response?.data?.message);
  //     }
  //   }
  // };

  // const getOrderDetail = async () => {
  //   try {
  //     const orderId = params?.id?.split('-')[0];
  //     const res: AxiosResponse = await Doctor.get(GET_ORDER_DETAIL, {
  //       params: { orderId: orderId }
  //     });

  //     if (res.status === 200) {
  //       // console.log('RES::', res.data);
  //       let uniquePatientsObj: any = {};

  //       // get unique patients
  //       for (let elem of res?.data?.prescription) {
  //         if (!uniquePatientsObj[elem?.pat_id]) {
  //           uniquePatientsObj[elem?.pat_id] = elem;
  //         }
  //       }

  //       const uniquePatientsArray: any = Object.values(uniquePatientsObj);
  //       setPatients(uniquePatientsArray);
  //       await setMedicationDetailsAndPrice(res?.data, uniquePatientsArray);
  //     }
  //   } catch (error: any) {
  //     if (error?.response?.data?.message) {
  //       toast(error?.response?.data?.message);
  //     }
  //   }
  // };

  const printPdf = useReactToPrint({
    content: () => componentRef.current
  });

  const handlePrintPdf = () => {
    if (componentRef.current) {
      printPdf();
    }
  };

  const reOrder = async (order: any) => {
    try {
      let reOrder: Order = {
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

      let patObj;
      const patients: AxiosResponse = await Doctor.post(
        GET_CURRENT_PATIENT,
        {},
        {
          params: { md_id: user?.mdId, api_key: localStorage.getItem('api_key') }
        }
      );

      if (Array.isArray(patients.data.response)) {
        patObj = patients.data.response.find((p: any) => p.pat_id === order.pat_id);
      }

      const patient: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
        params: { patId: order.pat_id }
      });
      if (patient.data) {
        patObj = { ...patient.data[0], ...patObj } as PatientInterface;
      }

      reOrder.blocks[0].patients.push(patObj as PatientInterface);

      dispatch(prescriptionActions.setPrescribeOrder(reOrder));
      router('/home/prescribe-now');
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // console.log('PRS:::', prescriptions);
  // useEffect(() => {
  //   getOrderDetail();
  // }, []);

  const getMedicationPrice = (prescription: any) => {
    let quantityObj: any = medicationTableObject[prescription?.ndc?.replaceAll('-', '')]?.productQuantities.find((obj: any) => obj?.quantityVolume === prescription.written_qty);
    return new Decimal(quantityObj?.quantityVolume).times(new Decimal(quantityObj?.staticPrice)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
  };

  const setStructuredDataForFacility = async (data: any) => {
    // console.log('RES::', data);
    let prescriptionGroupObj: any = {};
    let price = new Decimal(0);
    let total_t_price = new Decimal(0);
    let qty: number = 0;
    let prescription: any = data?.prescription;
    let doctorAccountId = data?.doctorAccountId;
    let blocks: any = [];
    let blocksArray: any = [];

    const payload = {
      doctorAccountId: doctorAccountId,
      type: 'Prescriber',
      enable: false
    };

    let products: any = {};

    // get products for prescriber
    const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, payload);

    if (res?.status === 201 && Array.isArray(res?.data) && res?.data?.length > 0) {
      // medication table product info
      for (let obj of res?.data) {
        if (!products[obj?.ndc?.replaceAll('-', '')]) {
          products[obj?.ndc?.replaceAll('-', '')] = obj;
        }
      }

      /* ------------- get prescriptions groups --------------*/
      for (let elem of data?.prescription) {
        let keyString = elem?.ndc + elem?.sig_text + elem?.written_qty;
        if (!prescriptionGroupObj[keyString]) {
          prescriptionGroupObj[keyString] = [elem];
        } else {
          prescriptionGroupObj[keyString] = [...prescriptionGroupObj[keyString], elem];
        }
      }

      blocksArray = Object.values(prescriptionGroupObj);
      // create blocks from blocks array
      blocksArray.map((block: any) => {
        let tempPatients: any = [];
        let tempBlock: any = { patients: [], prescriptions: [] };
        block.map((elem: any) => {
          tempPatients = [...tempPatients, elem];
          // for total block price calculation
          let quantityObj = products[elem?.ndc?.replaceAll('-', '')]?.productQuantities?.find((obj: any) => parseInt(obj?.quantityVolume) === parseInt(elem?.written_qty));
          if (elem?.Status === 'Shipped' && elem?.t_price_paid !== null && elem?.t_price_paid !== 0) {
            total_t_price = total_t_price.plus(new Decimal(elem?.t_price_paid)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
          } else {
            price = price.plus(new Decimal(quantityObj?.staticPrice).times(new Decimal(quantityObj?.quantityVolume))).toDecimalPlaces(2, Decimal.ROUND_DOWN);
          }
          return 0;
        });
        // console.log(tempPatients);
        tempBlock = { ...tempBlock, patients: tempPatients, prescriptions: [block[0]] };
        blocks = [...blocks, tempBlock];
      });

      setMedicationTableObj(products);
      setOrder({
        ...order,
        total_qty: qty * patients?.length,
        total_price: prescription[0]?.t_price_paid ? total_t_price : price,
        blocks: blocks,
        prescriber_name: blocks[0]?.patients[0]?.md_fname + ' ' + blocks[0]?.patients[0]?.md_lname,
        npi: blocks[0]?.patients[0]?.npi_id,
        invoice_nbr: blocks[0]?.patients[0]?.invoice_nbr,
        tracking_code: blocks[0]?.patients[0]?.tracking_code,
        add_date: blocks[0]?.patients[0]?.add_date,
        expected_by: blocks[0]?.patients[0]?.expected_by,
        ship_name: blocks[0]?.patients[0]?.ship_name,
        ship_addr1: blocks[0]?.patients[0]?.ship_addr1,
        ship_addr2: blocks[0]?.patients[0]?.ship_addr2,
        ship_city: blocks[0]?.patients[0]?.ship_city,
        ship_state_cd: blocks[0]?.patients[0]?.ship_state_cd,
        ship_zip: blocks[0]?.patients[0]?.ship_zip,
        Bill_Name: blocks[0]?.patients[0]?.Bill_Name,
        bill_addr1: blocks[0]?.patients[0]?.bill_addr1,
        bill_addr2: blocks[0]?.patients[0]?.bill_addr2,
        bill_city: blocks[0]?.patients[0]?.bill_city,
        bill_state_cd: blocks[0]?.patients[0]?.bill_state_cd,
        bill_zip: blocks[0]?.patients[0]?.bill_zip
      });
    }
  };

  const setStructuredDataForPatient = async (data: any) => {
    let uniquePatientsObj: any = {};
    let price = new Decimal(0);
    let total_t_price = new Decimal(0);
    let qty: number = 0;
    let prescription: any = data?.prescription;
    let doctorAccountId = data?.doctorAccountId;

    /* ------------- get unique patients --------------*/
    for (let elem of data?.prescription) {
      if (!uniquePatientsObj[elem?.pat_id]) {
        uniquePatientsObj[elem?.pat_id] = elem;
      }
    }
    const uniquePatientsArray: any = Object.values(uniquePatientsObj);

    // set unique patients
    setPatients(uniquePatientsArray);

    /*------------- get patient medications -----------*/
    const patientRes: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
      params: { patId: data?.prescription[0]?.pat_id }
    });

    if (patientRes.status === 200) {
      // get blue view products for pricing
      const payload = {
        doctorAccountId: doctorAccountId,
        type: 'Patient',
        enable: patientRes?.data?.active_yn === 1
      };

      let products: any = {};
      let uniquePrescriptionObj: any = {};

      const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, payload);

      if (res?.status === 201 && Array.isArray(res?.data) && res?.data?.length > 0) {
        // medication table product info
        for (let obj of res?.data) {
          if (!products[obj?.ndc?.replaceAll('-', '')]) {
            products[obj?.ndc?.replaceAll('-', '')] = obj;
          }
        }

        // get unique prescriptions from order response by ndc and calculate pricing
        for (let obj of prescription) {
          if (!uniquePrescriptionObj[obj?.ndc?.replaceAll('-', '')]) {
            uniquePrescriptionObj[obj?.ndc?.replaceAll('-', '')] = obj;
          }
        }

        const uniquePrescriptionsArray: any = await Object.values(uniquePrescriptionObj);
        // console.log(uniquePrescriptionsArray);

        // price & quantity calculation
        for (let elem of uniquePrescriptionsArray) {
          let quantityObj = products[elem?.ndc?.replaceAll('-', '')]?.productQuantities?.find((obj: any) => parseInt(obj?.quantityVolume) === parseInt(elem?.written_qty));
          if (elem?.Status === 'Shipped' && elem?.t_price_paid !== undefined && elem?.t_price_paid !== 0) {
            total_t_price = total_t_price.plus(new Decimal(elem?.t_price_paid)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
          } else {
            price = price.plus(new Decimal(quantityObj?.staticPrice).times(new Decimal(quantityObj?.quantityVolume))).toDecimalPlaces(2, Decimal.ROUND_DOWN);
          }
          qty += elem.written_qty;
        }
        // console.log(patients.length, qty, price, uniquePrescriptionsArray.length);

        // set state values
        if (qty > 0 && uniquePrescriptionsArray.length > 0) {
          // console.log(patients.length, qty, price, uniquePrescriptionsArray.length);
          setMedicationTableObj(products);
          setOrder({
            ...order,
            total_qty: qty * patients?.length,
            total_price: prescription[0]?.t_price_paid ? total_t_price : price,
            blocks: [{ patients: uniquePatientsArray, prescriptions: uniquePrescriptionsArray }],
            prescriber_name: uniquePatientsArray[0]?.md_fname + ' ' + uniquePatientsArray[0]?.md_lname,
            npi: uniquePatientsArray[0]?.npi_id,
            invoice_nbr: uniquePatientsArray[0]?.invoice_nbr,
            tracking_code: uniquePatientsArray[0]?.tracking_code,
            add_date: uniquePatientsArray[0]?.add_date,
            expected_by: uniquePatientsArray[0]?.expected_by,
            ship_name: uniquePatientsArray[0]?.ship_name,
            ship_addr1: uniquePatientsArray[0]?.ship_addr1,
            ship_addr2: uniquePatientsArray[0]?.ship_addr2,
            ship_city: uniquePatientsArray[0]?.ship_city,
            ship_state_cd: uniquePatientsArray[0]?.ship_state_cd,
            ship_zip: uniquePatientsArray[0]?.ship_zip,
            Bill_Name: uniquePatientsArray[0]?.Bill_Name,
            bill_addr1: uniquePatientsArray[0]?.bill_addr1,
            bill_addr2: uniquePatientsArray[0]?.bill_addr2,
            bill_city: uniquePatientsArray[0]?.bill_city,
            bill_state_cd: uniquePatientsArray[0]?.bill_state_cd,
            bill_zip: uniquePatientsArray[0]?.bill_zip
          });
          // setPrescriptions(uniquePrescriptionsArray);
        }
      }
    }
  };

  console.log(order);

  const getOrderDetails = async () => {
    try {
      const orderId = params?.id?.split('-')[0];
      const res: AxiosResponse = await Doctor.get(GET_ORDER_DETAIL, {
        params: { orderId: orderId }
      });

      if (res.status === 200) {
        if (res?.data?.prescription[0]?.account_type === 'AR Group') {
          setStructuredDataForFacility(res.data);
        } else {
          setStructuredDataForPatient(res.data);
        }
        // await setMedicationDetailsAndPrice(res?.data, uniquePatientsArray);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // load order
  useEffect(() => {
    getOrderDetails();
  }, []);

  return (
    <>
      <Stack component="main" className="default-layout">
        <Header />
        <Box>
          <Box component="main" className="genral_order">
            <Box className="main-content-wrapper-full">
              <Container maxWidth="xl">
                <Box className="main-box">
                  <Container maxWidth="xl">
                    {/*------ ORDER GENTRAL TOP BACK ------*/}
                    <Box className="genral_top_container">
                      <Box className="genral_top" onClick={handlePrescriptionHistory}>
                        <span className="back_arrow">
                          <img src={Back} alt="Imprimis RX A Harrow Company" />
                        </span>
                        Back to Prescription History
                      </Box>
                      <Box className="re_order_pdf_btn">
                        <ul>
                          <li>
                            <Button
                              className="contact_btn"
                              variant="contained"
                              onClick={handlePrintPdf}
                              style={{ fontSize: '17px', height: '46 px', width: '218px', fontWeight: '600', backgroundColor: '#00ACBA', border: '1px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize' }}
                            >
                              Download PDF{' '}
                              <Box ml={1}>
                                <img src={Pdf} alt="input_icon" width={15} />
                              </Box>
                            </Button>
                          </li>
                        </ul>
                      </Box>
                    </Box>
                    {/*------ ORDER GENTRAL MAIN ------*/}

                    <Box className="order_general">
                      <Box>
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
                                      <img src={Ordersvg} alt="Imprimis RX A Harrow Company" width={16} />
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
                                          <span>{order?.prescriber_name}</span>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6} style={{ paddingBottom: '10px' }}>
                                      <Box className="order_npi_last">
                                        <Typography component="h3">
                                          NPI:<br></br>
                                          <span>{order?.npi}</span>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Stack>
                                <Stack direction="row">
                                  <Grid container className="prescribe prescribe_bottom">
                                    <Grid item xs={12} sm={6} md={6} lg={6} style={{ width: '50%', justifyItems: 'center' }}>
                                      <Box className="order_npi order_npi_border" style={{ paddingBottom: '10px' }}>
                                        <Typography component="h3">
                                          order Id. <br></br>
                                          <span>{order?.invoice_nbr}</span>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6} style={{ width: '50%' }}>
                                      {/* <Box className="order_npi_last" style={{ paddingBottom: '10px' }}>
                                        <Typography component="h3">
                                          Ship/Bill To: <br></br>
                                          <span>Patient/Patient</span>
                                        </Typography>
                                      </Box> */}
                                      <Box className="order_npi_last">
                                        <Typography component="h3">
                                          Date Issued: <br></br>
                                          <span>{moment.utc(order?.add_date).format('MM/DD/YYYY')}</span>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Stack>
                                <Stack direction="row">
                                  <Grid container className="prescribe prescribe_bottom">
                                    <Grid item xs={12} sm={6} md={6} lg={6} style={{ width: '50%', justifyItems: 'center' }}>
                                      <Box className="order_npi order_npi_border" style={{ border: 'none' }}>
                                        <Typography component="h3">
                                          Tracking No. <br></br>
                                          <span>{order?.tracking_code ? order?.tracking_code : ''}</span>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Stack>
                              </Box>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Grid container className="prescription_address">
                          <Grid item xs={5} sm={5} md={5} lg={5} style={{ justifyItems: 'center' }}>
                            <Box className="prescription_address_shipping">
                              <Typography component="h3">
                                Shipping: <br></br>
                                <span>
                                  {order?.ship_name ? order?.ship_name : ''} <br></br>
                                  {order?.ship_addr1 ? order?.ship_addr1 : ''} {order?.ship_addr2 ? order?.ship_addr2 : ''} <br></br>
                                  {order?.ship_city ? order?.ship_city : ''} {order?.ship_state_cd ? order?.ship_state_cd : ''} {order?.ship_zip ? order?.ship_zip : ''} <br></br>
                                </span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={5} sm={5} md={5} lg={5} style={{ justifyItems: 'center' }}>
                            <Box className="prescription_address_billing">
                              <Typography component="h3">
                                Billing: <br></br>
                                <span>
                                  {order?.Bill_Name ? order?.Bill_Name : ''} <br></br>
                                  {order?.bill_addr1 ? order?.bill_addr1 : ''} {order?.bill_addr2 ? order?.bill_addr2 : ''} <br></br>
                                  {order?.bill_city ? order?.bill_city : ''} {order?.bill_state_cd ? order?.bill_state_cd : ''} {order?.bill_zip ? order?.bill_zip : ''} <br></br>
                                </span>
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        {order &&
                          Array.isArray(order?.blocks) &&
                          order?.blocks?.length > 0 &&
                          order?.blocks?.map((block: Block, index: number) => (
                            <>
                              <Box className="prescription prescription_top">
                                <Box className="prescription_in">{`Prescription Block ${index + 1}`} </Box>
                              </Box>
                              <Box className="personal_details personal_details_top ">
                                <Typography component="h1">
                                  <span className="profile_icon">
                                    <img src={Usersvg} alt="Imprimis RX A Harrow Company" width={16} />
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
                                      <StyledTableCell>Address</StyledTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody className="table_body">
                                    {block?.patients.length > 0 &&
                                      block?.patients.map((patient: any, i: number) => (
                                        <StyledTableRow key={index}>
                                          <StyledTableCell component="td">{i + 1}</StyledTableCell>
                                          <StyledTableCell component="td">
                                            <Stack>
                                              {patient?.patient_fname} {patient?.patient_lname}
                                            </Stack>
                                          </StyledTableCell>
                                          <StyledTableCell component="td">
                                            <Stack>{moment.utc(patient?.birth_date).format('MM/DD/YYYY')}</Stack>
                                          </StyledTableCell>
                                          <StyledTableCell component="td">
                                            <Stack>
                                              {patient?.addr1} {patient?.city} {patient?.state_cd} {patient?.zip}
                                            </Stack>
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
                                  Medication Details Per Patient
                                </Typography>
                              </Box>
                              <TableContainer component={Paper} className="table_customizedrx">
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                  <TableHead className="table_head">
                                    <TableRow>
                                      <StyledTableCell>No</StyledTableCell>
                                      <StyledTableCell>Image</StyledTableCell>
                                      <StyledTableCell style={{ textAlign: 'left' }}> Medication</StyledTableCell>
                                      <StyledTableCell>Comments</StyledTableCell>
                                      <StyledTableCell>Price($)</StyledTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody className="table_body">
                                    {block?.prescriptions?.length > 0 &&
                                      block?.prescriptions?.map((prescription: any, pi: number) => (
                                        <StyledTableRow key={index}>
                                          <StyledTableCell component="td">
                                            <Stack>{pi + 1}</Stack>
                                          </StyledTableCell>
                                          <StyledTableCell component="td" className="plusIcon table_product">
                                            <img src={`https://www.imprimisrx.com/s/sfsites/c/cms/delivery/media/${medicationTableObject[prescription?.ndc?.replaceAll('-', '')]?.contentKey}`} height={110} alt="logo" />
                                          </StyledTableCell>
                                          <StyledTableCell component="td" className="medication_column">
                                            <Stack className="medication_row">
                                              <Typography component="p">
                                                <strong> Name: </strong> {medicationTableObject[prescription?.ndc?.replaceAll('-', '')]?.medicationName}{' '}
                                              </Typography>
                                            </Stack>
                                            <Stack className="medication_row">
                                              <Typography>
                                                <strong> Dosing Instructions: </strong> {prescription?.sig_text}{' '}
                                              </Typography>
                                            </Stack>
                                            <Stack className="medication_row">
                                              <Typography>
                                                <strong> Medical Necessity: </strong>
                                                {prescription?.medical_necessity}{' '}
                                              </Typography>
                                            </Stack>
                                            <Stack className="medication_row">
                                              <Typography>
                                                <strong> Quantity: </strong> <span style={{ textTransform: 'uppercase' }}> {prescription?.written_qty ? prescription?.written_qty + ' ml' : ''} </span>{' '}
                                              </Typography>
                                            </Stack>
                                            <Stack className="medication_row">
                                              <Typography>
                                                <strong> Refill Left: </strong> {prescription?.refills_left}{' '}
                                              </Typography>
                                            </Stack>
                                          </StyledTableCell>
                                          <StyledTableCell component="td">
                                            <Stack>{prescription?.cmt}</Stack>
                                          </StyledTableCell>
                                          <StyledTableCell component="td">
                                            <Stack className="table_text_center">{prescription?.t_price_paid ? `$${prescription?.t_price_paid.toFixed(2)}` : '$' + getMedicationPrice(prescription)}</Stack>
                                          </StyledTableCell>
                                        </StyledTableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </>
                          ))}
                        <Stack className="qty_box_outer" alignItems="flex-end">
                          <Box className="qty_box">
                            {/* <Box className="order">Order Quantity: {order?.total_qty}</Box> */}
                            {/* <Box className="order_pipe">|</Box> */}
                            <Box className="total" sx={{ width: '100%', textAlign: 'center' }}>
                              Order Total: ${order && order?.total_price?.toFixed(2)}
                            </Box>
                          </Box>
                        </Stack>
                        {/* <Stack className="qty_box_outer" alignItems="flex-end">
                          <Box className="qty_box genral_total">
                            <Box className="order genral_total_order">Grand Total: $51.00</Box>
                          </Box>
                        </Stack> */}
                      </Box>
                      {/* <Box className="re_order"> */}
                      {/* <ul> */}
                      {/* <li>
                            <SecondaryButton label="Back to Prescription History" onClick={handlePrescriptionHistory}></SecondaryButton>
                          </li> */}
                      {/* <li>
                            <PrimaryButton label="Re-order Rx" onClick={() => reOrder(order)}></PrimaryButton>
                          </li> */}
                      {/* <li>
                            <Button
                              className="contact_btn"
                              variant="contained"
                              onClick={handlePrintPdf}
                              style={{ fontSize: '17px', height: '46px', width: '218px', fontWeight: '600', backgroundColor: '#00ACBA', border: '1px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', textTransform: 'capitalize' }}
                            >
                              Download PDF{' '}
                              <Box ml={1}>
                                <img src={Pdf} alt="input_icon" width={15} />
                              </Box>
                            </Button>
                          </li> */}
                      {/* </ul> */}
                      {/* </Box> */}
                    </Box>
                  </Container>
                  <div style={{ display: 'none' }}>
                    <div ref={componentRef}>
                      <GeneratePdf patients={patients} prescriptions={prescriptions} medicationTableObject={medicationTableObject} order={order} />
                    </div>
                  </div>
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

export default OrderPage;
