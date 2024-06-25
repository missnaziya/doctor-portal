import { AppBar, Box, Container, Stack, Tab, Tabs, useTheme } from '@mui/material';
import { GET_SINGLE_PATIENT, GET_SINGLE_PATIENT_PRESCRIPTIONS, GET_PATIENT_CARDS, PRODUCT_CATALOG_BLUE_VIEW, GET_DOSING_DIRECTIONS } from '../../../constants/Endpoints';
import React, { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate, useParams } from 'react-router-dom';

import { AddMedication } from '../../../components/popup/AddMedication';
import { AddNewCard } from '../../../components/popup/AddNewCard';
import { AxiosResponse } from 'axios';
import Back from '../../../assets/icons/back.svg';
import Chat from '../../../assets/icons/chat.svg';
import ContactProfile from '../../../components/ContactProfile';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import EditProfile from '../../../components/EditProfile';
import Header from '../../../components/header/header';
import Paper from '@mui/material/Paper';
import { PatientInterface } from '../../../interfaces/patient';
import Prescribe from '../../../assets/icons/prescribe_icon.svg';
import { PrescriptionInterface } from '../../../interfaces/prescription';
import SearchBar from '../../../components/search-bar';
import Table from '@mui/material/Table';
import { PatientPrescriptionHistoryTable } from '../../../components/tables/PatientPrescriptionHistoryTable';
import TableArrow from '../../../assets/icons/table_arrow.svg';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { isLoggedIn } from '../../../services/auth/auth.service';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAppSelector } from '../../../store';
import { patientActions } from '../../../store/Actions';
import { useAppDispatch } from '../../../store';
import { productActions } from '../../../store/Actions';
import { User } from '../../../models/User';
import { Product } from '../../../models/Product';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({ '& .MuiDialogContent-root': { padding: theme.spacing(2) }, '& .MuiDialogActions-root': { padding: theme.spacing(1) } }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover }, '&:last-child td, &:last-child th': { border: 0 } }));

const Detail = React.memo(() => {
  const [patient, setPatient] = useState<PatientInterface | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionInterface[]>([]);

  const patientData: boolean = useAppSelector((state) => state.patientReducer.redirectToPatientPreHistory);
  const user: User = useAppSelector((state) => state.profileReducer.user);
  const productCatalog = useAppSelector((state) => state.productReducer.products);

  const params = useParams();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [editProfile, setEditProfile] = useState(false);
  const router = useNavigate();

  const handleProfile = (check: boolean) => {
    setEditProfile(check);
    if (!check) {
      getPatientDetail();
    }
  };

  const handleBack = () => {
    router('/home/patient');
  };

  const [data, setData] = useState({
    card: false,
    prescriber: false,
    accountId: ''
  });

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (patientData === true) {
      setValue(1);
      dispatch(patientActions.setRedirectToPatientPreHistory(false));
    }
  }, []);

  const [search, setSearch] = React.useState<string>('');

  const setSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePrescribeDetail = () => {
    router('/home/prescribe-now');
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setData((oldData) => ({
      ...oldData,
      card: false,
      prescriber: false,
      accountId: ''
    }));
  };

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  const tabProps = (index: number) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  };

  // update dosing directions
  const updateDosingDirections = async (products: Product[], prescriberId: string) => {
    try {
      let updatedProducts: Product[] = [];
      const dosingDirectionRes: AxiosResponse = await Doctor.get(`${GET_DOSING_DIRECTIONS}/${prescriberId}`);
      if (dosingDirectionRes?.status === 200 && Array.isArray(dosingDirectionRes?.data) && dosingDirectionRes.data.length > 0) {
        let directionsObj: any = {};
        dosingDirectionRes?.data?.map((direction: any) => {
          if (!directionsObj[direction?.ndc]) {
            directionsObj[direction?.ndc] = [{ id: direction?.directionsId, name: direction?.directions, product: direction?.productId }];
          } else {
            directionsObj[direction?.ndc] = [...directionsObj[direction?.ndc], { id: direction?.directionsId, name: direction?.directions, product: direction?.productId }];
          }
          return 0;
        }, {});
        products?.map((product: Product) => {
          if (directionsObj[product?.ndc] && product?.ndc && product?.productDirections !== null) {
            product['productDirections'] = [...product?.productDirections, ...directionsObj[product?.ndc]];
            updatedProducts = [...updatedProducts, product];
          } else {
            updatedProducts = [...updatedProducts, product];
          }
          return 0;
        });
      }
      return updatedProducts;
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
      return products;
    }
  };

  const getPatientDetail = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
        params: { patId: params.id }
      });
      if (res.status === 200) {
        setPatient(res.data as PatientInterface);
        // update products for patients
        if (productCatalog.length === 0) {
          const data = {
            enable: res.data.active_yn === 1 ? true : false,
            type: 'Patient',
            doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
          };
          let products: Product[] | undefined = [];
          const productRes: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
          if (productRes.status === 201 && Array.isArray(productRes.data) && productRes.data.length > 0) {
            products = await updateDosingDirections(productRes.data, data.doctorAccountId);
            if (!(Array.isArray(products) && products.length > 0)) {
              products = res.data;
            }
            dispatch(productActions.setPrescriberBlueViewProductCatalogData({ data: products as Product[] })); // for medication form
          }
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const getCards = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(`${GET_PATIENT_CARDS}/${params?.id}`);
      if (Array.isArray(res.data)) {
        dispatch(patientActions.setCurrentPatientCards(res.data));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const getPrescriptions = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT_PRESCRIPTIONS, {
        params: { patId: params.id, fname: params.fname, lname: params.lname, email: params.email, birth_date: params.birth_date }
      });
      if (Array.isArray(res.data)) {
        setPrescriptions(res.data as PrescriptionInterface[]);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router('/');
    } else {
      getPatientDetail();
      getCards();
      getPrescriptions();
      setIsLoaded(true);
    }
  }, []);

  return (
    <>
      {isLoaded && (
        <>
          {' '}
          {data.card && (
            <BootstrapDialog onClose={handleClose} open={data.card} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '40%', maxWidth: 780 } }}>
              <AddNewCard handleClose={handleClose} />
            </BootstrapDialog>
          )}
          {data.prescriber && (
            <BootstrapDialog onClose={handleClose} open={data.prescriber} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '40%', maxWidth: 780 } }}>
              <AddMedication handleClose={handleClose} accountId={data.accountId} />
            </BootstrapDialog>
          )}
          <Stack component="main" className="default-layout">
            <Header />
            <Box component="main" className="setting-page" position="relative">
              <Box className="main-content-wrapper-full">
                <Container maxWidth="xl">
                  <Box className="main-content-wrap">
                    <Container maxWidth="xl">
                      <Box className="main-box">
                        <Box sx={{ bgcolor: 'background.paper' }}>
                          <Box className="head_tabs_btn">
                            <AppBar position="static" className="tabs-bar">
                              <Tabs value={value} onChange={handleChange} style={{ background: '#ffffff' }} indicatorColor="primary" textColor="inherit" variant="fullWidth">
                                <Tab className="tab-btn" label="Contact & Profile" {...tabProps(0)} />
                                <Tab className="tab-btn" label="Prescription History" {...tabProps(1)} />
                              </Tabs>
                            </AppBar>
                          </Box>
                          <TabPanel value={value} index={0} dir={theme.direction}>
                            <Box>
                              <Box className="main-box">
                                {!editProfile && patient && <ContactProfile profile={patient} handleProfile={handleProfile} />}
                                {editProfile && patient && <EditProfile profile={patient} handleProfile={handleProfile} />}
                              </Box>
                            </Box>
                          </TabPanel>
                          <TabPanel value={value} index={1} dir={theme.direction}>
                            <Box className="payment" sx={{ p: 3 }}>
                              <Container maxWidth="xl">
                                <Stack className="Contact_img" display="flex" alignItems="center" justifyContent="center">
                                  <Box className="tw_icon_out">
                                    <span className="tw_icon">
                                      {patient?.fname.slice(0, 1)}
                                      {patient?.lname.slice(0, 1)}
                                    </span>
                                    {patient?.fname} {patient?.lname}
                                  </Box>
                                </Stack>
                                <PatientPrescriptionHistoryTable data={prescriptions} />
                                {/* <Box className="recent-order-table-layout recents-order-table-patient">
                                  <Box className="search_box">
                                    <SearchBar value={search} setValue={setSearchValue} autoFocus={false} />
                                  </Box>
                                  <Box className="recent-order-table-layout">
                                    {prescriptions && (
                                      <PatientPrescriptionHistoryTable
                                        data={prescriptions?.filter((item: PrescriptionInterface) => {
                                          return (search.length > 0 && (item.Rx_id + ' ' + item.Issue_Date + ' ' + item.Order_id + ' ' + item.Prescriber_Name + ' ' + item.Medication + ' ' + item.Status).toLowerCase().includes(search.toLowerCase())) || search.length === 0;
                                        })}
                                      />
                                    )}
                                  </Box>
                                </Box> */}
                                <Box className="back_patient">
                                  <Box className="patient_list" mr={3} onClick={handleBack} style={{ cursor: 'pointer' }}>
                                    <span>
                                      <img src={Back} alt="input_icon" width={30} height={30} />
                                    </span>
                                    <p>Back to Patients List</p>
                                  </Box>
                                </Box>
                              </Container>
                            </Box>
                          </TabPanel>
                        </Box>
                      </Box>
                    </Container>
                  </Box>
                </Container>
              </Box>
              <Box className="chat-floating-icon">
                <img src={Chat} alt="logo" height={50} width={50} />
              </Box>
              <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
                <img src={Prescribe} alt="logo" height={100} width={150} />
              </Box>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
});

export default Detail;
