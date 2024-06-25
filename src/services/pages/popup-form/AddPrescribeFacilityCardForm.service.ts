import { FormBuilder, Validators } from 'react-reactive-form';

import { ADD_FACILITY_CARD } from '../../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import Doctor from '../../../constants/grx-api';
import { NavigateFunction } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';

export const addPrescribeFacilityCardForm = FormBuilder.group({
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

export const AddPrescribeFacilityCardFormHandler = async () => {
  try {
    addPrescribeFacilityCardForm.controls.facilityId.markAsTouched({ emitEvent: true, onlySelf: true });
    addPrescribeFacilityCardForm.controls.cc_number.markAsTouched({ emitEvent: true, onlySelf: true });
    addPrescribeFacilityCardForm.controls.exp_date.markAsTouched({ emitEvent: true, onlySelf: true });
    addPrescribeFacilityCardForm.controls.cvc.markAsTouched({ emitEvent: true, onlySelf: true });
    addPrescribeFacilityCardForm.controls.cardholdername.markAsTouched({ emitEvent: true, onlySelf: true });
    addPrescribeFacilityCardForm.controls.billingZc.markAsTouched({ emitEvent: true, onlySelf: true });

    if (addPrescribeFacilityCardForm.invalid) {
      return;
    }

    let cardData: any = {
      facilityId: addPrescribeFacilityCardForm?.value?.facilityId,
      default: true,
      number: addPrescribeFacilityCardForm?.value?.cc_number?.replace(/\s/g, ''),
      cvc: addPrescribeFacilityCardForm?.value?.cvc?.replaceAll('_', ''),
      expirationMonth: addPrescribeFacilityCardForm?.value?.exp_date.split('/')[0],
      expirationYear: `20${addPrescribeFacilityCardForm?.value?.exp_date.split('/')[1]}`,
      billingAddress: {
        address1: addPrescribeFacilityCardForm?.value?.street,
        state: addPrescribeFacilityCardForm?.value?.state,
        city: addPrescribeFacilityCardForm?.value?.city,
        zipCode: addPrescribeFacilityCardForm?.value?.billingZc
      }
    };

    const res: AxiosResponse = await Doctor.post(ADD_FACILITY_CARD, cardData);
    if (res.status === 201) {
      toast('Card added successfully');
      addPrescribeFacilityCardForm.reset();
      return 'OK';
    }
    toast(res?.data?.message);
    return false;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
