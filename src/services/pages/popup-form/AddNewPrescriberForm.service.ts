import { FormBuilder, Validators } from 'react-reactive-form';

import { ADD_NEW_PRESCRIBER } from '../../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../../../models/User';
import { toast } from 'react-toastify';
import Doctor from '../../../constants/grx-api';

export let addNewPrescriberForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  npi: ['', [Validators.required]],
  email: ['', [Validators.email]],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  donot_npi: [false]
});

export const AddNewPrescriberFormHandler = async (router: NavigateFunction, props: { handleClose: (e: string) => void }, userData: User) => {
  try {
    addNewPrescriberForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.npi.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewPrescriberForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });

    if (
      addNewPrescriberForm.controls.firstName.invalid ||
      addNewPrescriberForm.controls.lastName.invalid ||
      addNewPrescriberForm.controls.email.invalid ||
      addNewPrescriberForm.controls.phone.invalid ||
      addNewPrescriberForm.controls.street.invalid ||
      addNewPrescriberForm.controls.city.invalid ||
      addNewPrescriberForm.controls.state.invalid ||
      addNewPrescriberForm.controls.code.invalid
    ) {
      return;
    }

    if (!addNewPrescriberForm.value.donot_npi && !addNewPrescriberForm.value.npi) {
      return;
    }

    let data = {
      firstName: addNewPrescriberForm.value.firstName,
      lastName: addNewPrescriberForm.value.lastName,
      phone: addNewPrescriberForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      email: addNewPrescriberForm.value.email,
      npi: addNewPrescriberForm.value.npi,
      apt_suite: addNewPrescriberForm.value.apt_suite,
      street: addNewPrescriberForm.value.street,
      city: addNewPrescriberForm.value.city,
      state: addNewPrescriberForm.value.state,
      code: addNewPrescriberForm.value.code
    };

    const res: AxiosResponse = await Doctor.post(`${ADD_NEW_PRESCRIBER}/${addNewPrescriberForm.value.npi}`, data);

    if (res?.status === 201 || res?.status === 200) {
      addNewPrescriberForm.reset();
      toast(`Thank you for adding your new Prescriber! We're reviewing your request and if approved, your new prescriber information will show on your account soon`);
      props.handleClose('New Prescriber Added');
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
