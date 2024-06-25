import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosResponse } from 'axios';
import { EMAIL_LOGIN } from '../../constants/Endpoints';
import Doctor from '../../constants/grx-api';
import { User } from '../../models/User';
import { toast } from 'react-toastify';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';

export default class AuthService {
  loginForm = FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  constructor() {
    if (localStorage.getItem('login_username')) {
      this.loginForm = FormBuilder.group({
        email: [localStorage.getItem('login_username'), [Validators.required, Validators.email]],
        password: ['', Validators.required],
        rememberMe: [true]
      });
    }
  }

  loginHandler = async () => {
    try {
      this.loginForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
      this.loginForm.controls.password.markAsTouched({ emitEvent: true, onlySelf: true });

      const data = this.loginForm.value;
      if (this.loginForm.invalid) {
        return false;
      }

      const res: AxiosResponse = await DoctorWithoutToken.post(EMAIL_LOGIN, {
        email: data.email,
        password: data.password
      });

      if (res?.status === 201) {
        return { res, data };
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      } else {
        toast('You are not authorized to login, please contact Customer Service');
      }
    }
  };
}
