import { FormBuilder, Validators } from 'react-reactive-form';

import { AUTH_DOCTOR_PORTAL, ADD_NEW_CARD, ADD_FACILITY_CARD } from '../../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import Doctor from '../../../constants/grx-api';
import { NavigateFunction } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';

export const addFacilityNewCardForm = FormBuilder.group({
  facilityId: ['', [Validators.required]],
  cc_number: ['', [Validators.required]],
  exp_date: ['', [Validators.required]],
  cvc: ['', [Validators.required]],
  cardholdername: ['', [Validators.required]],
  billingZc: ['', [Validators.required]],
  street: ['', Validators.required],
  city: ['', Validators.required],
  state: ['', Validators.required]
});

export const AddFacilityNewCardFormHandler = async (router: NavigateFunction) => {
  try {
    // event.preventDefault();
    addFacilityNewCardForm.controls.facilityId.markAsTouched({ emitEvent: true, onlySelf: true });
    addFacilityNewCardForm.controls.cc_number.markAsTouched({ emitEvent: true, onlySelf: true });
    addFacilityNewCardForm.controls.exp_date.markAsTouched({ emitEvent: true, onlySelf: true });
    addFacilityNewCardForm.controls.cvc.markAsTouched({ emitEvent: true, onlySelf: true });
    addFacilityNewCardForm.controls.cardholdername.markAsTouched({ emitEvent: true, onlySelf: true });
    addFacilityNewCardForm.controls.billingZc.markAsTouched({ emitEvent: true, onlySelf: true });

    if (addFacilityNewCardForm.invalid) {
      return;
    }

    let cardData: any = {
      facilityId: addFacilityNewCardForm?.value?.facilityId,
      default: true,
      number: addFacilityNewCardForm?.value?.cc_number?.replace(/\s/g, ''),
      cvc: addFacilityNewCardForm?.value?.cvc,
      expirationMonth: addFacilityNewCardForm?.value?.exp_date.split('/')[0],
      expirationYear: `20${addFacilityNewCardForm?.value?.exp_date.split('/')[1]}`,
      billingAddress: {
        address1: addFacilityNewCardForm?.value?.street,
        state: addFacilityNewCardForm?.value?.state,
        city: addFacilityNewCardForm?.value?.city,
        zipCode: addFacilityNewCardForm?.value?.billingZc
      }
    };

    const addCardRes: AxiosResponse = await Doctor.post(ADD_FACILITY_CARD, cardData);
    if (addCardRes.status === 201) {
      toast('Card added successfully');
      addFacilityNewCardForm.reset();
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
