import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosResponse } from 'axios';
import { FACILITY_PROFILE_UPDATE } from '../../../constants/Endpoints';
import { User } from '../../../models/User';
import { toast } from 'react-toastify';
import Doctor from '../../../constants/grx-api';

export const FacilityForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  fax: ['', [Validators.required]]
});

export const SettingFacilityHandler = async (facilityId: number) => {
  try {
    FacilityForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.fax.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    FacilityForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });

    if (FacilityForm.invalid) {
      return;
    }

    let data = {
      id: facilityId,
      name: FacilityForm.value.firstName,
      addr1: FacilityForm.value.street,
      addr2: FacilityForm.value.apt_suite,
      city: FacilityForm.value.city,
      state: FacilityForm.value.state,
      zip: FacilityForm.value.code,
      phone: FacilityForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      fax: FacilityForm.value.fax.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '')
      // old_id: '0',
      // store_id: 1,
    };

    const res: AxiosResponse = await Doctor.post(FACILITY_PROFILE_UPDATE, data);

    if (res.status === 201 || res.status === 200) {
      return true;
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
