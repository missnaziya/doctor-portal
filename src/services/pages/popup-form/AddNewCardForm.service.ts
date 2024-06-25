import { FormBuilder, Validators } from 'react-reactive-form';

import { AUTH_DOCTOR_PORTAL, ADD_NEW_CARD } from '../../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import Doctor from '../../../constants/grx-api';
import { NavigateFunction } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';

export const addNewCardForm = FormBuilder.group({
  pat_id: ['', [Validators.required]],
  cc_number: ['', [Validators.required]],
  exp_date: ['', [Validators.required]],
  cvc: ['', [Validators.required]],
  cardholdername: ['', [Validators.required]],
  billingZc: ['', [Validators.required]],
  // patId: ['', Validators.required],
  street: ['', Validators.required],
  city: ['', Validators.required],
  state: ['', Validators.required],
  country: ['US', Validators.required]
});

export const AddNewCardFormHandler = async (event: React.SyntheticEvent, router: NavigateFunction) => {
  try {
    // event.preventDefault();
    addNewCardForm.controls.pat_id.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewCardForm.controls.cc_number.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewCardForm.controls.exp_date.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewCardForm.controls.cvc.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewCardForm.controls.cardholdername.markAsTouched({ emitEvent: true, onlySelf: true });
    addNewCardForm.controls.billingZc.markAsTouched({ emitEvent: true, onlySelf: true });

    if (addNewCardForm.invalid) {
      console.log('check1', addNewCardForm.value);
      return;
    }

    let cardData: any = {
      pat_id: addNewCardForm?.value?.pat_id,
      default: true,
      number: addNewCardForm?.value?.cc_number?.replace(/\s/g, ''),
      cvc: addNewCardForm?.value?.cvc?.replaceAll('_', ''),
      expirationMonth: addNewCardForm?.value?.exp_date.split('/')[0],
      expirationYear: `20${addNewCardForm?.value?.exp_date.split('/')[1]}`,
      billingAddress: {
        address1: addNewCardForm?.value?.street,
        state: addNewCardForm?.value?.state,
        city: addNewCardForm?.value?.city,
        zipCode: addNewCardForm?.value?.billingZc
      },
      address: {
        state: addNewCardForm?.value?.state,
        address1: addNewCardForm?.value?.street,
        city: addNewCardForm?.value?.city,
        zipCode: addNewCardForm?.value?.billingZc,
        country: addNewCardForm?.value?.country
      }
    };

    const addCardRes: AxiosResponse = await Doctor.post(ADD_NEW_CARD, cardData);
    if (addCardRes.status === 201) {
      toast('Card added successfully');
      addNewCardForm.reset();
      addNewCardForm.patchValue({
        country: 'US'
      });
      return 'OK';
    }
    toast(addCardRes?.data?.message);
    return false;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
