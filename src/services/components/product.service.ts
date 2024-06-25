import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosResponse } from 'axios';
import { FORGOT_PASSWORD } from '../../constants/Endpoints';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import Doctor from '../../constants/grx-api';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';

export const productForm = FormBuilder.group({
  surgical: [true, []],
  ocular: [false, []],
  preop: [false, []],
  postop: [false, []],
  chronic: [false, []],
  sedation: [false, []],
  surgical1: [false, []],
  ocular1: [false, []],
  preop1: [false, []],
  postop1: [false, []],
  chronic1: [false, []],
  sedation1: [false, []],
  surgical2: [false, []],
  ocular2: [false, []],
  preop2: [false, []],
  postop2: [false, []],
  chronic2: [false, []],
  sedation2: [false, []]
});

export const ProductFormHandler = async (event: React.SyntheticEvent, router: NavigateFunction) => {
  try {
    event.preventDefault();
    productForm.controls.rememberMe.markAsTouched({ emitEvent: true, onlySelf: true });
    if (productForm.invalid) {
      return;
    }
    const data = productForm.value;
    // const res: AxiosResponse = await Doctor.post(FORGOT_PASSWORD, {
    //   rememberMe: data.email
    // });
    const res: AxiosResponse = await DoctorWithoutToken.post(`${FORGOT_PASSWORD}/${data.email}`);
    // if (res.data.status === 'Error') {
    //   return toast(res.data.message);
    // }

    if (res.status === 201) {
      toast('Kindly check your email to reset your password.');
      router('/');
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
    }
  }
};
