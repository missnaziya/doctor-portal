import { FormBuilder, Validators } from 'react-reactive-form';

import { ADD_NEW_SHIPPING_ADDRESS } from '../../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import Doctor from '../../../constants/grx-api';
import { NavigateFunction } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';

export const addNewShippingAddressForm = FormBuilder.group({
  street: ['', [Validators.required]],
  apt_suite: ['', [Validators.required]],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  address: ['', [Validators.required]]
});

export const AddNewShippingAddressFormHandler = async (event: React.SyntheticEvent, router: NavigateFunction) => {
  try {
    event.preventDefault();
    addNewShippingAddressForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewShippingAddressForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewShippingAddressForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewShippingAddressForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewShippingAddressForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewShippingAddressForm.controls.address.markAsTouched({ emitEvent: true, onlySelf: true });

    if (addNewShippingAddressForm.invalid) {
      return;
    }
    let data = {
      street: addNewShippingAddressForm.value.street,
      apt_suite: addNewShippingAddressForm.value.apt_suite,
      city: addNewShippingAddressForm.value.city,
      state: addNewShippingAddressForm.value.state,
      postal_code: addNewShippingAddressForm.value.code,
      address: addNewShippingAddressForm.value.address
    };
    const res: AxiosResponse = await Doctor.post(ADD_NEW_SHIPPING_ADDRESS, data);
    if (res.data.status === 'Error') {
      return toast(res.data.message);
    }

    if (res.data.status === 'OK') {
      toast('Add New Prescriber Registered Successfully');
      // router.back();
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
