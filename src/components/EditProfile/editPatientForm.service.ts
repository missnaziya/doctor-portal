import { FormBuilder, Validators } from 'react-reactive-form';
import { UPDATE_PATIENT } from '../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import Doctor from '../../constants/grx-api';
import { User } from '../../models/User';
import { toast } from 'react-toastify';

export const patientForm = FormBuilder.group({
  firstName: ['', [Validators.required]],
  lastName: ['', [Validators.required]],
  gender: ['', [Validators.required]],
  dob: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
  email: ['', []],
  phone_id: [''],
  phone_no: ['', [Validators.required]],
  mobile: [''],
  addr_id: [''],
  street: ['', [Validators.required]],
  apt_suite: ['', []],
  city: ['', [Validators.required]],
  state: ['', [Validators.required]],
  code: ['', [Validators.required]],
  country: ['US'],
  pat_id: ['', [Validators.required]],
  blueViewNetwork: [''],
  allergies: ['']
});

export const patientFormHandler = async (props: { user: User; handleProfile: (check: boolean) => void }) => {
  try {
    patientForm.controls.firstName.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.lastName.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.gender.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.dob.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.email.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.phone_no.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.street.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.apt_suite.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.city.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.state.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.code.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.country.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.blueViewNetwork.markAsTouched({ emitEvent: true, onlySelf: true });
    patientForm.controls.allergies.markAsTouched({ emitEvent: true, onlySelf: true });

    if (
      patientForm.controls.firstName.invalid ||
      patientForm.controls.lastName.invalid ||
      patientForm.controls.gender.invalid ||
      patientForm.controls.dob.invalid ||
      patientForm.controls.email.invalid ||
      patientForm.controls.phone_no.invalid ||
      patientForm.controls.street.invalid ||
      patientForm.controls.apt_suite.invalid ||
      patientForm.controls.city.invalid ||
      patientForm.controls.state.invalid ||
      patientForm.controls.code.invalid ||
      patientForm.controls.country.invalid ||
      patientForm.controls.blueViewNetwork.invalid ||
      patientForm.controls.allergies.invalid
    ) {
      return;
    }

    const mdId = props?.user?.type === 'Staff' ? props?.user?.activePrescriber?.mdId : props?.user?.mdId;

    let data = {
      md_id: mdId,
      first_name: patientForm.value.firstName !== 'null' ? patientForm.value.firstName : '',
      last_name: patientForm.value.lastName !== 'null' ? patientForm.value.lastName : '',
      gender: patientForm.value.gender !== 'null' ? patientForm.value.gender : '',
      dob: patientForm.value.dob !== 'null' ? patientForm.value.dob : '',
      email: patientForm.value.email !== 'null' ? String(patientForm.value.email) : '',
      phone_no: patientForm.value.phone_no !== 'null' ? String(patientForm.value.phone_no).replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '') : '',
      mobile: patientForm.value.phone_no !== 'null' ? String(patientForm.value.phone_no).replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '') : '',
      phone_id: patientForm.value.phone_id !== 'null' ? patientForm.value.phone_id : patientForm.value.phone_id,
      street: patientForm.value.street !== 'null' ? patientForm.value.street : '',
      // apt_suite: patientForm.value.apt_suite !== 'null' ? patientForm.value.apt_suite : '',
      AddrId: patientForm.value.addr_id !== 'null' ? patientForm.value.addr_id : '',
      city: patientForm.value.city !== 'null' ? patientForm.value.city : '',
      state: patientForm.value.state != 'null' ? patientForm.value.state : '',
      country: 'US',
      zip_code: patientForm.value.code !== 'null' ? patientForm.value.code : '',
      code: patientForm.value.code ? patientForm.value.code : '',
      apt_suite: patientForm.value.apt_suite ? patientForm.value.apt_suite : '',
      // user: user.doctor_id !== 'null' ? user.doctor_id : '',
      pat_id: patientForm.value.pat_id !== 'null' ? patientForm.value.pat_id : '',
      PatID: patientForm.value.pat_id !== 'null' ? patientForm.value.pat_id : '',
      blueViewNetwork: patientForm?.value?.blueViewNetwork !== '' ? patientForm?.value?.blueViewNetwork : false,
      allergies: patientForm?.value?.allergies ? patientForm?.value?.allergies.split(',') : ['No Known Allergies']
    };

    const res: AxiosResponse = await Doctor.post(UPDATE_PATIENT, data);
    if (res.data.statusCode === 420) {
      return toast(res.data.message);
    }
    if (res.status === 201) {
      toast('Patient updated successfully.');
      patientForm.reset();
      props.handleProfile(false);
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      toast(error?.response?.data?.message);
      props.handleProfile(true);
    }
  }
};
