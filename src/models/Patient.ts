import { ASSET_BASE_URL, LOCAL_PROFILE_ENV } from "../constants/Endpoints";

import { Model } from "./Model";

export class Patient extends Model {

  className = "Patient";
  firstName= '';
  lastName= '';
  dateOfBirth= '';
  phoneNumber= '';
  patId= '';
  pat_id= '';
  fname= '';
  lname= '';
  area_code= '';
  phone_no= '';
  email= '';
  birth_date= '';
  addr1= '';
  addr2= '';
  city= '';
  state_cd= '';
  zip= '';
  gender_cd= '';
  country= '';
  phone_nbr= '';
  pt_name= '';
  prescriber= '';
  profile_image_path: string | null = null;
  

  get getImage() {
    if (!this.profile_image_path) {
      return LOCAL_PROFILE_ENV + "assets/icons/dummy_user.png";
    } else {
      return ASSET_BASE_URL + this.profile_image_path;
    }
  }

 
}
