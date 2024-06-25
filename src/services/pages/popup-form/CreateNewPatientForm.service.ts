import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosError, AxiosResponse } from 'axios';
import Doctor from '../../../constants/grx-api';
import { NEW_PATIENT, AUTH_DOCTOR_PORTAL, ADD_NEW_CARD } from '../../../constants/Endpoints';
import { User } from '../../../models/User';
import { toast } from 'react-toastify';
import moment from 'moment';

export const CreateNewPatientForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  gender: ['', [Validators.required]],
  dob: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
  email: ['', [Validators.email]],
  phone: ['', [Validators.required]],
  blueViewNetwork: [''],
  // memberId: ['',],
  isAllergies: ['true'],
  allergies: ['', [Validators.required]],
  cMedications: ['', [Validators.required]],
  pCondition: ['', [Validators.required]],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  isPaymentMethod: ['true'],
  cardholderName: ['', [Validators.required]],
  cardNumber: ['', [Validators.required]],
  expiry: ['', [Validators.required]],
  cvv: ['', [Validators.required]],
  zip_code: ['', [Validators.required]],
  country: ['US', [Validators.required]]
});

export const CreatePatientHandler = async (
  user: User,
  props: {
    handleClose: () => void;
  }
) => {
  try {
    const controls = CreateNewPatientForm.controls;
    controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.gender.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.dob.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.blueViewNetwork.markAsTouched({ emitEvent: true, onlySelf: true });
    // controls.memberId.markAsTouched({ emitEvent: true, onlySelf: true });

    controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.code.markAsTouched({ emitEvent: true, onlySelf: true });

    controls.cardholderName.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.cardNumber.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.expiry.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.cvv.markAsTouched({ emitEvent: true, onlySelf: true });
    controls.zip_code.markAsTouched({ emitEvent: true, onlySelf: true });

    controls.allergies.markAsTouched({ emitEvent: true, onlySelf: true });

    if (controls.firstName.invalid || controls.lastName.invalid || controls.gender.invalid || controls.dob.invalid || controls.email.invalid || controls.phone.invalid || controls.blueViewNetwork.invalid) {
      return;
    }

    if (controls.street.invalid || controls.apt_suite.invalid || controls.city.invalid || controls.state.invalid || controls.code.invalid) {
      return;
    }

    // eslint-disable-next-line eqeqeq
    if (controls.isAllergies.value == 'true' && controls.allergies.invalid) {
      return;
    }

    // eslint-disable-next-line eqeqeq
    if (controls.isPaymentMethod.value == 'true' && (controls.cardholderName.invalid || controls.cardNumber.invalid || controls.expiry.invalid || controls.cvv.invalid || controls.zip_code.invalid)) {
      return;
    }

    const mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
    let patientdata = {
      md_id: mdId,
      first_name: CreateNewPatientForm?.value?.firstName,
      last_name: CreateNewPatientForm?.value?.lastName,
      gender: CreateNewPatientForm?.value?.gender,
      dob: moment(CreateNewPatientForm?.value?.dob).format('YYYY-MM-DD'),
      email: CreateNewPatientForm.value.email !== '' && CreateNewPatientForm.value.email !== null ? CreateNewPatientForm.value.email : '',
      mobile: CreateNewPatientForm?.value?.phone?.replaceAll('-', '')?.replaceAll(' ', '')?.replaceAll('(', '')?.replaceAll(')', ''),
      blueViewNetwork: CreateNewPatientForm?.value?.blueViewNetwork !== '' ? CreateNewPatientForm?.value?.blueViewNetwork : false,
      // memberId: CreateNewPatientForm?.value?.memberId,
      isAllergies: CreateNewPatientForm?.value?.isAllergies,
      allergies: CreateNewPatientForm?.value?.allergies ? CreateNewPatientForm?.value?.allergies.split(',') : ['No Known Allergies'],
      cMedications: CreateNewPatientForm?.value?.cMedications,
      pCondition: CreateNewPatientForm?.value?.pCondition,
      street: CreateNewPatientForm?.value?.street,
      apt_suite: CreateNewPatientForm?.value?.apt_suite !== '' ? CreateNewPatientForm.value.apt_suite : '',
      city: CreateNewPatientForm?.value?.city,
      state: CreateNewPatientForm?.value?.state,
      code: CreateNewPatientForm?.value?.code,
      country: CreateNewPatientForm?.value?.country,
      paymentMethod: CreateNewPatientForm?.value?.isPaymentMethod,
      cardholderName: CreateNewPatientForm?.value?.cardholderName,
      cardNumber: CreateNewPatientForm?.value?.cardNumber?.replaceAll('-', ''),
      expiry: CreateNewPatientForm?.value?.expiry,
      cvv: CreateNewPatientForm?.value?.cvv?.replaceAll('_', ''),
      zip_code: CreateNewPatientForm?.value?.zip_code,
      user: mdId
    };

    let cardData = {
      pat_id: '20034',
      default: true,
      number: CreateNewPatientForm?.value?.cardNumber?.replace(/\s/g, ''),
      cvc: CreateNewPatientForm?.value?.cvv?.replaceAll('_', ''),
      expirationMonth: CreateNewPatientForm?.value?.expiry.split('/')[0],
      expirationYear: `20${CreateNewPatientForm?.value?.expiry.split('/')[1]}`,
      billingAddress: {
        address1: CreateNewPatientForm?.value?.street,
        state: CreateNewPatientForm?.value?.state,
        city: CreateNewPatientForm?.value?.city,
        zipCode: CreateNewPatientForm?.value?.zip_code
      },
      address: {
        state: CreateNewPatientForm?.value?.state,
        address1: CreateNewPatientForm?.value?.street,
        city: CreateNewPatientForm?.value?.city,
        zipCode: CreateNewPatientForm?.value?.zip_code,
        country: CreateNewPatientForm?.value?.country
      }
    };

    const res: AxiosResponse = await Doctor.post(NEW_PATIENT, patientdata);
    if (res.data.statusCode === 420) {
      toast(res.data.message);
    } else {
      toast('Patient added successfully');
      if (CreateNewPatientForm?.value?.isPaymentMethod === 'true' && Array.isArray(res?.data?.data)) {
        cardData.pat_id = res?.data?.data[0]?.PatID;
        const addCardRes: AxiosResponse = await Doctor.post(ADD_NEW_CARD, cardData);
        if (addCardRes.status === 201) {
          toast('Card added successfully');
        } else {
          toast('Unable to add card');
        }
      }
      CreateNewPatientForm.reset();
      CreateNewPatientForm.patchValue({
        allergies: '',
        apt_suite: '',
        blueViewNetwork: '',
        cMedications: '',
        cardNumber: '',
        cardholderName: '',
        city: '',
        code: '',
        country: 'US',
        cvv: '',
        dob: '',
        email: '',
        expiry: '',
        firstName: '',
        gender: '',
        isAllergies: 'true',
        isPaymentMethod: 'true',
        lastName: '',
        memberId: '',
        pCondition: '',
        phone: '',
        state: '',
        street: '',
        zip_code: ''
      });
      return props.handleClose();
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
