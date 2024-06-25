import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosResponse } from 'axios';
import { FORGOT_PASSWORD } from '../../constants/Endpoints';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import Doctor from '../../constants/grx-api';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';

export const forgotPswForm = FormBuilder.group({
  email: ['', [Validators.required, Validators.email]]
});

export const forgotPasswordHandler = async (router: NavigateFunction) => {
  try {
    forgotPswForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    if (forgotPswForm.invalid) {
      return;
    }
    const data = forgotPswForm.value;
    const res: AxiosResponse = await DoctorWithoutToken.post(`${FORGOT_PASSWORD}/${data.email}`);
    if (res.status === 201) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('forget-email', data.email);
      }
      toast('Kindly check your email to reset your password.');
      router('/forgot-password/done');
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
