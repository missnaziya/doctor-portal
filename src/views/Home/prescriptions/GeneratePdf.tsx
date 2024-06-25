import React, { useRef } from 'react';
import { Box, Container, Stack, Grid, Typography, Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import Back from '../../../assets/icons/back_arrow.svg';
import Chat from '../../../assets/icons/chat.svg';
import Ordersvg from '../../../assets/icons/order.svg';
import Paper from '@mui/material/Paper';
import Pdf from '../../../assets/icons/view-pdf.svg';
import PrimaryButton from '../../../core/buttons/primary-button';
import Product from '../../../assets/icons/table_product.svg';
import Rx from '../../../assets/icons/RX.svg';
import Rx_icon from '../../../assets/icons/rx_icon.svg';
import SecondaryButton from '../../../core/buttons/secondary-button';
import Usersvg from '../../../assets/icons/user.svg';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
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

const GeneratePdf = (props: { patients: any; prescriptions: any; medicationTableObject: any; order: any }) => {
  const { medicationTableObject, order } = props;

  const componentRef = useRef(null);

  const getMedicationPrice = (prescription: any) => {
    let quantityObj: any = medicationTableObject[prescription?.ndc]?.productQuantities.find((obj: any) => obj?.quantityVolume === prescription.written_qty);
    return (parseFloat(quantityObj?.quantityVolume) * parseFloat(quantityObj?.staticPrice))?.toFixed(2);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <Box component="main" className="pdf_genral_order">
      <Box className="pdf-main-content-wrapper-full">
        <Container maxWidth="xl" ref={componentRef}>
          <Box className="pdf-main-box">
            <Container maxWidth="xl">
              <Box className="pdf_order_general">
                <Box>
                  <Stack direction="row">
                    <Grid container>
                      <Grid item xs={5} sm={5} md={5} lg={5}>
                        <Box className="pdf_rx_img">
                          <img src={Rx} alt="Imprimis RX A Harrow Company" />
                        </Box>
                      </Grid>
                      <Grid item xs={7} sm={7} md={7} lg={7}>
                        <Box className="pdf_order_general_info">
                          <Box className="pdf_personal_details">
                            <Typography className="pdf_heading">
                              <span className="pdf_profile_icon">
                                <img src={Ordersvg} alt="Imprimis RX A Harrow Company" width={16} />
                              </span>
                              <span className="pdf_profile_icon_heading">Order General Info</span>
                            </Typography>
                          </Box>
                          <Stack direction="row">
                            <Grid container className="pdf_prescribe">
                              <Grid item xs={6} sm={6} md={6} lg={6}>
                                <Box className="pdf_order_npi">
                                  <Typography component="h3">
                                    Prescriber:<br></br>
                                    <span>{order?.prescriber_name}</span>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} sm={6} md={6} lg={6} style={{ paddingBottom: '10px' }}>
                                <Box className="pdf_order_npi_last">
                                  <Typography component="h3">
                                    NPI:<br></br>
                                    <span>{order?.npi}</span>
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Stack>
                          <Stack direction="row">
                            <Grid container className="pdf_prescribe prescribe_bottom">
                              <Grid item xs={6} sm={6} md={6} lg={6} style={{ width: '50%', justifyItems: 'center' }}>
                                <Box className="pdf_order_npi order_npi_border" style={{ paddingBottom: '10px' }}>
                                  <Typography component="h3">
                                    order Id. <br></br>
                                    <span>{order?.invoice_nbr}</span>
                                  </Typography>
                                </Box>
                                <Box className="pdf_order_npi order_npi_border" style={{}}>
                                  <Typography component="h3">
                                    Tracking No. <br></br>
                                    <span>{order?.tracking_code ? order?.tracking_code : '______'}</span>
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} sm={6} md={6} lg={6} style={{ width: '50%' }}>
                                <Box className="pdf_order_npi_last">
                                  <Typography component="h3">
                                    Date Issued: <br></br>
                                    <span>{moment.utc(order?.add_date).format('MM/DD/YYYY')}</span>
                                  </Typography>
                                </Box>
                                <Box className="pdf_order_expected_date">
                                  <Typography component="h3">
                                    Expected Date: <br></br>
                                    <span>{moment.utc(order?.expected_by).format('MM/DD/YYYY')}</span>
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Grid container className="pdf_prescription_address">
                    <Grid item xs={5} sm={5} md={5} lg={5} style={{ justifyItems: 'center' }}>
                      <Box className="pdf_prescription_address_shipping">
                        <Typography component="h3">
                          <div> Shipping:</div> <br></br>
                          <span>
                            {order?.ship_name ? order?.ship_name : ''} <br></br>
                            {order?.ship_addr1 ? order?.ship_addr1 : ''} {order?.ship_addr2 ? order?.ship_addr2 : ''} <br></br>
                            {order?.ship_city ? order?.ship_city : ''} {order?.ship_state_cd ? order?.ship_state_cd : ''} {order?.ship_zip ? order?.ship_zip : ''} <br></br>
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} lg={5} style={{ justifyItems: 'center' }}>
                      <Box className="pdf_prescription_address_billing">
                        <Typography component="h3">
                          <div>Billing:</div> <br></br>
                          <span>
                            {order?.Bill_Name ? order?.Bill_Name : ''} <br></br>
                            {order?.bill_addr1 ? order?.bill_addr1 : ''} {order?.bill_addr2 ? order?.bill_addr2 : ''} <br></br>
                            {order?.bill_city ? order?.bill_city : ''} {order?.bill_state_cd ? order?.bill_state_cd : ''} {order?.bill_zip ? order?.ship_zip : ''} <br></br>
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {order &&
                    Array.isArray(order?.blocks) &&
                    order?.blocks?.map((block: any, index: number) => (
                      <>
                        <Box className="pdf_prescription">
                          <Box className="pdf_prescription_in">{`Prescription Block ${index + 1}`}</Box>
                        </Box>
                        <Box className="pdf_personal_details">
                          <Typography className="pdf_heading" component="h1" pt={0} pb="10px">
                            <span className="pdf_profile_icon">
                              <img src={Usersvg} alt="Imprimis RX A Harrow Company" width={16} />
                            </span>
                            patient details
                          </Typography>
                        </Box>
                        <TableContainer component={Paper} className="pdf_table_customizedrx">
                          <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead className="table_head">
                              <TableRow>
                                <StyledTableCell>No</StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Date of birth</StyledTableCell>
                                {/* <StyledTableCell>Billing Information</StyledTableCell>
                          <StyledTableCell>Shipping Information</StyledTableCell> */}
                                <StyledTableCell>Address</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody className="table_body">
                              {Array.isArray(block?.patients) &&
                                block?.patients?.map((patient: any, i: number) => (
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
                        <Box className="pdf_personal_details">
                          <Typography component="h1" pt={0} pb="10px">
                            <span className="profile_icon">
                              <img src={Rx_icon} alt="Imprimis RX A Harrow Company" width={13} />
                            </span>
                            Medication Details Per Patient
                          </Typography>
                        </Box>
                        <TableContainer component={Paper} className="pdf_medication_table">
                          <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead className="table_head">
                              <TableRow>
                                <StyledTableCell>No</StyledTableCell>
                                <StyledTableCell>Image</StyledTableCell>
                                <StyledTableCell style={{ textAlign: 'left' }}>Medication</StyledTableCell>
                                <StyledTableCell>Comments</StyledTableCell>
                                <StyledTableCell>Price($)</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody className="pdf_medication_table_body">
                              {Array.isArray(block?.prescriptions) &&
                                block?.prescriptions?.map((prescription: any, pi: number) => (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell component="td">
                                      <Stack>{pi + 1}</Stack>
                                    </StyledTableCell>
                                    <StyledTableCell component="td" className="plusIcon pdf_table_product">
                                      <img src={`https://www.imprimisrx.com/s/sfsites/c/cms/delivery/media/${medicationTableObject[prescription?.ndc?.replaceAll('-', '')]?.contentKey}`} height={110} alt="logo" />
                                    </StyledTableCell>
                                    <StyledTableCell component="td" className="pdf_medication_column">
                                      <Stack className="pdf_medication_row">
                                        <Typography component="p">
                                          <strong> Name: </strong> {medicationTableObject[prescription?.ndc?.replaceAll('-', '')]?.medicationName}{' '}
                                        </Typography>
                                      </Stack>
                                      <Stack className="pdf_medication_row">
                                        <Typography>
                                          <strong> Dosing Instructions: </strong> {prescription?.sig_text}{' '}
                                        </Typography>
                                      </Stack>
                                      <Stack className="pdf_medication_row">
                                        <Typography>
                                          <strong> Medical Necessity: </strong>
                                          {prescription?.medical_necessity}{' '}
                                        </Typography>
                                      </Stack>
                                      <Stack className="pdf_medication_row">
                                        <Typography>
                                          <strong> Quantity: </strong> <span style={{ textTransform: 'uppercase' }}> {prescription?.written_qty ? prescription?.written_qty + ' ml' : ''} </span>{' '}
                                        </Typography>
                                      </Stack>
                                      <Stack className="pdf_medication_row">
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

                  <Stack className="pdf_qty_box_outer" alignItems="flex-end">
                    <Box className="pdf_qty_box">
                      {/* <Box className="pdf_order">Order Quantity: {order?.total_qty}</Box> */}
                      {/* <Box className="pdf_order_pipe">|</Box> */}
                      <Box className="pdf_total" sx={{ width: '100%', textAlign: 'center' }}>
                        {' '}
                        Order Total: $ {order?.total_price?.toFixed(2)}
                      </Box>
                    </Box>
                  </Stack>
                  {/* <Stack className="pdf_qty_box_outer" alignItems="flex-end">
                    <Box className="pdf_qty_box pdf_genral_total">
                      <Box className="pdf_order pdf_genral_total_order">Grand Total: $51.00</Box>
                    </Box>
                  </Stack> */}
                </Box>
              </Box>
            </Container>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default GeneratePdf;
