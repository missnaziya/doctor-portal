//auth--->
export const REGISTER_STAFF = '/doctorapi/adddoctor?type=S';
export const REGISTER_DOCTOR = '/doctorapi/adddoctor?type=D';
export const REGISTER_DOCTOR_STEP_ONE = 'doctor-portal/auth/register-doctor-step-one';
export const REGISTER_DOCTOR_STEP_TWO = 'doctor-portal/auth/register-doctor-step-two';

export const REGISTER_STAFF_STEP_ONE = 'doctor-portal/auth/register-staff-step-one';
export const REGISTER_STAFF_STEP_TWO = 'doctor-portal/auth/register-staff-step-two';

// export const FORGOT_PASSWORD = '/doctorapi/forgotpasswordv1';
export const FORGOT_PASSWORD = '/doctor-portal/auth/initiate-reset-password';
export const RESET_PASSWORD = '/doctorapi/changepassword';
export const EMAIL_LOGIN = '/doctor-portal/auth/login';
export const MOBILE_LOGIN = '/doctorapi/mobilelogin';
export const AUTO_LOGIN = '/doctor-portal/auth/customer-support-login';
export const EMAIL_VERIFY = '/doctor-portal/auth/email-verification';

//dashboard-->
export const GET_STATISTICS = '/doctor-portal/dashboard/get-stats';
export const GET_RECENT_ORDERS = '/doctor-portal/order/rx-by-md-id-top-five';

export const GET_SLIDER_ORDERS = '/doctor-portal/doctor/advertisements';
export const PRODUCT_SPOTLIGHT = '/productapi/getproducts';
export const GET_ALLERGIES = '/doctor-portal/doctor/allergies';
// https://mobileauth.imprimisrx.com/development/webservices/1.0.7/index.php/constantapi/getconstantsv1?api_key=9e969f89f4e42d8eb3ef56582c7a69c6&constant_id=1

//used for all pages-->
export const GET_SPECIALTIES = '/doctor-portal/doctor/specialties';

//patient --->
export const GET_CURRENT_PATIENT = '/doctor-portal/patient/all';
export const GET_SINGLE_PATIENT = '/doctor-portal/patient/single';
export const GET_SINGLE_PATIENT_PRESCRIPTIONS = '/doctor-portal/patient/prescriptions';
export const NEW_PATIENT = '/doctor-portal/patient/add';
// export const NEW_PATIENT_LOCAL = 'https://mobileauth.imprimisrx.com/development/webservices/1.0.7/index.php/patientapi/addpatient'; not in use
export const UPDATE_PATIENT = '/doctor-portal/patient/update';
export const SEARCH_PATIENT = '/doctor-portal/patient/search';
export const GET_AR_GROUPS = '/doctor-portal/order/ar-group-by-md-id';

//prescription --->
export const GET_PRESCRIPTION_HISTORY = '/doctor-portal/order/rx-by-md-id';
// export const GET_ORDER_DETAIL = '/doctor-portal/order/rx-calc-order-price-for-invoice';
export const GET_ORDER_DETAIL = '/doctor-portal/order/imprimis-get-order-details';
export const CREATE_PRISCRIPTION_IMAGE = '/grx/prescription/create-image';
export const CREATE_ORDER = '/doctor-portal/order/create-order-prescriptions-and-line-items';

//setting -->
//user
export const UPDATE_PRESCRIBER_PASSWORD = '/doctor-portal/auth/update-password';
export const UPDATE_PRESCRIBER_PROFILE = '/doctor-portal/auth/update-profile';

//prescriber
export const PRESCRIBER_PROFILE_GET = '/doctor-portal/auth/attached-doctor';
// export const PRESCRIBER_PROFILE_UPDATE  = "/doctorstaffapi/updatestaffdoctor";
export const PRESCRIBER_PROFILE_UPDATE = '/doctorapi/updatedoctor'; // staff update

//setting prescriber popup
export const ADD_NEW_PRESCRIBER = '/doctor-portal/auth/attach-doctor';

export const REMOVE_NEW_PRESCRIBER = '/doctorstaffapi/removestaffdoctor';
export const ADD_NEW_SHIPPING_ADDRESS = 'https://mobileauth.imprimisrx.com/development/webservices/1.0.7/index.php/doctorapi/updatedoctor?type=D';
export const ADD_NEW_CARD = '/grx/card/create-card-for-grx-patient';
export const AUTH_DOCTOR_PORTAL = '/auth/doctor-portal';
export const GET_PATIENT_CARDS = '/grx/card/get-cards-for-grx-patient';
export const DELETE_PATIENT_CARD = '/grx/card/patient-card';

// Order tracking
export const GET_SHIPPING_CARRIER = '/doctor-portal/order/get-shipping-carrier';
export const FEDEX_TRACK_URL = 'https://www.fedex.com/fedextrack/?trknbr=';
export const STAMPS_COM_TRACK_URL = 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=';
export const UPS_TRACK_URL = 'https://www.ups.com/track?track=yes&trackNums=';

//product-->
// export const PRODUCT_CATALOG = 'https://mobileauth.imprimisrx.com/development/webservices/1.0.7/index.php/productapi/getproductsv1';
export const PRODUCT_CATALOG = '/doctor-portal/doctor/get-products';
export const PRODUCT_CATALOG_BLUE_VIEW = '/doctor-portal/doctor/blue-view-products';
export const PRODUCT_Preservative_FILTER = '/constantapi/getconstantsv1'; // not used anywhere
export const PRODUCT_DOSAGE_FILTER = '/doctor-portal/doctor/dosage-forms';
export const PRODUCT_CATALOG_CAT_FILTER = '/doctor-portal/doctor/product-categories';
export const ADD_DOSING_DIRECTIONS = '/doctor-portal/doctor/create-product-directions';
export const GET_DOSING_DIRECTIONS = '/doctor-portal/doctor/get-product-directions';
// export const ADD_FAV_PRODUCT = '/doctorfavouriteproductapi/addfavouriteproduct';
export const ADD_FAV_PRODUCT = '/doctor-portal/doctor/add-to-favorite';
export const REMOVE_FAV_PRODUCT = '/doctor-portal/doctor/remove-from-favorite';

//used for images -->
export const LOCAL_PROFILE_ENV = 'https://mobileauth.imprimisrx.com/development/webservices/1.0.7/index.php/doctorapi/updatedoctor?type=D';
export const ASSET_BASE_URL = 'https://mobileauth.imprimisrx.com/development/webservices/images/originals';
export const UPDATE_PROFILE_PIC = '/doctorapi/updateprofilepic';

// facility endpoints
export const GET_FACILITIES = '/doctor-portal/order/ar-group-by-md-id';
export const ADD_FACILITY = '/doctor-portal/facility/add-facility';
export const FACILITY_PROFILE_UPDATE = '/doctor-portal/facility/update-facility';
export const DELETE_FACILITY = ''; // TODO
export const ADD_FACILITY_CARD = '/grx/card/create-card-for-grx-facility';
export const GET_FACILITY_CARD = '/grx/card/get-cards-for-grx-facility';
export const DELETE_FACILITY_CARD = '/grx/card/facility-card';

export const PROFILE = 'user';
export const UPDATE = 'auth';
