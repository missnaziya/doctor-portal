import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, AutocompleteRenderOptionState, Box, Container, FormControl, FormControlLabel, Grid, InputAdornment, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material';
import { Block, Order } from '../../../models/Order';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { GET_CURRENT_PATIENT, GET_PRESCRIPTION_HISTORY, GET_AR_GROUPS, GET_SINGLE_PATIENT, PRODUCT_CATALOG, PRODUCT_CATALOG_BLUE_VIEW, GET_DOSING_DIRECTIONS, PRESCRIBER_PROFILE_GET } from '../../../constants/Endpoints';
import { patientActions, prescriptionActions } from '../../../store/Actions';

import { AddPrescriptionMedication } from '../../../components/popup/AddPrescriptionMedication';
import { AxiosError, AxiosResponse } from 'axios';
import Chat from '../../../assets/icons/chat.svg';
import Deleat from '../../../assets/icons/deleat.svg';
import Deleatnew from '../../../assets/icons/deleat-new.svg';
import Dialog from '@mui/material/Dialog';
import Doctor from '../../../constants/grx-api';
import DownLines from '../../../assets/icons/Line 66.svg';
import Editnew from '../../../assets/icons/edit-new.svg';
import Ellipse from '../../../assets/icons/Ellipse.svg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../../../components/header/header';
import { Medication } from '../../../models/Medication';
import NewPrescriptionPrimaryBtn from '../../../core/buttons/NewPrescriptionPrimaryBtn';
import { PatientInterface } from '../../../interfaces/patient';
import PlusIcon from '../../../assets/icons/plus_icon.svg';
import PrescribeOrder from '../../../assets/icons/prescribe_order.png';
import { PrescriberInterface } from '../../../interfaces/prescriber';
import { PrescriptionAddNewPatient } from '../../../components/popup/PrescriptionAddNewPatient';
import { AddPrescriptionFacilityCard } from '../../../components/popup/AddPrescriptionFacilityCard';
import { PrescriptionPrescriberCards } from '../../../components/popup/PrescriptionPrescriberCards';
import { PrescriptionPatientCards } from '../../../components/popup/PrescriptionPatientCards';
import { PrescriptionInterface } from '../../../interfaces/prescription';
import { User } from '../../../models/User';
import UserImage from '../../../assets/icons/user.svg';
import { isLoggedIn } from '../../../services/auth/auth.service';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userIcon from '../../../assets/icons/userIcon.svg';
import editIcon from '../../../assets/icons/edit.svg';
import { Product } from '../../../models/Product';
import { productActions } from '../../../store/Actions';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FacilityInterface } from '../../../interfaces/facility';

const arrowIcon = (props: any) => (
  <svg width="22" height="22" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <svg width="22" height="22" x="10" y="13" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.6664 1.17334C11.6005 1.38801 11.4512 1.53965 11.3007 1.69341C9.64847 3.37876 7.99715 5.06532 6.3479 6.75402C6.14555 6.96138 5.91548 7.0582 5.63862 6.96351C5.5352 6.92819 5.43328 6.85815 5.3555 6.77868C3.64009 5.03152 1.92737 3.28193 0.215843 1.53051C-0.0717466 1.23637 -0.0705537 0.855458 0.211075 0.558581C0.343098 0.41943 0.474525 0.278451 0.618766 0.153002C0.861951 -0.0583138 1.19901 -0.0476556 1.4419 0.165487C1.47915 0.198371 1.51432 0.233996 1.54918 0.269621C2.94243 1.69311 4.33597 3.11629 5.72862 4.54038C5.7608 4.57327 5.78703 4.61194 5.8669 4.67375C5.88865 4.63264 5.90266 4.58362 5.93365 4.55195C7.33912 3.11355 8.74577 1.67636 10.153 0.239782C10.4156 -0.0281683 10.7774 -0.0817585 11.0229 0.138691C11.2733 0.363404 11.5484 0.575024 11.6667 0.916965V1.17304L11.6664 1.17334Z"
        fill="#00ACBA"
      />
    </svg>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.50389" cy="7.50438" r="6.50389" stroke="#00ACBA" stroke-width="2" />
    <line x1="12.1657" y1="12.1611" x2="16.0571" y2="16.5389" stroke="#00ACBA" stroke-width="2" stroke-linecap="round" />
  </svg>
);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export default function PrescribeNow() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useNavigate();
  const [addPatient, setAddPatient] = useState(false);
  const [createPatientPopUp, setCreatePatientPopUp] = useState<{
    mdId?: string;
    showDialog?: boolean;
    blockIndex?: number;
  } | null>(null);
  const [openAddMedicationPopUp, setOpenAddMedicationPopUp] = useState(false);
  const [openEditMedicationPopUp, setOpenEditMedicationPopUp] = useState(false);
  const [openSelectFacilityCardPopUp, setOpenSelectFacilityCardPopUp] = useState(false);
  const [openSelectPatientCardPopup, setOpenSelectPatientCardPopup] = useState(false);

  const [additionalIndex, setAdditionalIndex] = useState(0);
  const [arOptions, setArOptions] = useState([]);
  const [arGroups, setArGroups] = useState<any>([]);
  const [arGroupAddress, setArGroupAddress] = useState<any>(null);
  const [arCardInfo, setArCardInfo] = useState<any>(null);
  const [prescribersList, setPrescribersList] = useState<any>([]);
  const [popup, setPopup] = useState<{
    i?: number | undefined;
    block?: Block;
    prIndex?: number | undefined;
    medicationIndex?: number | undefined;
    facilityId?: number | undefined;
    patientId?: number | undefined;
    addr1?: string | undefined;
    addr2?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    blueView?: string | undefined;
    blockIndex?: number | undefined;
    terms?: string | undefined;
    accountId?: string | undefined;
  } | null>(null);

  const initialOrders: Order = useAppSelector((state) => state.prescriptionReducer.prescribeOrder);
  const [order, setOrder] = useState<Order | any>(initialOrders);
  const [billToType, setBillToType] = useState<any>('');

  // Patient
  const dispatch = useDispatch();
  const user: User = useAppSelector((state) => state.profileReducer.user);
  const prescribers: PrescriberInterface[] = useAppSelector((state) => state.prescriptionReducer.prescribers);
  const patientData: PatientInterface[] = useAppSelector((state) => state.patientReducer.patients);
  const productCatalog: Product[] | any = useAppSelector((state) => state.productReducer.products);
  const patientblueViewProductCatalog: Product[] | any = useAppSelector((state) => state.productReducer.patientBlueViewProducts);
  // const prescriberBlueViewProductCatalog: Product[] | any = useAppSelector((state) => state.productReducer.prescriberBlueViewProducts);

  /** -----------Form handler functions---------- **/
  const setSelectedPrescriber = async (value: string | undefined) => {
    if (value !== undefined && user?.type === 'Staff') {
      let updatedOrder = JSON.parse(JSON.stringify(order));
      const obj: PrescriberInterface = prescribers?.find((prescriberObj: PrescriberInterface) => prescriberObj?.mdId === value) as PrescriberInterface;
      if (obj) {
        updatedOrder.selectPrescriber = obj?.mdId;
        updatedOrder.selectedPrescriberName = obj?.firstName + ' ' + obj?.lastName;
        updatedOrder.npi = obj?.npi;
        updatedOrder = { ...updatedOrder, billTo: { type: '', value: '' }, shipTo: { type: '', value: '' }, comment: '', credit_card: '', needByDate: '', blocks: [{ patients: [], prescriptions: [] }] };
        setArCardInfo(null);
        setArGroupAddress(null);
        getBlueViewProducts(false, 'Prescriber', obj?.accountId);
        getArOptions(obj?.mdId);
        getCurrentPatient(obj?.mdId);
      }
      setOrder(updatedOrder);
      dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    }
  };

  const checkDuplicatePatient = (value: PatientInterface, block: Block): boolean => {
    const patientValue = value as PatientInterface;
    const index = (block.patients as PatientInterface[]).findIndex((patient: PatientInterface) => patient?.pat_id === patientValue?.pat_id);
    if (index === -1) return true;
    else {
      alert(`Patient already exists !`);
      return false;
    }
  };

  const handleAddPatientBlock = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (order?.billTo?.type === '' || order?.shipTo?.type === '') {
      alert('Please complete the prior steps');
      return;
    }
    if (order?.billTo?.type === 'patient' && order?.shipTo?.type !== '' && order?.blocks[0]?.patients?.length >= 1) {
      alert('Only one patient is allowed when shipping or billing to a patient directly. Please create a separate order for each individual patient.');
      return;
    }
    if (order?.shipTo?.type === 'patient' && order?.billTo?.type !== '' && order?.blocks[0]?.patients?.length >= 1) {
      alert('Only one patient is allowed when shipping or billing to a patient directly. Please create a separate order for each individual patient.');
      return;
    } else {
      setAddPatient(true);
      return;
    }
  };

  const getShippingAndBillingInfo = async (order: Order) => {
    let shipping: any | undefined = {
      addr1: '',
      addr2: '',
      city: '',
      company: '',
      country: '',
      state: '',
      zip: ''
    };

    let billing: any | undefined = {};

    // get billing address
    if (order?.billTo?.type === 'patient' && order?.billTo?.value !== '') {
      let patientObj: any = order?.blocks[0]?.patients[0];
      billing.addr1 = patientObj.addr1;
      billing.addr2 = patientObj.addr2;
      billing.city = patientObj.city;
      billing.company = '';
      billing.country = patientObj.country_cd;
      billing.state = patientObj.state_cd;
      billing.zip = patientObj.zip;
    } else if (order?.billTo?.type === 'facility' && order?.billTo?.value !== '') {
      if (Array.isArray(arGroups) && arGroups.length > 0) {
        const facilityObj = arGroups.find((arGroup: FacilityInterface) => arGroup?.id === order?.billTo?.value);
        if (facilityObj) {
          const { company, addr1, addr2, city, state, zip } = facilityObj;
          billing.addr1 = addr1;
          billing.addr2 = addr2;
          billing.city = city;
          billing.company = company;
          billing.country = '';
          billing.state = state;
          billing.zip = zip;
        } else {
          billing = undefined;
        }
      }
    } else {
      billing = undefined;
    }

    // get shipping address
    if (order?.shipTo?.type === 'patient' && order?.shipTo?.value !== '') {
      let patientObj: any = order?.blocks[0]?.patients[0];
      shipping.addr1 = patientObj.addr1;
      shipping.addr2 = patientObj.addr2;
      shipping.city = patientObj.city;
      shipping.company = '';
      shipping.country = patientObj.country_cd;
      shipping.state = patientObj.state_cd;
      shipping.zip = patientObj.zip;
    } else if (order?.shipTo?.type === 'facility' && order?.shipTo?.value !== '') {
      if (Array.isArray(arGroups) && arGroups.length > 0) {
        const facilityObj = arGroups.find((arGroup: FacilityInterface) => arGroup?.id === order?.shipTo?.value);
        if (facilityObj && Object.keys(facilityObj).length) {
          const { company, addr1, addr2, city, state, zip } = facilityObj;
          shipping.addr1 = addr1;
          shipping.addr2 = addr2;
          shipping.city = city;
          shipping.company = company;
          shipping.country = '';
          shipping.state = state;
          shipping.zip = zip;
        } else {
          shipping = undefined;
        }
      } else {
        shipping = undefined;
      }
    }

    // return shipping and billing info
    return { shipping, billing };
  };

  const handlePrescribeOrderDetail = async () => {
    if (order?.billTo?.type === '' || order?.shipTo?.type === '' || order?.billTo?.value === '' || order?.shipTo?.value === '' || order?.needByDate === '' || order?.blocks[0]?.patients?.length === 0 || order?.blocks[0]?.prescriptions?.length === 0) {
      alert('Please complete prior steps');
      return;
    }

    // check facility medication
    const shipToFacilityMedications: string[] = ['71384063021'];
    let isFacilityMedication: boolean = false;
    if (order?.blocks?.length > 0) {
      let prescriptionsObj: any = {};
      order?.blocks?.map((block: Block) => {
        if (block?.prescriptions?.length > 0) {
          block?.prescriptions?.map((prescription: any) => {
            prescriptionsObj[prescription?.selectedMedication?.ndc?.replaceAll('-', '')] = prescription?.selectedMedication?.ndc?.replaceAll('-', '');
            return 0;
          });
        }
      });

      shipToFacilityMedications.find((ndc: string) => {
        if (prescriptionsObj[ndc]) {
          isFacilityMedication = true;
          return true;
        }
      });
    }

    if (order?.shipTo?.type !== 'facility' && isFacilityMedication) {
      alert('Selected medication can not be shipped to patient, please choose a facility');
      return;
    }

    if (!(order?.billTo?.type === '' || order?.shipTo?.type === '' || order?.needByDate === '' || order?.blocks?.length === 0)) {
      const data = order;
      const { shipping, billing } = await getShippingAndBillingInfo(order);
      console.log(shipping, billing);
      if (billing) {
        dispatch(prescriptionActions.setBillingInfo({ data: billing }));
      }
      if (shipping) {
        dispatch(prescriptionActions.setShippingInfo({ data: shipping }));
      }
      dispatch(prescriptionActions.setPrescribeOrder(data));
      dispatch(prescriptionActions.setReviewOrder(data));
      router('/home/prescribe-now/review-order');
    }
  };

  const setBillTo = async (value: 'patient' | 'facility') => {
    let updatedOrder: Order = JSON.parse(JSON.stringify(order));
    // console.log('VAL:::', value);
    // if switching preferance from facility to patient
    if (value === 'patient' && order?.billTo?.type === 'facility' && order?.blocks?.length === 1 && order?.blocks[0].patients?.length === 0 && order?.blocks[0]?.prescriptions?.length === 0) {
      console.log('setBillTo Test 0');
      updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: '' } };
      setArCardInfo(null);
    } else if (value === 'patient' && order?.billTo?.type === 'facility' && order?.blocks?.length === 1 && order?.blocks[0].patients?.length === 0 && order?.blocks[0]?.prescriptions?.length === 1) {
      console.log('setBillTo Test 1');
      updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: '' } };
      setArCardInfo(null);
    } else if (value === 'patient' && order?.billTo?.type === 'facility' && order?.blocks?.length === 1 && order?.blocks[0]?.patients?.length === 1 && order?.blocks[0]?.prescriptions?.length > 0) {
      console.log('setBillTo Test 2');
      updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: order?.blocks[0]?.patients[0].account_id }, comment: '', credit_card: '' };
      setArCardInfo(null);
    } else if (value === 'patient' && order?.billTo?.type === 'facility' && order?.blocks?.length >= 1) {
      if (order?.blocks[0]?.patients?.length === 1) {
        console.log('Set Bill To inner 1');
        updatedOrder = { ...updatedOrder, billTo: { ...updatedOrder?.billTo, type: value, value: order?.blocks[0]?.patients[0]?.account_id }, blocks: [{ patients: [...updatedOrder?.blocks[0]?.patients], prescriptions: [...updatedOrder?.blocks[0]?.prescriptions] }] };
      } else if (order?.blocks[0]?.patients?.length > 1) {
        console.log('Set Bill To inner 2');
        updatedOrder = { ...updatedOrder, billTo: { ...updatedOrder?.billTo, type: value, value: '' }, blocks: [{ patients: [], prescriptions: [...updatedOrder?.blocks[0]?.prescriptions] }] };
      }
    } else if (value === 'patient' && order?.blocks?.length >= 1 && order?.blocks[0]?.patients?.length !== 1) {
      console.log('setBillTo Test 3');
      updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: '' }, comment: '', credit_card: '', blocks: [{ patients: [], prescriptions: [...order?.blocks[0]?.prescriptions] } as Block] };
    } else if (value === 'facility' && order?.shipTo?.type === 'patient') {
      console.log('setBillTo Test 4');
      updatedOrder = { ...updatedOrder, billTo: { ...order.billTo, type: value, value: '' } };
      setArCardInfo(null);
    } else if (value === 'facility' && order?.shipTo?.type === 'facility' && order?.shipTo?.value !== '') {
      console.log('setBillTo Test 5');
      updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: order?.shipTo?.value } };
      const selectedGroup = arGroups.find((option: any) => option?.id === order?.shipTo?.value);
      setArCardInfo(null);
      setPopup({
        ...popup,
        terms: selectedGroup?.TERMS,
        facilityId: selectedGroup?.id,
        addr1: selectedGroup?.addr1,
        addr2: selectedGroup?.addr2,
        city: selectedGroup?.city,
        state: selectedGroup?.state
      });
      setOpenSelectFacilityCardPopUp(true);
    } else if (order?.billTo?.type === '' && order?.blocks?.length === 1) {
      setArCardInfo(null);
      if (value === 'patient' && order?.blocks[0]?.patients?.length === 1) {
        // console.log('test', order?.blocks[0]?.patients[0]);
        updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: order?.blocks[0]?.patients[0]?.account_id } };
      } else {
        // console.log('Check');
        updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: '' } };
      }
    } else {
      setArCardInfo(null);
      // console.log('setBillTo Test 6', order);
      updatedOrder = { ...order, billTo: { ...order.billTo, type: value, value: '' } };
    }

    // date update
    if (updatedOrder?.billTo.type !== '' && updatedOrder?.shipTo.type !== '') {
      const needByDate = moment().add(5, 'days').format('YYYY-MM-DD');
      updatedOrder = { ...updatedOrder, needByDate: needByDate };
    }

    // console.log('setBillTo Test 7');
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    setBillToType(value); // to update the pricing
  };

  const setBillToValue = async (value: string) => {
    let updatedOrder: Order = JSON.parse(JSON.stringify(order));
    const selectedGroup = arGroups.find((option: any) => option?.id === parseInt(value));
    if (order?.billTo?.type === 'facility') {
      setPopup({
        ...popup,
        terms: selectedGroup?.TERMS,
        facilityId: selectedGroup?.id,
        addr1: selectedGroup?.addr1,
        addr2: selectedGroup?.addr2,
        city: selectedGroup?.city,
        state: selectedGroup?.state
      });
      setOpenSelectFacilityCardPopUp(true);
      if (order?.shipTo?.type === '') {
        updatedOrder = { ...order, billTo: { ...order.billTo, value: value }, shipTo: { ...order.shipTo, value: value } };
      } else {
        updatedOrder = { ...order, billTo: { ...order.billTo, value: value } };
      }
    } else {
      updatedOrder = { ...order, billTo: { ...order.billTo, value: value } };
    }

    setArGroupAddress({
      terms: selectedGroup?.TERMS,
      addr1: selectedGroup.addr1,
      addr2: selectedGroup.addr2,
      city: selectedGroup.city,
      company: selectedGroup.company,
      state: selectedGroup.state,
      zip: selectedGroup.zip
    });

    if (updatedOrder.billTo.type !== '' && updatedOrder.shipTo.type !== '') {
      const needByDate = moment().add(5, 'days').format('YYYY-MM-DD');
      updatedOrder = { ...updatedOrder, needByDate: needByDate };
    }
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  const setShipTo = (value: 'patient' | 'facility') => {
    let updatedOrder: Order = JSON.parse(JSON.stringify(order));

    if (value === 'patient' && order?.shipTo?.type !== 'facility' && order?.blocks?.length === 1 && order?.blocks[0]?.patients?.length === 1) {
      // console.log('SET shipTo 1');
      updatedOrder = { ...updatedOrder, shipTo: { ...order.shipTo, type: value, value: order?.blocks[0]?.patients[0]?.account_id } };
    } else if (value === 'patient' && order?.shipTo?.type === 'facility' && order?.blocks?.length === 1 && order?.blocks[0]?.patients?.length === 1) {
      // console.log('SET shipTo 2');
      updatedOrder = { ...updatedOrder, shipTo: { ...order.shipTo, type: value, value: order?.blocks[0]?.patients[0].account_id } };
    } else if (value === 'facility' && order?.billTo?.type === 'facility' && order?.billTo?.value !== '') {
      // console.log('SET shipTo 3');
      updatedOrder = { ...updatedOrder, shipTo: { ...order?.shipTo, type: value, value: order?.billTo?.value } };
      const selectedGroup = arGroups.find((option: any) => option?.id === parseInt(order?.billTo?.value));
      setArGroupAddress({
        terms: selectedGroup?.TERMS,
        addr1: selectedGroup.addr1,
        addr2: selectedGroup.addr2,
        city: selectedGroup.city,
        company: selectedGroup.company,
        state: selectedGroup.state,
        zip: selectedGroup.zip
      });
    } else if (value === 'patient' && order?.shipTo?.type !== 'patient' && order?.blocks?.length >= 1) {
      if (order?.blocks[0]?.patients?.length === 1) {
        // console.log('Set Ship To inner 1');
        updatedOrder = { ...updatedOrder, shipTo: { ...updatedOrder?.shipTo, type: value, value: order?.blocks[0]?.patients[0]?.account_id }, blocks: [{ patients: [...updatedOrder?.blocks[0]?.patients], prescriptions: [...updatedOrder?.blocks[0]?.prescriptions] }] };
      } else if (order?.blocks[0]?.patients?.length > 1) {
        // console.log('Set Ship To inner 2');
        updatedOrder = { ...updatedOrder, shipTo: { ...updatedOrder?.shipTo, type: value, value: '' }, blocks: [{ patients: [], prescriptions: [...updatedOrder?.blocks[0]?.prescriptions] }] };
      } else if (order?.blocks[0]?.patients?.length === 0) {
        updatedOrder = { ...updatedOrder, shipTo: { ...updatedOrder?.shipTo, type: value, value: '' }, blocks: [{ patients: [], prescriptions: [...updatedOrder?.blocks[0]?.prescriptions] }] };
      }
    } else {
      // console.log('SET shipTo 4');
      updatedOrder = { ...updatedOrder, shipTo: { ...order.shipTo, type: value, value: order?.billTo?.value } };
    }
    // console.log('SET shipTo 5');
    if (value === 'facility' && order.billTo.type === 'patient') {
      updatedOrder.shipTo.value = '';
      setArGroupAddress(null);
      // console.log('SET shipTo 6');
    }
    if (updatedOrder.billTo.type !== '' && updatedOrder.shipTo.type !== '') {
      const needByDate = moment().add(5, 'days').format('YYYY-MM-DD');
      updatedOrder = { ...updatedOrder, needByDate: needByDate };
      // console.log('SET shipTo 7');
    }
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  const setShipToValue = async (value: string) => {
    const arAddress = arGroups.find((option: any) => option.id === parseInt(value));
    setArGroupAddress({
      terms: arAddress?.TERMS,
      addr1: arAddress.addr1,
      addr2: arAddress.addr2,
      city: arAddress.city,
      company: arAddress.company,
      state: arAddress.state,
      zip: arAddress.zip
    });
    let updatedOrder: Order = { ...order, shipTo: { ...order.shipTo, value: value } };
    if (updatedOrder.billTo.type !== '' && updatedOrder.shipTo.type !== '') {
      const needByDate = moment().add(5, 'days').format('YYYY-MM-DD');
      updatedOrder = { ...updatedOrder, needByDate: needByDate };
    }
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  const setNeedByDate = (event: any) => {
    let selectedDate = moment(event.$d).format('YYYY-MM-DD');
    let updatedOrder, needByDate;
    needByDate = selectedDate;
    const today = moment().startOf('day');
    if (moment(needByDate).isAfter(today)) {
      updatedOrder = { ...order, needByDate: needByDate };
      setOrder(updatedOrder);
      dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    } else {
      alert(`You're allowed to pick future dates only.`);
    }
  };

  // add patient
  const onSelectPatient = async (item: { label: string; value: string; item: PatientInterface }, block: Block, i: number) => {
    try {
      let patient;
      let updatedOrder: Order = { ...order };
      let updatedBlock: any = { prescriptions: [...block?.prescriptions], patients: [...block?.patients] };
      let allBlocks: any = [];
      let uniqueBlueViewProducts: any = {};
      let updatedPrescriptions: any = [...block?.prescriptions];

      if (!checkDuplicatePatient(item?.item, block)) {
        return;
      }

      try {
        const res: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
          params: { patId: item?.item?.pat_id }
        });
        if (res.data) {
          patient = { ...res?.data, ...item?.item, blue_view: res?.data?.active_yn === 1 } as PatientInterface;
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast(error?.response?.data?.message);
        }
      }

      // update the prescription pricing if billto-> patient && prescription length > 0
      if (order?.billTo?.type === 'patient' && updatedBlock?.prescriptions?.length > 0) {
        let products: Product[] | undefined = [];
        const payload = {
          type: 'Patient',
          enable: patient?.blue_view,
          doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
        };
        try {
          const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, payload);
          if (res?.status === 201 && Array.isArray(res?.data) && res?.data?.length > 0) {
            products = await updateDosingDirections(res.data, payload.doctorAccountId);
            if (!(Array.isArray(products) && products.length > 0)) {
              products = res.data;
            }
            if (products) {
              for (let obj of products) {
                if (!uniqueBlueViewProducts[obj?.ndc]) {
                  uniqueBlueViewProducts[obj?.ndc] = obj;
                }
              }
            }
            if (updatedBlock?.prescriptions?.length > 0) {
              // console.log('UB:::', uniqueBlueViewProducts);
              // console.log('UP:::', updatedBlock?.prescriptions);
              updatedPrescriptions = [];
              for (let elem of updatedBlock?.prescriptions) {
                let updatedElem: any = { ...elem, selectedMedication: { ...elem?.selectedMedication } };
                let productQuantity = uniqueBlueViewProducts[updatedElem?.selectedMedication?.ndc].productQuantities;
                let selectedQuantity = productQuantity.find((qty: any) => qty.quantityVolume === updatedElem.quantity);
                updatedElem.price = (parseFloat(selectedQuantity?.quantityVolume) * parseFloat(selectedQuantity?.staticPrice)).toFixed(2);
                // console.log("Price:::",uniqueBlueViewProducts[updatedElem?.selectedMedication?.ndc]?.price);
                // console.log('UE:::', updatedElem);
                updatedPrescriptions = [...updatedPrescriptions, updatedElem];
              }
            }
            updatedBlock = { ...updatedBlock, prescriptions: [...updatedPrescriptions], patients: [...updatedBlock.patients, patient] };
            allBlocks = [...order.blocks];
            allBlocks[i] = updatedBlock;
            if (order?.shipTo?.type === 'patient') {
              updatedOrder = { ...order, billTo: { ...order?.billTo, value: item?.item?.account_id }, shipTo: { ...order?.shipTo, value: item?.item?.account_id }, blocks: [...allBlocks] };
            } else if (order?.shipTo?.type === 'facility') {
              updatedOrder = { ...order, billTo: { ...order?.billTo, value: item?.item?.account_id }, blocks: [...allBlocks] };
            }
            setOrder(updatedOrder);
            dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
            setAddPatient(false);
            handleSelectPatientCardsPopup(patient, i);
            return;
          }
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toast(error?.response?.data?.message);
          }
        }
      }

      /* When billTo and shipTo redio buttons are selected */
      // billTo - patient && shipTo - facility
      if (order?.billTo?.type === 'patient' && order?.shipTo?.type !== 'patient') {
        updatedOrder = { ...order, billTo: { ...order?.billTo, value: item?.item?.account_id } };
      }

      // billTo - patient && shipTo - patient
      if (order?.billTo?.type === 'patient' && order?.shipTo?.type === 'patient' && updatedBlock?.prescriptions?.length === 0) {
        updatedOrder = { ...order, billTo: { ...order?.billTo, value: item?.item?.account_id }, shipTo: { ...order?.shipTo, value: item?.item?.account_id } };
      }

      // billTo - either empty or facility and shipTo - patient
      if (order?.shipTo?.type === 'patient' && order?.billTo?.type !== 'patient') {
        updatedOrder = { ...order, shipTo: { ...order?.shipTo, value: item?.item?.account_id } };
      }

      // update patient in blocks
      updatedBlock = { ...updatedBlock, patients: [...updatedBlock?.patients, patient as PatientInterface] };
      allBlocks = [...order.blocks];
      allBlocks[i] = updatedBlock as Block;
      updatedOrder = { ...order, ...updatedOrder, blocks: allBlocks };
      setOrder(updatedOrder);
      dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
      setAddPatient(false);
      if (order?.billTo?.type === 'patient') {
        handleSelectPatientCardsPopup(patient, i);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const deletePatient = (e: React.SyntheticEvent, pIndex: number, block: Block, i: number) => {
    e.stopPropagation();
    let updatedBlocks = [...order.blocks];
    const updatedBlock = { ...block, patients: [...block.patients] };
    updatedBlock.patients.splice(pIndex, 1);
    updatedBlocks[i] = updatedBlock;
    let updatedOrder = { ...order, blocks: updatedBlocks };
    if (updatedOrder?.billTo?.type === 'patient') {
      updatedOrder.comment = '';
      updatedOrder.credit_card = '';
    }
    setOrder(updatedOrder as Order);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  const handlePatientCallBack = async (res: boolean, patId?: string, blockIndex?: number) => {
    if (res && patId && typeof blockIndex === 'number' && blockIndex > -1) {
      let updatedOrder: Order = JSON.parse(JSON.stringify(order));
      try {
        const mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
        const res: AxiosResponse = await Doctor.get(GET_CURRENT_PATIENT, {
          params: { md_id: mdId }
        });
        if (Array.isArray(res.data)) {
          const uniquePatients = res.data.filter(onlyUnique);
          dispatch(patientActions.setCurrentPatient(uniquePatients));
          let newPatient = uniquePatients.find((patient: PatientInterface) => patient?.pat_id === patId);
          if (newPatient) {
            const patientRes: AxiosResponse = await Doctor.get(GET_SINGLE_PATIENT, {
              params: { patId: patId }
            });
            if (patientRes?.status === 200) {
              newPatient = { ...newPatient, ...patientRes?.data, blue_view: patientRes?.data?.active_yn === 1 };
              updatedOrder.blocks[blockIndex].patients = [...updatedOrder?.blocks[blockIndex]?.patients, newPatient];
              if (updatedOrder?.shipTo?.type === 'patient') {
                // update shipTo value, if shipTo type is patient
                updatedOrder.shipTo.value = patientRes?.data?.account_id;
              }
              if (updatedOrder?.billTo?.type === 'patient') {
                // update billTo value, if billTo type is patient
                updatedOrder.billTo.value = patientRes?.data?.account_id;
              }
              setOrder(updatedOrder);
              dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
              setAddPatient(false);
              if (order?.billTo?.type === 'patient') {
                handleSelectPatientCardsPopup(newPatient, blockIndex);
              }
            }
          }
        }
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast(error?.response?.data?.message);
        }
      }
    }
    setCreatePatientPopUp({ ...createPatientPopUp, showDialog: false });
  };

  // medication popup
  const handleMedicationPopup = async (e: React.SyntheticEvent, block: Block, index: number) => {
    e.stopPropagation();
    const doctorAccountId = user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId;
    if (order.billTo.type === 'patient' && order?.blocks?.length === 1 && order?.blocks[index]?.patients.length === 1) {
      await getBlueViewProducts(order?.blocks[0]?.patients[0]?.active_yn === 1, 'Patient', doctorAccountId);
      setPopup({ ...popup, block: block, i: index, blueView: 'patient', accountId: doctorAccountId });
      setOpenAddMedicationPopUp(true);
    } else if (order.billTo.type === 'patient' && order?.blocks?.length === 1 && order?.blocks[index]?.patients.length === 0) {
      await getBlueViewProducts(false, 'Patient', doctorAccountId);
      setPopup({ ...popup, block: block, i: index, blueView: 'patient', accountId: doctorAccountId });
      setOpenAddMedicationPopUp(true);
    } else if (order?.billTo?.type === 'patient' && order?.billTo?.value !== '' && order?.shipTo?.value !== '' && order?.blocks?.length === 1) {
      await getBlueViewProducts(order?.blocks[0]?.patients[0]?.active_yn === 1, 'Patient', doctorAccountId);
      setPopup({ ...popup, block: block, i: index, blueView: 'patient', accountId: doctorAccountId });
      setOpenAddMedicationPopUp(true);
    } else {
      setPopup({ ...popup, block: block, i: index, blueView: 'prescriber', accountId: doctorAccountId });
      setOpenAddMedicationPopUp(true);
    }
  };

  // medication callbeck
  const handleMedicationCallBack = (medication: Medication | null = null, data: { block: Block; i: number } | null = null) => {
    // check if medication already exists
    if (data?.block && data?.block?.prescriptions.length > 0) {
      const index = (data?.block?.prescriptions as Medication[]).findIndex((prescription: Medication) => prescription?.selectedMedication?.ndc === medication?.selectedMedication?.ndc);
      if (index !== -1) {
        alert(`Already exist`);
        return;
      }
    }
    setOpenAddMedicationPopUp(false);
    if (medication && data) {
      let updatedData = { ...data };
      updatedData = { ...updatedData, block: { ...updatedData.block, prescriptions: [...updatedData.block.prescriptions, medication] } };
      let updatedBlocks = [...order.blocks];
      updatedBlocks[data.i] = updatedData.block;
      let updatedOrder = { ...order, blocks: updatedBlocks };
      setOrder(updatedOrder);
      setPopup(null);
      dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    }
  };

  // edit medication popup
  const handleEditMedicationCallBack = (medication: Medication | null = null, data: { block: Block; i: number } | null = null, prIndex: number | undefined) => {
    setOpenEditMedicationPopUp(false);
    if (medication && data && typeof prIndex === 'number') {
      let updatedPrescriptions = [...data.block.prescriptions];
      updatedPrescriptions[prIndex] = medication;
      let updatedBlocks = [...order.blocks];
      updatedBlocks[data.i] = { ...data.block, prescriptions: updatedPrescriptions };
      let updatedOrder = { ...order, blocks: updatedBlocks };
      setOrder(updatedOrder);
      setPopup(null);
      dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    }
  };

  // edit medication callback
  const handleEditMedicationPopup = async (e: React.SyntheticEvent, block: Block | any, i: number, prIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (order?.billTo?.type === 'patient' && order?.blocks?.length === 1 && order?.blocks[0]?.patients.length === 1) {
      if (order?.blocks[0]?.patients[0]?.blue_view) {
        const medicationIndex = await patientblueViewProductCatalog.findIndex((product: Product) => product?.id === block?.prescriptions[prIndex]?.selectedMedication?.id);
        if (medicationIndex !== -1) {
          // console.log('TEST!', medicationIndex);
          const doctorAccountId = user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId;
          await getBlueViewProducts(order?.blocks[0]?.patients[0]?.blue_view, 'Patient', doctorAccountId);
          setPopup({ ...popup, block: block, i: i, prIndex: prIndex, medicationIndex: medicationIndex, blueView: 'patient' });
          setOpenEditMedicationPopUp(true);
        }
      } else {
        const medicationIndex = await productCatalog.findIndex((product: Product) => product?.id === block?.prescriptions[prIndex]?.selectedMedication?.id);
        // console.log('TEST1', medicationIndex);
        if (medicationIndex !== -1) {
          setPopup({ ...popup, block: block, i: i, prIndex: prIndex, medicationIndex: medicationIndex, blueView: 'patient' });
          setOpenEditMedicationPopUp(true);
        }
      }
    } else {
      // console.log('T2:::', productCatalog);
      const medicationIndex = await productCatalog.findIndex((product: Product) => product?.id === block?.prescriptions[prIndex]?.selectedMedication?.id);
      // console.log('T3:::', medicationIndex);
      if (medicationIndex !== -1) {
        setPopup({ ...popup, block: block, i: i, prIndex: prIndex, medicationIndex: medicationIndex, blueView: 'prescriber' });
        setOpenEditMedicationPopUp(true);
      }
    }
  };

  const handleSelectFacilityCardsPopup = async () => {
    if (order?.billTo?.type === 'facility' && order?.billTo?.value !== '') {
      setPopup({
        ...popup,
        facilityId: order?.billTo?.value,
        addr1: arGroupAddress?.addr1,
        addr2: arGroupAddress?.addr2,
        city: arGroupAddress?.city,
        state: arGroupAddress?.state
      });
      setOpenSelectFacilityCardPopUp(true);
    }
  };

  const handleSelectFacilityCardsCallback = async (data?: { paymentInfo: string; lastFourDigits: string }) => {
    let updatedOrder: Order = JSON.parse(JSON.stringify(order));
    if (data?.paymentInfo && data?.lastFourDigits) {
      setArCardInfo(data?.paymentInfo);
      if (order?.billTo?.type === 'facility' && order?.billTo?.value !== '') {
        updatedOrder.comment = data?.paymentInfo;
        updatedOrder.credit_card = data?.lastFourDigits;
        if (order?.shipTo?.type === 'facility') {
          updatedOrder.shipTo.value = updatedOrder.billTo.value;
        }
      }
    } else {
      updatedOrder.billTo.value = '';
    }
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    setOpenSelectFacilityCardPopUp(false);
  };

  const handleSelectPatientCardsPopup = async (patient: any, blockIndex: number) => {
    setPopup({
      ...popup,
      patientId: patient?.pat_id,
      addr1: patient?.addr1,
      addr2: patient?.addr2,
      city: patient?.city,
      state: patient?.state_cd,
      blockIndex: blockIndex
    });
    setOpenSelectPatientCardPopup(true);
  };

  const handleSelectPatientCardsCallback = async (data?: { cardId: string; expiration: string; lastFourDigits: string; type: string; zip: string; patientId: number; blockIndex: number }) => {
    let updatedOrder: any = JSON.parse(JSON.stringify(order));
    const blockIndex: any = data?.blockIndex;
    if (updatedOrder?.blocks && updatedOrder?.blocks?.length > 0 && updatedOrder?.blocks[blockIndex]?.patients && updatedOrder?.blocks[blockIndex]?.patients.length > 0) {
      let patients = updatedOrder?.blocks[blockIndex].patients;
      let index = patients.findIndex((patient: any) => patient.pat_id === data?.patientId);
      if (index !== -1) {
        patients[index] = { ...patients[index], cardId: data?.cardId, expiration: data?.expiration, lastFourDigits: data?.lastFourDigits, type: data?.type, zip: data?.zip };
        updatedOrder.blocks[blockIndex].patients = patients;
        if (data?.cardId && data?.expiration && data?.lastFourDigits && data?.type && data?.zip) {
          updatedOrder.comment = `${data?.type} ending with ${data?.lastFourDigits}`;
          updatedOrder.credit_card = data?.lastFourDigits;
        }
      }
    }
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
    setOpenSelectPatientCardPopup(false);
  };

  const deletePrescription = (e: React.SyntheticEvent, i: number, block: Block, prIndex: number) => {
    e.stopPropagation();
    const updatedBlocks = [...order.blocks];
    const updatedBlock = { ...block, prescriptions: [...block.prescriptions] };
    updatedBlock.prescriptions.splice(prIndex, 1);
    updatedBlocks[i] = updatedBlock;
    const updatedOrder = { ...order, blocks: updatedBlocks };
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  const addBlock = (e: React.SyntheticEvent) => {
    if (order.billTo.type === '' || order.shipTo.type === '' || order?.billTo?.value === '' || order?.shipTo?.value === '') {
      e.preventDefault();
      alert('Please complete the prior steps');
      return;
    } else if (order.billTo.type === 'patient' || order.shipTo.type === 'patient') {
      e.preventDefault();
      alert('With bill to patient or ship to patient case, you can add only 1 block in an order');
      return;
    }
    let updatedOrder = { ...order, blocks: [...order.blocks, { patients: [], prescriptions: [] }] };
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  const deleteBlock = (i: number) => {
    let updatedOrder: Order = JSON.parse(JSON.stringify(order));
    updatedOrder.blocks.splice(i, 1);
    setOrder(updatedOrder);
    dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
  };

  /** ----------- API Call functions ---------- **/

  const onlyUnique = (value: any, index: number, self: any) => {
    return self.indexOf(value) === index;
  };

  // Get list of prescribers
  const getPrescribers = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(PRESCRIBER_PROFILE_GET);
      if (res?.status === 200 && Array.isArray(res?.data)) {
        setPrescribersList([...res?.data]);
        dispatch(prescriptionActions.setPrescriberData({ data: res?.data }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // get list of current patients
  const getCurrentPatient = async (md_id?: string | undefined) => {
    try {
      let mdId;
      if (md_id) {
        mdId = md_id;
      } else {
        mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      }
      const res: AxiosResponse = await Doctor.get(GET_CURRENT_PATIENT, { params: { md_id: mdId } });
      if (Array.isArray(res.data)) {
        const uniquePatients = res.data.filter(onlyUnique);
        dispatch(patientActions.setCurrentPatient(uniquePatients));
        return true;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // get list of facilities
  const getArOptions = async (md_id?: string | undefined) => {
    try {
      let mdId;
      if (md_id) {
        mdId = md_id;
      } else {
        mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      }
      const res: AxiosResponse = await Doctor.get(GET_AR_GROUPS, { params: { md_id: mdId } });
      if (Array.isArray(res.data)) {
        let uniqueArOptions = res.data.reduce((acc, curr): any => {
          if (!acc[curr?.id]) {
            acc[curr?.id] = { value: curr?.id, label: curr?.company };
          }
          return acc;
        }, {});
        uniqueArOptions = Array.from(Object.values(uniqueArOptions));
        setArGroups(res.data);
        setArOptions(uniqueArOptions);
        return;
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // update dosing instructions
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
    }
  };

  // get list of blue view products
  const getBlueViewProducts = async (blueView?: boolean, type?: string, prescriberId?: string) => {
    try {
      const data = {
        enable: blueView,
        type: type,
        doctorAccountId: prescriberId
      };
      let products: Product[] | undefined = [];
      const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
      if (res.status === 201 && Array.isArray(res.data) && res.data.length > 0) {
        products = await updateDosingDirections(res.data, prescriberId as string);
        if (!(Array.isArray(products) && products.length > 0)) {
          products = res.data;
        }
        if (type === 'Patient') {
          dispatch(productActions.setPatientBlueViewProductCatalogData({ data: products as Product[] }));
        } else if (type === 'Prescriber') {
          dispatch(productActions.setPrescriberBlueViewProductCatalogData({ data: products as Product[] }));
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // onload api calls
  useEffect(() => {
    if (user) {
      let updatedOrder: Order = JSON.parse(JSON.stringify(order));
      setAdditionalIndex(0);
      getCurrentPatient();
      getArOptions();
      if (user?.type === 'Doctor') {
        const prescriber: PrescriberInterface = {
          doctorAccountId: user?.doctorAccountId,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          mdId: user?.mdId,
          npi: user?.npi,
          specialty: user?.specialty,
          type: user?.type,
          phoneNumber: {
            areaCode: user?.phoneNumber?.areaCode,
            countryCode: user?.phoneNumber?.countryCode,
            number: user?.phoneNumber?.number
          }
        };
        updatedOrder.selectPrescriber = user?.mdId;
        updatedOrder.selectedPrescriberName = user?.firstName + ' ' + user?.lastName;
        updatedOrder.npi = user?.npi;
        setArCardInfo(null);
        setArGroupAddress(null);
        getBlueViewProducts(false, 'Prescriber', user?.doctorAccountId);
        getArOptions(user?.mdId);
        getCurrentPatient(user?.mdId);
        getBlueViewProducts(false, 'Prescriber', user?.doctorAccountId); // fetch products if prescriber is logged in
        dispatch(prescriptionActions.setPrescriberData({ data: [prescriber] }));
      } else if (user?.type === 'Staff') {
        // call get prescriber if staff is loggedin
        (async () => {
          try {
            let updatedOrder: any = JSON.parse(JSON.stringify(order));
            const res: AxiosResponse = await Doctor.get(PRESCRIBER_PROFILE_GET);
            if (res?.status === 200 && Array.isArray(res?.data) && res?.data?.length > 0) {
              if (order?.selectPrescriber !== '') {
                const obj: PrescriberInterface = await res?.data?.find((prescriberObj: PrescriberInterface) => prescriberObj?.mdId === order?.selectPrescriber);
                // console.log("OBJ", obj);
                if (obj) {
                  updatedOrder.selectPrescriber = obj?.mdId;
                  updatedOrder.selectedPrescriberName = obj?.firstName + ' ' + obj?.lastName;
                  updatedOrder.npi = obj?.npi;
                  getBlueViewProducts(false, 'Prescriber', obj?.accountId);
                }
              } else {
                updatedOrder.selectPrescriber = user?.activePrescriber?.mdId;
                updatedOrder.selectedPrescriberName = user?.activePrescriber?.firstName + ' ' + user?.activePrescriber?.lastName;
                updatedOrder.npi = user?.activePrescriber?.npi;
                getBlueViewProducts(false, 'Prescriber', user?.activePrescriber?.accountId);
              }
              setOrder(updatedOrder);
              dispatch(prescriptionActions.setPrescriberData({ data: res?.data }));
              dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
            }
          } catch (error: any) {
            if (error?.response?.data?.message) {
              toast(error?.response?.data?.message);
            }
          }
        })();
      }
    }
  }, [user]);

  // update pricing when billTo value changes
  useEffect(() => {
    console.log('setBillToType', billToType);
    let updatedOrder = JSON.parse(JSON.stringify(order));
    if (billToType === 'facility' && order?.blocks[0]?.prescriptions?.length > 0) {
      // update prescription pricing
      (async () => {
        try {
          let uniqueBlueViewProducts: any = {};
          let updatedPrescriptions: any = [];
          let products: Product[] | undefined = [];
          const data = {
            doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId,
            enable: false,
            type: 'Prescriber'
          };
          const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
          if (res?.status === 201 && Array.isArray(res?.data) && res.data.length > 0) {
            products = await updateDosingDirections(res.data, data.doctorAccountId);
            if (!(Array.isArray(products) && products.length > 0)) {
              products = res.data;
            }
            for (let obj of products) {
              if (!uniqueBlueViewProducts[obj?.ndc]) {
                uniqueBlueViewProducts[obj?.ndc] = obj;
              }
            }
            if (updatedOrder?.blocks[0]?.prescriptions?.length > 0) {
              for (let elem of updatedOrder?.blocks[0]?.prescriptions) {
                let prescription = { ...elem, selectedMedication: { ...elem.selectedMedication } };
                let productQuantity = uniqueBlueViewProducts[prescription?.selectedMedication?.ndc].productQuantities;
                let selectedQuantity = productQuantity.find((qty: any) => qty?.quantityVolume === prescription?.quantity);
                prescription.price = (parseFloat(selectedQuantity?.quantityVolume) * parseFloat(selectedQuantity?.staticPrice)).toFixed(2);
                updatedPrescriptions = [...updatedPrescriptions, prescription];
              }
            }
            updatedOrder.blocks[0] = { ...updatedOrder?.blocks[0], prescriptions: [...updatedPrescriptions], patients: [...updatedOrder?.blocks[0].patients] };
            setOrder(updatedOrder);
            dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
          }
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toast(error?.response?.data?.message);
          }
        }
      })();
    } else if (billToType === 'patient' && order?.blocks[0]?.prescriptions?.length > 0 && order.blocks[0].patients.length === 1) {
      // update  patients pricing
      (async () => {
        try {
          let uniqueBlueViewProducts: any = {};
          let updatedPrescriptions: any = [];
          let products: Product[] | undefined = [];
          const data = {
            doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId,
            enable: order?.blocks[0]?.patients[0]?.active_yn === 1,
            type: 'Patient'
          };
          const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
          if (res?.status === 201 && Array.isArray(res?.data) && res.data.length > 0) {
            products = await updateDosingDirections(res.data, data.doctorAccountId);
            if (!(Array.isArray(products) && products.length > 0)) {
              products = res.data;
            }
            for (let obj of products) {
              if (!uniqueBlueViewProducts[obj?.ndc]) {
                uniqueBlueViewProducts[obj?.ndc] = obj;
              }
            }
            if (updatedOrder?.blocks[0]?.prescriptions?.length > 0) {
              for (let elem of updatedOrder?.blocks[0]?.prescriptions) {
                let prescription = { ...elem, selectedMedication: { ...elem.selectedMedication } };
                let productQuantity = uniqueBlueViewProducts[prescription?.selectedMedication?.ndc].productQuantities;
                let selectedQuantity = productQuantity.find((qty: any) => qty?.quantityVolume === prescription?.quantity);
                prescription.price = (parseFloat(selectedQuantity?.quantityVolume) * parseFloat(selectedQuantity?.staticPrice)).toFixed(2);
                updatedPrescriptions = [...updatedPrescriptions, prescription];
              }
            }
            updatedOrder.blocks[0] = { ...updatedOrder?.blocks[0], prescriptions: [...updatedPrescriptions], patients: [...updatedOrder?.blocks[0].patients] };
            // console.log("UO:::",updatedOrder);
            setOrder(updatedOrder);
            dispatch(prescriptionActions.setPrescribeOrder(updatedOrder));
          }
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toast(error?.response?.data?.message);
          }
        }
      })();
    }
    if (billToType === 'patient' && updatedOrder?.blocks[0].patients?.length === 1) {
      handleSelectPatientCardsPopup(updatedOrder?.blocks[0].patients[0], 0);
    }
  }, [billToType]);

  // set AR card and address info if order is already created on load
  useEffect(() => {
    if (order?.shipTo?.type === 'facility' && order?.shipTo?.value !== '' && arGroups.length > 0) {
      const selectedGroup = arGroups.find((option: any) => option?.id === parseInt(order?.shipTo?.value));
      setArCardInfo(order?.comment);
      setArGroupAddress({
        terms: selectedGroup?.TERMS,
        addr1: selectedGroup.addr1,
        addr2: selectedGroup.addr2,
        city: selectedGroup.city,
        company: selectedGroup.company,
        state: selectedGroup.state,
        zip: selectedGroup.zip
      });
    }
  }, [arGroups]);

  // check if user is logged in, else logout
  useEffect(() => {
    if (!isLoggedIn()) {
      router('/');
    } else {
      setIsLoaded(true);
    }
  });

  // for testing
  useEffect(() => {
    console.log(order, 'order');
  }, [order]);

  const maxDate: any = moment().add(6, 'months');

  return (
    <>
      {isLoaded && (
        <>
          {openSelectFacilityCardPopUp && (
            <BootstrapDialog onClose={() => handleSelectFacilityCardsCallback} open={openSelectFacilityCardPopUp} PaperProps={{ style: { minHeight: '60%', maxHeight: '79%', minWidth: '40%', maxWidth: 780 } }}>
              <PrescriptionPrescriberCards
                handleClose={(data?: { paymentInfo: string; lastFourDigits: string }) => {
                  handleSelectFacilityCardsCallback(data);
                }}
                facilityId={popup?.facilityId}
                addr1={popup?.addr1}
                addr2={popup?.addr2}
                city={popup?.city}
                state={popup?.state}
                terms={popup?.terms}
              />
            </BootstrapDialog>
          )}
          {openSelectPatientCardPopup && (
            <BootstrapDialog onClose={() => handleSelectPatientCardsCallback} open={openSelectPatientCardPopup} PaperProps={{ style: { minHeight: '60%', maxHeight: '79%', minWidth: '40%', maxWidth: 780 } }}>
              <PrescriptionPatientCards
                handleClose={(data?: { cardId: string; expiration: string; lastFourDigits: string; type: string; zip: string; patientId: number; blockIndex: number }) => {
                  handleSelectPatientCardsCallback(data);
                }}
                patientId={popup?.patientId}
                addr1={popup?.addr1}
                addr2={popup?.addr2}
                city={popup?.city}
                state={popup?.state}
                blockIndex={popup?.blockIndex}
              />
            </BootstrapDialog>
          )}
          {openAddMedicationPopUp && (
            <BootstrapDialog onClose={() => handleMedicationCallBack} open={openAddMedicationPopUp} PaperProps={{ style: { minHeight: '60%', maxHeight: '79%', minWidth: '40%', maxWidth: 780 } }}>
              <AddPrescriptionMedication
                handleClose={(medication?: Medication | null, order?: Order | { block: Block; i: number } | null) => handleMedicationCallBack(medication, order as { block: Block; i: number })}
                data={{ block: popup?.block, i: popup?.i }}
                blueView={popup?.blueView}
                accountId={popup?.accountId}
              />
            </BootstrapDialog>
          )}
          {openEditMedicationPopUp && (
            <BootstrapDialog onClose={() => handleEditMedicationCallBack} open={openEditMedicationPopUp} PaperProps={{ style: { minHeight: '60%', maxHeight: '79%', minWidth: '40%', maxWidth: 780 } }}>
              <AddPrescriptionMedication
                handleClose={(medication?: Medication | null, order?: Order | { block: Block; i: number } | null, prIndex?: number) => handleEditMedicationCallBack(medication, order as { block: Block; i: number }, prIndex)}
                data={{ block: popup?.block, i: popup?.i }}
                prIndex={popup?.prIndex}
                medicationIndex={popup?.medicationIndex}
                edit={true}
                blueView={popup?.blueView}
              />
            </BootstrapDialog>
          )}
          <Stack component="main" className="default-layout">
            <Header />
            <Box>
              <Box component="main" className="patient-page">
                <Box className="prescription-ordering">
                  <Container maxWidth="xl">
                    <Box className="main-box">
                      <Box className="prescription_heading">Prescription Ordering</Box>

                      <Box className="orderline_box">
                        <Box className="order order_fill"></Box>
                        <Box className="order"></Box>
                        <Box className="order"></Box>
                        <Box className="order_line"></Box>
                      </Box>
                      <Box className="order_location">
                        <Box className="location start">
                          <Box className="top">Build</Box>
                          <Box className="bottom">Order</Box>
                        </Box>
                        <Box className="location">
                          Review
                          <br></br>
                          Order
                        </Box>
                        <Box className="location end">
                          <Box className="top">Send to</Box>
                          <Box className="bottom">Pharmacy</Box>
                        </Box>
                      </Box>

                      <Container maxWidth="lg">
                        <Box className="ordersteps_main">
                          {/* Upper Area */}
                          <Box className="steps_way">
                            <Box className="steps_line"></Box>

                            {/* Select a prescriber start */}
                            <Box className="steps">
                              <Box className="step_start">Step {additionalIndex + 1}</Box>
                              <Box className="place">Select a Prescriber</Box>
                              {order.selectPrescriber ? (
                                <Box className="order_fill_steps">
                                  <Box className="order_fill_right"></Box>
                                  <Box className="order_fill_rightr"></Box>
                                </Box>
                              ) : (
                                <Box className="back_processing">
                                  <Box className="back_processingin"></Box>
                                </Box>
                              )}
                            </Box>
                            <Container maxWidth="sm">
                              <Box className="nameof_customer">
                                <FormControl fullWidth>
                                  <RadioGroup defaultValue="patient" aria-labelledby="demo-customized-radios" name="billTo">
                                    <Grid container>
                                      <Stack className="prescriber_text_filed" direction="row" justifyContent="center">
                                        <Grid item className="radio_grid" sm={6} md={6} lg={6}>
                                          {user && user?.type === 'Doctor' ? (
                                            <FormControl className="form-input select" sx={{ width: '100%' }}>
                                              <Select placeholder="Choose prescriber" IconComponent={arrowIcon} required value={order?.selectPrescriber || prescribers[0].mdId}>
                                                {prescribers &&
                                                  prescribers.map((item: PrescriberInterface, index: number) => {
                                                    return (
                                                      <MenuItem value={item.mdId} key={index}>
                                                        {item?.firstName} {item.lastName}
                                                      </MenuItem>
                                                    );
                                                  })}
                                              </Select>
                                            </FormControl>
                                          ) : (
                                            <FormControl className="form-input select" sx={{ width: '100%' }}>
                                              <Select placeholder="Choose prescriber" IconComponent={arrowIcon} required value={order.selectPrescriber} onChange={(e) => setSelectedPrescriber(e.target.value)}>
                                                <MenuItem value={''}>Choose a Prescriber </MenuItem>
                                                {prescribers &&
                                                  prescribers.map((item: PrescriberInterface, index: number) => {
                                                    return (
                                                      <MenuItem value={item.mdId} key={index}>
                                                        {item?.firstName} {item?.lastName}
                                                      </MenuItem>
                                                    );
                                                  })}
                                              </Select>
                                            </FormControl>
                                          )}
                                        </Grid>
                                      </Stack>
                                    </Grid>
                                  </RadioGroup>
                                </FormControl>
                              </Box>
                            </Container>
                            {/* Select a prescriber end */}

                            {/* Select bill to starts */}
                            <Box className="steps">
                              <Box className="step_start">Step {additionalIndex + 2}</Box>
                              <Box className="place">Bill To</Box>
                              {order?.billTo?.type ? (
                                <Box className="order_fill_steps">
                                  <Box className="order_fill_right"></Box>
                                  <Box className="order_fill_rightr"></Box>
                                </Box>
                              ) : (
                                <Box className="back_processing">
                                  <Box className="back_processingin"></Box>
                                </Box>
                              )}
                            </Box>
                            <Container maxWidth="sm">
                              <Box className="nameof_customer">
                                <FormControl fullWidth>
                                  <RadioGroup defaultValue={order?.billTo?.type} aria-labelledby="demo-customized-radios" name="billTo">
                                    <Grid container>
                                      <Stack className="radio_btn_stack" direction="row" justifyContent="space-between">
                                        <Grid item className="radio_grid" id="shipto_Facility_box" sm={6} md={6} lg={6}>
                                          <FormControlLabel value="patient" control={<Radio onChange={() => setBillTo('patient')} />} label="patient" checked={order?.billTo?.type === 'patient'} />
                                        </Grid>
                                        <Grid item className="radio_grid" sm={6} md={6} lg={6} pl={8}>
                                          <FormControlLabel value="facility" control={<Radio onChange={() => setBillTo('facility')} />} label="Facility" checked={order?.billTo?.type === 'facility'} />
                                          {order?.billTo?.type === 'facility' && (
                                            <>
                                              <FormControl className="form-input select" sx={{ width: '100%' }}>
                                                <Select
                                                  IconComponent={arrowIcon}
                                                  className="shipto_Facility_select"
                                                  required
                                                  value={order?.billTo?.value}
                                                  onChange={(e) => setBillToValue(e.target.value)}
                                                  MenuProps={{
                                                    PaperProps: {
                                                      style: {
                                                        maxHeight: 200
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <MenuItem value={''}>Select Option</MenuItem>
                                                  {arOptions.map((item: { label: string; value: string }, arIndex: number) => {
                                                    return (
                                                      <MenuItem key={arIndex} value={item.value} className="menu_shipto_facility">
                                                        {item.label}
                                                      </MenuItem>
                                                    );
                                                  })}
                                                </Select>
                                              </FormControl>
                                              {arCardInfo && (
                                                <ul>
                                                  {arCardInfo && (
                                                    <>
                                                      <li className="edit" onClick={() => handleSelectFacilityCardsPopup()}>
                                                        <span className="edit_icon">
                                                          <img src={editIcon} alt="logo" height={10} width={10} />
                                                        </span>
                                                        <Typography component="p">Edit</Typography>
                                                      </li>
                                                      <li>
                                                        <span>{arCardInfo}</span>
                                                      </li>
                                                    </>
                                                  )}
                                                </ul>
                                              )}
                                            </>
                                          )}
                                        </Grid>
                                      </Stack>
                                      {order?.billTo?.type === 'patient' && (
                                        <Typography className="contact_by_phone">
                                          <span>*</span> If patient card is not on file, ImprimisRx will contact patient by phone for payment.
                                        </Typography>
                                      )}
                                    </Grid>
                                  </RadioGroup>
                                </FormControl>
                              </Box>
                            </Container>
                            {/* Select bill to ends */}

                            {/* Select ship to starts */}
                            <Box className="steps">
                              <Box className="step_start">Step {additionalIndex + 3}</Box>
                              <Box className="place">Ship To</Box>
                              {order?.shipTo?.type ? (
                                <Box className="order_fill_steps">
                                  <Box className="order_fill_right"></Box>
                                  <Box className="order_fill_rightr"></Box>
                                </Box>
                              ) : (
                                <Box className="back_processing">
                                  <Box className="back_processingin"></Box>
                                </Box>
                              )}
                            </Box>
                            <Container maxWidth="sm">
                              <Box className="nameof_customer">
                                <FormControl fullWidth>
                                  <RadioGroup defaultValue={order?.shipTo?.type} name="shipTo">
                                    <Grid container>
                                      <Stack className="radio_btn_stack" direction="row" justifyContent="space-between">
                                        <Grid item className="radio_grid" sm={6} md={6} lg={6}>
                                          <FormControlLabel value="patient" control={<Radio onChange={() => setShipTo('patient')} />} label="patient" checked={order?.shipTo?.type === 'patient'} />
                                        </Grid>
                                        <Grid item className="radio_grid" sm={6} md={6} lg={6} pl={8}>
                                          <FormControlLabel value="facility" control={<Radio onChange={() => setShipTo('facility')} />} label="facility" checked={order?.shipTo?.type === 'facility'} />
                                          {order?.shipTo?.type === 'facility' && order?.billTo?.type !== 'facility' ? (
                                            <>
                                              <FormControl className="form-input select" sx={{ width: '100%' }}>
                                                <Select
                                                  IconComponent={arrowIcon}
                                                  className="shipto_Facility_select"
                                                  required
                                                  value={order.shipTo.value}
                                                  onChange={(e) => setShipToValue(e.target.value)}
                                                  MenuProps={{
                                                    PaperProps: {
                                                      style: {
                                                        maxHeight: 200
                                                      }
                                                    }
                                                  }}
                                                >
                                                  <MenuItem value={''}>Select Option</MenuItem>
                                                  {arOptions.map((item: { label: string; value: string }, arIndex: number) => {
                                                    return (
                                                      <MenuItem key={arIndex} value={item.value}>
                                                        {item.label}
                                                      </MenuItem>
                                                    );
                                                  })}
                                                </Select>
                                              </FormControl>
                                              {arGroupAddress && (
                                                <ul>
                                                  <li>{`${arGroupAddress?.addr1} ${arGroupAddress?.addr2}, ${arGroupAddress?.city}, ${arGroupAddress?.state} ${arGroupAddress?.zip}`}</li>
                                                </ul>
                                              )}
                                            </>
                                          ) : (
                                            order?.shipTo?.type === 'facility' &&
                                            order?.shipTo?.value !== '' &&
                                            arGroupAddress && (
                                              <ul>
                                                <li>{`${arGroupAddress?.addr1} ${arGroupAddress?.addr2}, ${arGroupAddress?.city}, ${arGroupAddress?.state} ${arGroupAddress?.zip}`}</li>
                                              </ul>
                                            )
                                          )}
                                        </Grid>
                                      </Stack>
                                      {order?.shipTo?.type === 'patient' && <Typography className="contact_by_phone">{/* <span>*</span> If patient card is not on file, ImprimisRx will contact patient by phone for payment. */}</Typography>}
                                    </Grid>
                                  </RadioGroup>
                                </FormControl>
                              </Box>
                            </Container>
                            {/* Select ship to ends */}

                            {/* Need by date start */}
                            <Box className="steps">
                              <Box className="step_start">Step {additionalIndex + 4}</Box>
                              <Box className="place">Need by date</Box>
                              {order?.needByDate ? (
                                <Box className="order_fill_steps">
                                  <Box className="order_fill_right"></Box>
                                  <Box className="order_fill_rightr"></Box>
                                </Box>
                              ) : (
                                <Box className="back_processing">
                                  <Box className="back_processingin"></Box>
                                </Box>
                              )}
                            </Box>
                          </Box>

                          {/* Date Area  */}
                          <Container maxWidth="sm">
                            <Box className="nameof_customer" mt={2}>
                              <FormControl fullWidth>
                                <RadioGroup aria-labelledby="demo-customized-radios" name="shippingDate">
                                  {/* <Grid container mb={3}>
                                    <Stack className="radio_btn_stack" direction="row" justifyContent="space-evenly">
                                      <Grid item className="radio_grid">
                                        <FormControlLabel value="ups" control={<Radio onChange={(e) => setNeedByDate(e)} />} label="ups" />
                                      </Grid>
                                      <Grid item className="radio_grid">
                                        <FormControlLabel value="fedex" control={<Radio onChange={(e) => setNeedByDate(e)} />} label="fedex" />
                                      </Grid>
                                      <Grid item className="radio_grid">
                                        <FormControlLabel value="usps" control={<Radio onChange={(e) => setNeedByDate(e)} />} label="usps" />
                                      </Grid>
                                    </Stack>
                                  </Grid> */}
                                  <Stack className="date_pikker" direction="row" justifyContent="center" alignItems="center" mt={3}>
                                    <Typography component="h3">Select Date Here:</Typography>
                                    <Box className="date_input">
                                      {/* <FormControl className="form-input" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} id="prescribing_date"> */}
                                      {/* <TextField placeholder="Month 00-0000" required={true} value={order?.needByDate} type="date" onChange={(e) => setNeedByDate(e)} inputProps={{ style: { fontSize: '24px', color: '#02223A', lineHeight: '53px', fontWeight: '400', textAlign: 'center' } }} /> */}
                                      {/* <TextField placeholder="Month 00-0000" required={true} value={order?.needByDate} type='date' inputProps={{style:{fontSize:"24px",color:"#02223A",lineHeight:"53px",fontWeight:"400",paddingLeft: '50px'}}} disabled /> */}
                                      {/* </FormControl> */}
                                      <Box>
                                        <FormControl className="form-input" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} id="prescribing_date">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                              disablePast
                                              shouldDisableDate={(day) => {
                                                const currentDate = moment().startOf('day');
                                                return currentDate.toDate() >= day.toDate() || day.toDate() > maxDate.toDate();
                                              }}
                                              value={dayjs(order?.needByDate)}
                                              onChange={(e) => setNeedByDate(e)}
                                              slotProps={{
                                                textField: {
                                                  error: false,
                                                  inputProps: { readOnly: true },
                                                  className: 'centered-text'
                                                }
                                              }}
                                              // renderInput={(props) => <TextField {...props} required className="centered-text"/>}
                                            />
                                          </LocalizationProvider>
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </Stack>
                                </RadioGroup>
                              </FormControl>
                            </Box>
                          </Container>
                          {/* Need by date end */}

                          <Stack className="down" alignItems="center" justifyContent="center">
                            <img src={DownLines} alt="logo" height={100} width={200} />
                          </Stack>

                          {/* Blocs Area starts*/}
                          {order?.blocks?.length > 0 &&
                            order?.blocks.map((block: Block, i: number) => {
                              return (
                                <Box className="add_patient_main" key={i}>
                                  <Box className="cornar_box">Prescription Block {1 + i}</Box>
                                  {/* Add patient starts */}
                                  <Container maxWidth="lg" className="steps_main">
                                    <Box className="steps_way">
                                      <Box className="steps_line"></Box>
                                      <Box className="steps">
                                        <Box className="step_start step_start_border">Step {additionalIndex + 5}</Box>
                                        {!addPatient && (
                                          <Box className="place" onClick={(e) => handleAddPatientBlock(e)}>
                                            <span className="plus_icon">
                                              <img src={PlusIcon} alt="logo" height={14} width={14} />
                                            </span>
                                            Add Patient
                                          </Box>
                                        )}
                                        {addPatient && (
                                          <Box className="place_searchbar">
                                            <Box className="recent-order-table-layouts">
                                              <span className="plus_icon">
                                                <img src={userIcon} alt="logo" className="userr_icon" />
                                              </span>
                                              <Autocomplete
                                                disablePortal
                                                options={patientData.map((item) => {
                                                  return { label: item.fname + ' ' + item.lname, value: item.pat_id, item };
                                                })}
                                                sx={{ display: 'inline-block', '& input': { width: 300, bgcolor: 'background.paper', color: (theme) => theme.palette.getContrastText(theme.palette.background.paper) } }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    placeholder="Search An Existing Patient"
                                                    {...params}
                                                    className="search_input"
                                                    InputProps={{
                                                      ...params.InputProps,
                                                      endAdornment: (
                                                        <InputAdornment position="end">
                                                          <SearchIcon />
                                                        </InputAdornment>
                                                      )
                                                    }}
                                                  />
                                                )}
                                                renderOption={(props: HTMLAttributes<HTMLLIElement>, option: { label: string; value: string; item: PatientInterface }, state: AutocompleteRenderOptionState) => {
                                                  (props as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>).key = String(props.id);
                                                  const defaultOnClick = props.onClick;
                                                  props.onClick = (e) => {
                                                    onSelectPatient(option, block, i);
                                                    if (defaultOnClick) {
                                                      defaultOnClick(e);
                                                    }
                                                  };
                                                  return (
                                                    <div {...(props as DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>)} className="autoOptionSearch">
                                                      <div className="custom_option_heading">{option?.item?.fname + ' ' + option?.item?.lname}</div>
                                                      <div className="custom_option_heading">{moment.utc(option?.item?.birth_date).format('MM/DD/YYYY')}</div>
                                                    </div>
                                                  );
                                                }}
                                              />
                                            </Box>
                                            <Box>
                                              <Stack className="start_prescription_btn" direction="row" justifyContent="center">
                                                <NewPrescriptionPrimaryBtn onClick={() => setCreatePatientPopUp({ ...createPatientPopUp, showDialog: true, mdId: order?.selectPrescriber, blockIndex: i })} label="Create New Patient"></NewPrescriptionPrimaryBtn>
                                              </Stack>
                                              <Box className="create_order_place" onClick={() => setCreatePatientPopUp({ ...createPatientPopUp, showDialog: true, mdId: order?.selectPrescriber, blockIndex: i })}>
                                                <span className="order_plus_icon">
                                                  <img src={PlusIcon} alt="logo" height={14} width={14} />
                                                </span>
                                              </Box>
                                            </Box>
                                          </Box>
                                        )}
                                        {createPatientPopUp?.showDialog && (
                                          <BootstrapDialog onClose={() => setCreatePatientPopUp({ ...createPatientPopUp, showDialog: false })} open={createPatientPopUp?.showDialog} PaperProps={{ style: { minHeight: '84%', maxHeight: '94%', minWidth: '40%', maxWidth: 1100 } }}>
                                            <PrescriptionAddNewPatient handleClose={(res: boolean, patId?: string, blockIndex?: number) => handlePatientCallBack(res, patId, blockIndex)} mdId={createPatientPopUp?.mdId} blockIndex={createPatientPopUp?.blockIndex} />
                                          </BootstrapDialog>
                                        )}
                                        {order.blocks[0].patients && order.blocks[0].patients.length > 0 ? (
                                          <Box className="order_fill_steps">
                                            <Box className="order_fill_right"></Box>
                                            <Box className="order_fill_rightr"></Box>
                                          </Box>
                                        ) : (
                                          <Box className="back_processing">
                                            <Box className="back_processingin"></Box>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className="patient_card_container">
                                        <Box className="empty_margin"></Box>
                                        <Box className="patient_data_info">
                                          <Stack direction="row" justifyContent="center" alignItems="center" className="patientNewOrder" sx={{ width: '100%' }}>
                                            {block.patients.map((patient: PatientInterface, pIndex: number) => {
                                              return (
                                                <Container maxWidth="sm" key={pIndex}>
                                                  <Accordion className="detof_patient">
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" style={{ padding: '0px 16px 0px 0px' }}>
                                                      <Box className="detof_customer_new">
                                                        <Box className="customer-number">{pIndex + 1}</Box>
                                                        <ul>
                                                          <li style={{ marginTop: '5px', width: '5%' }} className="user_icon">
                                                            <img src={UserImage} alt="logo" height={20} width={20} />
                                                          </li>
                                                          <li style={{ textAlign: 'right', width: '35%' }} className="pat_name">{`${patient.fname} ${patient.lname}`}</li>
                                                          <li style={{ color: '#00ACBA' }}>|</li>
                                                          <li style={{ marginRight: '20px' }} className="dob_text">
                                                            DOB: {moment.utc(patient.birth_date).format('MM/DD/YYYY')}
                                                          </li>
                                                          <li style={{ marginTop: '5px' }} className="delete_icon">
                                                            <img src={Deleatnew} alt="logo" height={20} width={20} onClick={(e) => deletePatient(e, pIndex, block, i)} />
                                                          </li>
                                                        </ul>
                                                      </Box>
                                                    </AccordionSummary>
                                                    <AccordionDetails className="accordean">
                                                      <Box className="devider">
                                                        <Box className="devider-line"></Box>
                                                      </Box>
                                                      <Container maxWidth="sm">
                                                        <Box className="Medication">
                                                          <Box className="quantity">
                                                            <h4>Phone Number</h4>
                                                            <span>{`(${patient.area_code}) ${patient.phone_no.slice(0, 3)}-${patient.phone_no.slice(3)}`}</span>
                                                            <h4>Home address</h4>
                                                            <span>{`${patient?.addr1 ? patient?.addr1 : patient?.addr1} ${patient?.state_cd ? patient?.state_cd : patient?.state_cd} ${patient?.zip ? patient?.zip : patient?.zip}`}</span>
                                                          </Box>
                                                          <Box className="dash"></Box>
                                                          <Box className="quantity">
                                                            <h4>Payment Method</h4>
                                                            <span>xxxx - Ending {patient?.lastFourDigits}</span>
                                                            {/* <h4>Comments</h4> */}
                                                            {/* <Box>
                                                            <FormControl sx={{ width: '100%' }}>
                                                              <TextField multiline fullWidth label={'Comment'} />
                                                            </FormControl>
                                                          </Box> */}
                                                          </Box>
                                                        </Box>
                                                      </Container>
                                                    </AccordionDetails>
                                                  </Accordion>
                                                </Container>
                                              );
                                            })}
                                          </Stack>
                                        </Box>
                                      </Box>
                                      <Box className="steps">
                                        <Box className="step_start step_start_border">Step {additionalIndex + 6}</Box>
                                        <Box className="place" onClick={(e) => handleMedicationPopup(e, block, i)}>
                                          <span className="plus_icon">
                                            <img src={PlusIcon} alt="logo" height={14} width={14} />
                                          </span>
                                          Add Medication
                                        </Box>

                                        {order.blocks[0].prescriptions && order.blocks[0].prescriptions.length > 0 ? (
                                          <Box className="order_fill_steps">
                                            <Box className="order_fill_right"></Box>
                                            <Box className="order_fill_rightr"></Box>
                                          </Box>
                                        ) : (
                                          <Box className="back_processing">
                                            <Box className="back_processingin"></Box>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Container>
                                  {/* Add patient end */}

                                  {/* Add prescription start */}
                                  {block.prescriptions.length > 0 && (
                                    <Box className="patient_card_container">
                                      <Box className="empty_margin"></Box>
                                      <Box className="patient_data_info">
                                        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
                                          <Container maxWidth="sm">
                                            <Box className="detof_prod">
                                              <Box className="product">
                                                <p>Product</p>
                                                <p>Price</p>
                                              </Box>

                                              {block.prescriptions.map((prescription: Medication | any, index: number) => {
                                                return (
                                                  <>
                                                    <Accordion key={index}>
                                                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                                        <Box className="panel1a product_panel" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0', padding: '0px 30px' }}>
                                                          <Box className="sale">
                                                            <Box className="product-name">
                                                              <span
                                                                style={{
                                                                  display: 'flex',
                                                                  alignItems: 'center',
                                                                  justifyContent: 'center',
                                                                  width: '30px'
                                                                }}
                                                              >
                                                                <img src={`https://www.imprimisrx.com/s/sfsites/c/cms/delivery/media/${prescription?.selectedMedication?.contentKey}`} alt="logo" height={30} />
                                                              </span>
                                                              {prescription?.selectedMedication?.shortName}
                                                            </Box>
                                                            <Box className="product-price">
                                                              <ul>
                                                                <li>${prescription?.price}</li>
                                                                <li style={{ display: 'flex', gap: '10px' }}>
                                                                  {/* <div>
                                                                    <img
                                                                      src={Editnew}
                                                                      alt="logo"
                                                                      height={20}
                                                                      width={20}
                                                                      onClick={(e) => {
                                                                        handleEditMedicationPopup(e, block, i, index);
                                                                      }}
                                                                    />
                                                                  </div> */}
                                                                  <div>
                                                                    <img src={Deleatnew} alt="logo" height={20} width={20} onClick={(e) => deletePrescription(e, i, block, index)} />
                                                                  </div>
                                                                </li>
                                                              </ul>
                                                            </Box>
                                                          </Box>
                                                        </Box>
                                                      </AccordionSummary>
                                                      <AccordionDetails>
                                                        <Box className="devider">
                                                          <Box className="devider-line"></Box>
                                                        </Box>
                                                        <p>Medication details</p>
                                                        <Container maxWidth="sm">
                                                          <Box className="Medication">
                                                            <Box className="quantity">
                                                              <h4>Quantity</h4>
                                                              <span>{prescription?.quantityLabel && prescription?.quantityLabel}</span>
                                                              <h4>Refill</h4>
                                                              <span>{prescription?.refills && prescription?.refills}</span>
                                                            </Box>
                                                            <Box className="dash"></Box>
                                                            <Box className="quantity">
                                                              {/* <h4>Day Supply</h4>
                                                              <span title={prescription?.supply} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                                {prescription?.supply}
                                                              </span> */}
                                                              <h4>Storage Temperature</h4>
                                                              <p>{prescription?.temperature} </p>
                                                            </Box>
                                                          </Box>
                                                          {/* <ul className="button-two">
                                                        <li>
                                                          <button className="btn cancle-btn">Cancel</button>
                                                        </li>
                                                        <li>
                                                          <button className="btn save-btn">Save</button>
                                                        </li>
                                                      </ul> */}
                                                        </Container>
                                                      </AccordionDetails>
                                                    </Accordion>
                                                  </>
                                                );
                                              })}
                                            </Box>
                                          </Container>
                                        </Stack>
                                      </Box>
                                    </Box>
                                  )}
                                  {/* Add prescription end */}

                                  {/* Delete button start */}
                                  {order.blocks.length > 1 && (
                                    <Box className="deleat_icon" onClick={() => deleteBlock(i)}>
                                      <img src={Deleat} alt="logo" height={42} width={42} />
                                    </Box>
                                  )}
                                  {/* Delete button end */}
                                </Box>
                              );
                            })}
                          {/* Block Area ends */}

                          {/* Add new block button start */}
                          <Stack className="down down_last" direction="row" alignItems="center" justifyContent="center" onClick={(e) => addBlock(e)}>
                            <span className="last_add_block">
                              <img src={PlusIcon} alt="logo" height={14} width={14} />
                            </span>
                            Add New Prescription Block
                          </Stack>
                          {/* Add new block button end */}

                          <Stack className="down preview_button" mt={2} direction="row" alignItems="center" justifyContent="center">
                            <img src={PrescribeOrder} alt="logo" height={100} width={280} onClick={handlePrescribeOrderDetail} />
                          </Stack>
                        </Box>
                      </Container>
                    </Box>
                  </Container>
                </Box>
              </Box>
            </Box>
          </Stack>

          {/* Button to review screen start */}
          <Box className="prescribe-order-icon" onClick={handlePrescribeOrderDetail}>
            <img src={PrescribeOrder} alt="logo" height={100} width={150} />
          </Box>
          {/* Button to review screen end */}

          {/* Chat logo start */}
          <Box className="chat-floating-icon">
            <img src={Chat} alt="logo" height={76} width={76} />
          </Box>
          {/* Chat logo end */}
        </>
      )}
    </>
  );
}
