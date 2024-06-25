import { FormBuilder, Validators } from 'react-reactive-form';
import { REGISTER_DOCTOR_STEP_ONE, REGISTER_DOCTOR_STEP_TWO, REGISTER_STAFF_STEP_ONE, REGISTER_STAFF_STEP_TWO, REGISTER_STAFF } from '../../constants/Endpoints';

import { AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import Doctor from '../../constants/grx-api';
import { toast } from 'react-toastify';
import { User } from '../../models/User';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';

export const staffSignUpForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
  npi: ['', [Validators.required]],
  donot_npi: [false],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  staff_firstName: ['', [Validators.required]],
  staff_lastName: ['', [Validators.required]],
  staff_phone: ['', [Validators.required]],
  staff_email: ['', [Validators.required]],
  rememberMe: [true, []]
});

export const staffSignUpHandler = async (router: NavigateFunction) => {
  try {
    staffSignUpForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.password.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.npi.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.staff_firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.staff_lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.staff_phone.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.staff_email.markAsTouched({ emitEvent: true, onlySelf: true });
    staffSignUpForm.controls.rememberMe.markAsTouched({ emitEvent: true, onlySelf: true });

    // if (staffSignUpForm.invalid) {
    //   return;
    // }
    if (
      staffSignUpForm.controls.firstName.invalid ||
      staffSignUpForm.controls.lastName.invalid ||
      staffSignUpForm.controls.email.invalid ||
      staffSignUpForm.controls.phone.invalid ||
      staffSignUpForm.controls.password.invalid ||
      staffSignUpForm.controls.street.invalid ||
      staffSignUpForm.controls.apt_suite.invalid ||
      staffSignUpForm.controls.code.invalid ||
      staffSignUpForm.controls.state.invalid ||
      staffSignUpForm.controls.phone.invalid ||
      staffSignUpForm.controls.staff_firstName.invalid ||
      staffSignUpForm.controls.staff_lastName.invalid ||
      staffSignUpForm.controls.staff_phone.invalid ||
      staffSignUpForm.controls.staff_email.invalid
    ) {
      return;
    }
    if (!staffSignUpForm.value.donot_npi && !staffSignUpForm.value.npi) {
      return;
    }

    const phoneNo = staffSignUpForm.value.staff_phone;
    const areaCodeForStaff = phoneNo.slice(1, phoneNo.indexOf(')'));
    const phoneNoDigits = phoneNo.replace(/\D/g, '');
    const phoneNumberFormattedForStaff = `${phoneNoDigits.slice(3)}`;

    let data = {
      npi: staffSignUpForm.value.npi,
      doctorEmail: staffSignUpForm.value.email,
      email: staffSignUpForm.value.staff_email,
      firstName: staffSignUpForm.value.staff_firstName,
      lastName: staffSignUpForm.value.staff_lastName,
      dateOfBirth: null,
      gender: null,
      password: staffSignUpForm.value.password,
      phoneNumber: {
        areaCode: areaCodeForStaff,
        number: phoneNumberFormattedForStaff
      },
      address: {
        city: staffSignUpForm.value.city,
        state: staffSignUpForm.value.state,
        zipCode: staffSignUpForm.value.code,
        address1: staffSignUpForm.value.street,
        country: 'US'
      },
      rememberMe: staffSignUpForm.value.rememberMe

      // mobile: staffSignUpForm.value.staff_phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      // street: staffSignUpForm.value.street,
      // apt_suite: staffSignUpForm.value.apt_suite,
      // city: staffSignUpForm.value.city,
      // state: staffSignUpForm.value.state,
      // postal_code: staffSignUpForm.value.code,
      // country: 'US',
      // pres_fname: staffSignUpForm.value.firstName,
      // pres_lname: staffSignUpForm.value.lastName,
      // pres_email: staffSignUpForm.value.email
    };
    const responseStep1: AxiosResponse = await DoctorWithoutToken.post(REGISTER_STAFF_STEP_ONE, data);

    if (responseStep1.status === 201) {
      const responseStep2: AxiosResponse = await DoctorWithoutToken.post(`${REGISTER_STAFF_STEP_TWO}/${responseStep1.data.contactId}`);
      // toast('Registered Successfully');
      // router('/home/dashboard');
      if (responseStep2.status === 201) {
        sessionStorage.setItem('isSessionOngoing', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionToken', responseStep2?.data?.token);
        localStorage.setItem('refreshToken', responseStep2?.data?.refreshToken);
        toast('Registered Successfully');
        router('/home/dashboard');
        return User.create(responseStep2?.data?.account, true);
      }
    }
  } catch (err: any) {
    if (err?.response?.data?.message) {
      toast(err?.response.data.message);
      return;
    }
  }
};

export const physicianSignUpForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  notification_preference: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
  npi: ['', [Validators.required]],
  donot_npi: [false],
  specialty: ['', [Validators.required]],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  rememberMe: [true, []]
});

export const physicianSignUpHandler = async (router: NavigateFunction) => {
  try {
    physicianSignUpForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.notification_preference.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.password.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.npi.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.specialty.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });
    physicianSignUpForm.controls.rememberMe.markAsTouched({ emitEvent: true, onlySelf: true });

    if (
      physicianSignUpForm.controls.firstName.invalid ||
      physicianSignUpForm.controls.lastName.invalid ||
      physicianSignUpForm.controls.email.invalid ||
      physicianSignUpForm.controls.phone.invalid ||
      physicianSignUpForm.controls.notification_preference.invalid ||
      physicianSignUpForm.controls.password.invalid ||
      physicianSignUpForm.controls.specialty.invalid ||
      physicianSignUpForm.controls.street.invalid ||
      physicianSignUpForm.controls.apt_suite.invalid ||
      physicianSignUpForm.controls.code.invalid ||
      physicianSignUpForm.controls.state.invalid ||
      physicianSignUpForm.controls.city.invalid
    ) {
      return;
    }

    if (!physicianSignUpForm.value.donot_npi && !physicianSignUpForm.value.npi) {
      return;
    }

    const phoneNumber = physicianSignUpForm.value.phone;
    const areaCode = phoneNumber.slice(1, phoneNumber.indexOf(')'));
    const phoneNumberDigits = phoneNumber.replace(/\D/g, '');
    const phoneNumberFormatted = `${phoneNumberDigits.slice(3)}`;
    let data = {
      npi: physicianSignUpForm.value.npi,
      email: physicianSignUpForm.value.email,
      firstName: physicianSignUpForm.value.firstName,
      lastName: physicianSignUpForm.value.lastName,
      dateOfBirth: null,
      gender: null,
      password: physicianSignUpForm.value.password,
      specialty: physicianSignUpForm.value.specialty,
      notificationPreference: physicianSignUpForm.value.notification_preference,
      phoneNumber: {
        areaCode: areaCode,
        number: phoneNumberFormatted
      },
      address: {
        city: physicianSignUpForm.value.city,
        state: physicianSignUpForm.value.state,
        zipCode: physicianSignUpForm.value.code,
        address1: physicianSignUpForm.value.street,
        country: 'US'
      },
      rememberMe: physicianSignUpForm.value.rememberMe
      // mobile: physicianSignUpForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      // username: physicianSignUpForm.value.email,
      // street: physicianSignUpForm.value.street,
      // city: physicianSignUpForm.value.city,
      // state: physicianSignUpForm.value.state,
      // postal_code: physicianSignUpForm.value.code,
      // country: 'US',
      // notificationPreferences: [physicianSignUpForm.value.notification_preference],
      // stateLicenseNumber : physicianSignUpForm.value.npi,
      // apt_suite: physicianSignUpForm.value.apt_suite,
    };
    const resStep1: AxiosResponse = await DoctorWithoutToken.post(REGISTER_DOCTOR_STEP_ONE, data);
    if (resStep1.data.status === 'Error') {
      return toast(resStep1.data.message);
    }

    if (resStep1.status === 201) {
      const resStep2: AxiosResponse = await DoctorWithoutToken.post(`${REGISTER_DOCTOR_STEP_TWO}/${resStep1.data.contactId}`);
      if (resStep2.status === 201 || resStep2.status === 200) {
        sessionStorage.setItem('isSessionOngoing', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionToken', resStep2?.data?.token);
        localStorage.setItem('refreshToken', resStep2?.data?.refreshToken);
        toast('Registered Successfully');
        router('/home/dashboard');
        return User.create(resStep2?.data?.account, true);
      } else {
        toast(resStep2.data.message);
      }
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
