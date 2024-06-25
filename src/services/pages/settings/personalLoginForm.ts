import { FormBuilder, Validators } from 'react-reactive-form';
import { UPDATE_PRESCRIBER_PASSWORD, UPDATE_PRESCRIBER_PROFILE } from '../../../constants/Endpoints';

import { AxiosResponse } from 'axios';
import Doctor from '../../../constants/grx-api';
import { User } from '../../../models/User';
import { toast } from 'react-toastify';

export const personalLoginForm = FormBuilder.group({
  username: ['', [Validators.required]],
  password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]]
});

export const settingUpdateLoginPasswordHandler = async (event: React.SyntheticEvent, user: User) => {
  try {
    event.preventDefault();
    personalLoginForm.controls.username.markAsTouched({ emitEvent: true, onlySelf: true });
    personalLoginForm.controls.password.markAsTouched({ emitEvent: true, onlySelf: true });

    if (personalLoginForm.invalid) {
      return;
    }

    const password = personalLoginForm.value.password;

    const res: AxiosResponse = await Doctor.post(`${UPDATE_PRESCRIBER_PASSWORD}/${password}`);
    if (res.data.status === 'Error') {
      return toast(res.data.message);
    }
    if (res.data.success === true) {
      toast('Password Updated Successfully');
      personalLoginForm.reset();
      personalLoginForm.patchValue({
        username: user.email
      });
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};

export const personalUserForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  phone: ['', [Validators.required]],
  email: ['', [Validators.required]],
  doctor_id: ['', []]
});

export const settingUpdateUserProfileHandler = async (event: React.SyntheticEvent, user: User) => {
  try {
    event.preventDefault();
    personalUserForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    personalUserForm.controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    personalUserForm.controls.phone.markAsTouched({ emitEvent: true, onlySelf: true });
    personalUserForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });

    if (personalUserForm.invalid) {
      return;
    }

    let data = {
      firstName: personalUserForm.value.firstName,
      lastName: personalUserForm.value.lastName,
      email: personalUserForm.value.email,
      // stateLicenceNumber: user.stateLicenseNumber,
      // npi: user.npi,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      password: user.password,
      specialty: user.specialty,
      notificationPreference: user.notificationPreference,
      doctor_id: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId,
      phoneNumber: {
        areaCode: personalUserForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').slice(0, 3),
        number: personalUserForm.value.phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').slice(3)
      },
      address: {
        address1: user.address.address1,
        state: user.address.state,
        city: user.address.city,
        zipCode: user.address.zipCode,
        country: user.address.country
      }
    };
    const res: AxiosResponse = await Doctor.put(UPDATE_PRESCRIBER_PROFILE, data);
    if (res.status === 200) {
      toast('Profile Update Successfully');
      return true;
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
