import { ASSET_BASE_URL, LOCAL_PROFILE_ENV } from '../constants/Endpoints';

import { Model } from './Model';

export class User extends Model {
  className = 'User';

  profile_image_path: string | null = null;
  profileImage = {
    Location: '',
    small: ''
  };
  active = 0;
  doctorAccountId = '';
  firstName = '';
  lastName = '';
  mobile = '';
  password = '';
  email = '';
  md_id = '';
  mdId = '';
  npi = '';
  notification = '';
  specialty = '';
  Speciality = '';
  type = 'Doctor';
  approvalStatus = '';
  activePrescriber = {
    accountId: '',
    firstName: '',
    lastName: '',
    email: '',
    mdId: '',
    npi: '',
    specialty: '',
    type:'Doctor',
    phoneNumber: {
      areaCode: '',
      countryCode: '',
      number: ''
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      country: '',
      state: '',
      zipCode: ''
    },
    stateLicenseNumber: '',
  };
  phoneNumber = {
    areaCode: '',
    countryCode: '',
    number: ''
  };
  address = {
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    zipCode: ''
  };
  notificationPreference = '';
  stateLicenseNumber = '';
  dateOfBirth = '';
  gender = '';

  get getImage() {
    if (!this.profile_image_path) {
      return LOCAL_PROFILE_ENV + 'assets/icons/dummy_user.png';
    } else {
      return ASSET_BASE_URL + this.profile_image_path;
    }
  }

  get isApproved() {
    // return Number(this.active) !== 0;
    // return this.status !== 'pending';
    return this.approvalStatus === 'Approved';
  }
}