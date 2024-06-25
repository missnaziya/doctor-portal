import { FormBuilder, Validators } from 'react-reactive-form';

import { AxiosResponse } from 'axios';
import { RESET_PASSWORD } from '../../constants/Endpoints';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DoctorWithoutToken from '../../constants/grx-api-tokenless';

export default class RestPassword {
  changePasswordForm = FormBuilder.group({
    token: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirm_password: ['', [Validators.required]]
  });

  resetPasswordHandler = async () => {
    const router = useNavigate();
    try {
      this.changePasswordForm.controls.password.markAsTouched({ emitEvent: true, onlySelf: true });
      this.changePasswordForm.controls.confirm_password.markAsTouched({ emitEvent: true, onlySelf: true });

      if (this.changePasswordForm.invalid) {
        return;
      }
      const data = this.changePasswordForm.value;

      const res: AxiosResponse = await DoctorWithoutToken.post(RESET_PASSWORD, data);
      if (res.data.status === 'Error') {
        return toast(res.data.message);
      }

      if (res.data.status === 'OK') {
        toast('Reset Password Successfully.');
        router('/');
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };
}
