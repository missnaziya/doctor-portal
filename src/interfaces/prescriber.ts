export interface PrescriberInterface {
  accountId?: string;
  doctorAccountId?: string;
  firstName?: string,
  lastName?: string,
  email?: string,
  mdId?: string,
  npi?: string,
  specialty?: string,
  type?: string,
  phoneNumber?: {
    areaCode?: string,
    countryCode?: string,
    number?: string
  },
  address?: {
    address1?: string,
    address2?: string,
    city?: string,
    country?: string,
    state?: string,
    zipCode?: string
  },
  stateLicenseNumber?: string,
}
