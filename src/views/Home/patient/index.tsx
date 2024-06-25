import { Box, Container, Stack } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';

import { AddMedication } from '../../../components/popup/AddMedication';
import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { AxiosResponse } from 'axios';
import Chat from '../../../assets/icons/chat.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import { GET_CURRENT_PATIENT, GET_SINGLE_PATIENT, PRODUCT_CATALOG_BLUE_VIEW, GET_DOSING_DIRECTIONS } from '../../../constants/Endpoints';
import Header from '../../../components/header/header';
import { PatientInterface } from '../../../interfaces/patient';
import { PatientTable } from '../../../components/tables/PatientTable';
import Prescribe from '../../../assets/icons/prescribe_icon.svg';
import SearchBar from '../../../components/search-bar';
import { User } from '../../../models/User';
import { isLoggedIn } from '../../../services/auth/auth.service';
import { patientActions } from '../../../store/Actions';
import plusIcon from '../../../assets/icons/plus_icon.svg';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CreateNewPatientForm } from '../../../services/pages/popup-form/CreateNewPatientForm.service';
import { Order } from '../../../models/Order';
import { Product } from '../../../models/Product';
import { productActions } from '../../../store/Actions';
import Footer from '../../../components/footer/footer';
// import Footer from '../../../components/footer/footer';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export default function PatientPage() {
  const router = useNavigate();
  const [patientDialogue, setPatientDialouge] = useState(false);
  const [prescriptionDialogue, setPrescriptionDialogue] = useState(false);
  const [search, setSearch] = useState('');
  const [popupProp, setPopupProp] = useState<{ accountId: string }>({
    accountId: ''
  });
  const [order, setOrder] = useState<Order>({
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
        patients: [],
        prescriptions: []
      }
    ]
  });

  const setValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router('/');
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  const handlePrescribeDetail = () => {
    router('/home/prescribe-now');
  };

  const dispatch = useAppDispatch();
  const patientData: PatientInterface[] = useAppSelector((state) => state.patientReducer.patients);
  const productCatalog = useAppSelector((state) => state.productReducer.prescriberBlueViewProducts);
  const user: User = useAppSelector((state) => state.profileReducer.user);

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

  // get products
  const getProducts = async () => {
    try {
      const data = {
        enable: false,
        type: 'Prescriber',
        doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
      };
      let products: Product[] | undefined = [];
      const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
      if (res.status === 201 && Array.isArray(res.data) && res.data.length > 0) {
        products = await updateDosingDirections(res.data, data.doctorAccountId);
        if (!(Array.isArray(products) && products.length > 0)) {
          products = res.data;
        }
        dispatch(productActions.setProductCatalogData({ data: products as Product[] })); // for medication form
        dispatch(productActions.setPrescriberBlueViewProductCatalogData({ data: products as Product[] }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handlePrescription = async (patient: PatientInterface) => {
    try {
      const res: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
        params: { patId: patient?.pat_id }
      });
      if (res.status === 200 && res.data) {
        let data = {
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
          selectPrescriber: user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId,
          selectedPrescriberName: user?.type === 'Staff' ? user?.activePrescriber?.firstName + ' ' + user?.activePrescriber?.lastName : user?.npi,
          npi: user?.type === 'Staff' ? user?.activePrescriber?.npi : user?.npi,
          blocks: [
            {
              patients: [res?.data],
              prescriptions: []
            }
          ]
        };
        setOrder(data);
        const accountId = user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId;
        console.log(accountId);
        setPopupProp((popupProp) => ({ ...popupProp, accountId: accountId }));
        setPrescriptionDialogue(true);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleClickOpen = () => {
    setPatientDialouge(true);
  };

  const handleClose = () => {
    setPatientDialouge(false);
    user?.mdId && getCurrentPatient();
    CreateNewPatientForm.patchValue({
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      zip_code: ''
    });
    setPrescriptionDialogue(false);
  };

  const getCurrentPatient = async () => {
    try {
      let mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      const res: AxiosResponse = await Doctor.get(GET_CURRENT_PATIENT, { params: { md_id: mdId } });
      if (Array.isArray(res.data)) {
        dispatch(patientActions.setCurrentPatient(res.data));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (user) {
      getCurrentPatient();
      getProducts();
    }
  }, [user]);

  // prevent the user to access patient page if account is not approved
  useEffect(() => {
    if (isLoggedIn() && !user.isApproved) {
      alert('Requested page will be available, once account is approved');
      router('/home/dashboard');
    }
  }, []);

  return (
    <>
      {isLoaded && (
        <>
          {patientDialogue && (
            <BootstrapDialog onClose={handleClose} open={patientDialogue} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '75%', maxWidth: 1298 } }}>
              <AddNewPatient handleClose={handleClose} />
            </BootstrapDialog>
          )}
          {prescriptionDialogue && (
            <BootstrapDialog onClose={handleClose} open={prescriptionDialogue} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '40%', maxWidth: 780 } }}>
              <AddMedication handleClose={handleClose} order={order} accountId={popupProp?.accountId} />
            </BootstrapDialog>
          )}

          <Stack component="main" className="default-layout">
            <Header />
            <Box>
              <Box component="main" className="patient-page">
                <Box className="main-content-wrapper-full">
                  <Container maxWidth="xl">
                    <Box className="main-box current_patient_main">
                      <Container maxWidth="xl">
                        {user?.type === 'Staff' ? <Box className="heading_top">{`Current Patients For ${user?.activePrescriber?.firstName} ${user?.activePrescriber?.lastName}`}</Box> : <Box className="heading_top"> Current Patients </Box>}

                        {user.isApproved && (
                          <>
                            <Box className="add_btn_out">
                              <button className="add_btn" onClick={handleClickOpen}>
                                <span>
                                  <img src={plusIcon} alt="input_icon" width={12} />
                                </span>{' '}
                                Add Patient
                              </button>
                            </Box>

                            <SearchBar value={search} setValue={setValue}></SearchBar>

                            <Box className="recent-order-table-layout">
                              {patientData && (
                                <PatientTable
                                  data={patientData.filter((item: PatientInterface) => {
                                    return (search.length > 0 && (item.fname + ' ' + item.lname).toLowerCase().includes(search.toLowerCase())) || search.length === 0;
                                  })}
                                  onChange={handlePrescription}
                                />
                              )}
                            </Box>
                          </>
                        )}
                      </Container>

                      <Box className="chat-floating-icon">
                        <img src={Chat} alt="logo" height={65} width={65} />
                      </Box>
                      <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
                        <img src={Prescribe} alt="logo" height={100} width={180} />
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </Box>
            </Box>
          </Stack>
          <Footer />
        </>
      )}
    </>
  );
}
