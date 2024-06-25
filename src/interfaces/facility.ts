export interface FacilityInterface {
  id: string;
  name: string;
  addr1: string;
  addr2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  old_id: string;
  store_id: string;
  fax: string;
}
export interface FacilityCardInterface {
  billingAddress: {
    address1: '';
    address2: '';
    city: '';
    state: '';
    zipCode: '';
    cardId: '';
    default: boolean;
    expiration: '';
    lastFourDigits: '';
    type: '';
  };
}
