import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosResponse } from 'axios';
import { PRESCRIBER_PROFILE_UPDATE } from '../../../constants/Endpoints';
import { User } from '../../../models/User';
import { toast } from 'react-toastify';

export const prescriberForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  notification_preference: ['', [Validators.required]],
  npi: [''],
  speciality: ['', [Validators.required]],
  doctor_id: ['', [Validators.required]],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]]
});

export const SettingPrescriberHandler = async (userData: User) => {
  try {
    prescriberForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    prescriberForm.controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    prescriberForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    prescriberForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    prescriberForm.controls.notification_preference.markAsTouched({ emitEvent: true, onlySelf: true });
    prescriberForm.controls.npi.markAsTouched({ emitEvent: true, onlySelf: true });
    prescriberForm.controls.speciality.markAsTouched({ emitEvent: true, onlySelf: true });

    if (prescriberForm.invalid) {
      return;
    }

    let data = {
      first_name: prescriberForm.value.firstName,
      last_name: prescriberForm.value.lastName,
      mobile: prescriberForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      email: prescriberForm.value.email,
      notification_preference: prescriberForm.value.notification_preference,
      npi: prescriberForm.value.npi,
      specialty: prescriberForm.value.speciality,
      doctor_id: prescriberForm.value?.doctor_id
    };

    // const res: AxiosResponse = await PhysicianDoctor.post(PRESCRIBER_PROFILE_UPDATE, data, { params: { api_key: localStorage.getItem('api_key') } });
    // if (res.data.status === 'Error') {
    //   return toast(res.data.message);
    // }

    // if (res.data.status === 'OK') {
    //   return toast('Prescriber Update Successfully');
    // }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
