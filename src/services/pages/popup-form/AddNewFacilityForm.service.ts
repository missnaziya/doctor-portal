import { FormBuilder, Validators } from 'react-reactive-form';

import { ADD_FACILITY, ADD_FACILITY_CARD } from '../../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import Doctor from '../../../constants/grx-api';
import { User } from '../../../models/User';
import { toast } from 'react-toastify';

export let AddNewFacilityForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  fax: ['', [Validators.required]],
  cardholderName: ['', [Validators.required]],
  cardNumber: ['', [Validators.required]],
  expiry: ['', [Validators.required]],
  cvv: ['', [Validators.required]],
  zip_code: ['', [Validators.required]],
  country: ['US', [Validators.required]]
});

export const AddNewFacilityFormHandler = async (router: NavigateFunction, props: { handleClose: (res: number) => void }, userData: User) => {
  try {
    AddNewFacilityForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.fax.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });

    AddNewFacilityForm.controls.cardholderName.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.cardNumber.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.expiry.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.cvv.markAsTouched({ emitEvent: true, onlySelf: true });
    AddNewFacilityForm.controls.zip_code.markAsTouched({ emitEvent: true, onlySelf: true });

    if (
      AddNewFacilityForm.controls.firstName.invalid ||
      AddNewFacilityForm.controls.fax.invalid ||
      AddNewFacilityForm.controls.phone.invalid ||
      AddNewFacilityForm.controls.street.invalid ||
      AddNewFacilityForm.controls.city.invalid ||
      AddNewFacilityForm.controls.state.invalid ||
      AddNewFacilityForm.controls.code.invalid
    ) {
      return;
    }

    // eslint-disable-next-line eqeqeq
    if (AddNewFacilityForm.controls.cardholderName.invalid || AddNewFacilityForm.controls.cardNumber.invalid || AddNewFacilityForm.controls.expiry.invalid || AddNewFacilityForm.controls.cvv.invalid || AddNewFacilityForm.controls.zip_code.invalid) {
      return;
    }

    const mdId = userData?.type === 'Staff' ? userData?.activePrescriber?.mdId : userData?.mdId;

    let data = {
      name: AddNewFacilityForm.value.firstName,
      phone: AddNewFacilityForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      fax: AddNewFacilityForm.value.fax.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      addr2: AddNewFacilityForm.value.apt_suite === null ? undefined : AddNewFacilityForm.value.apt_suite,
      addr1: AddNewFacilityForm.value.street,
      city: AddNewFacilityForm.value.city,
      state: AddNewFacilityForm.value.state,
      zip: AddNewFacilityForm.value.code,
      old_id: '0',
      store_id: 1,
      md_id: parseInt(mdId)
    };

    const cardData = {
      facilityId: '',
      default: true,
      number: AddNewFacilityForm?.value?.cardNumber?.replace(/\s/g, ''),
      cvc: AddNewFacilityForm?.value?.cvv?.replaceAll('_', ''),
      expirationMonth: AddNewFacilityForm?.value?.expiry.split('/')[0],
      expirationYear: `20${AddNewFacilityForm?.value?.expiry.split('/')[1]}`,
      billingAddress: {
        address1: AddNewFacilityForm?.value?.street,
        state: AddNewFacilityForm?.value?.state,
        city: AddNewFacilityForm?.value?.city,
        zipCode: AddNewFacilityForm?.value?.zip_code
      }
    };

    const res: AxiosResponse = await Doctor.post(ADD_FACILITY, data);
    if (res?.data?.status === 'Error') {
      return toast(res.data.message);
    }

    if (res?.status === 200 || res?.status === 201) {
      toast('Facility Registered Successfully');
      if (res?.data) {
        cardData.facilityId = res?.data;
        const addCardRes: AxiosResponse = await Doctor.post(ADD_FACILITY_CARD, cardData);
        if (addCardRes.status === 201) {
          toast('Card added successfully');
          AddNewFacilityForm.reset();
          return res?.data;
        } else {
          AddNewFacilityForm.reset();
          toast('Unable to add card');
          return 0;
        }
      }
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
