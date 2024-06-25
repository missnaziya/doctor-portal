import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  prescription: [],
  prescribeOrder: {
    billTo: {
      type: '',
      value: ''
    },
    shipTo: {
      type: '',
      value: ''
    },
    comment: '',
    credit_card: '',
    needByDate: '',
    selectPrescriber: '',
    selectedPrescriberName: '',
    npi: '',
    blocks: [
      {
        patients: [],
        prescriptions: []
      }
    ]
  },
  prescribers: [],
  reviewOrder: {
    billTo: {
      type: '',
      value: ''
    },
    shipTo: {
      type: '',
      value: ''
    },
    comment: '',
    credit_card: '',
    needByDate: '',
    selectPrescriber: '',
    selectedPrescriberName: '',
    npi: '',
    blocks: [
      {
        patients: [],
        prescriptions: []
      }
    ]
  },
  shipping: {},
  billing: {}
};

const Prescription = createSlice({
  name: 'PrescriptionSlice',
  initialState,
  reducers: {
    setPrescriptionHistory(state: typeof initialState, action: PayloadAction<any>) {
      state.prescription = action.payload;
    },
    setPrescribeOrder(state: typeof initialState, action: PayloadAction<any>) {
      state.prescribeOrder = action.payload;
    },
    setReviewOrder(state: typeof initialState, action: PayloadAction<any>) {
      state.reviewOrder = action.payload;
    },
    setPrescriberData(state: typeof initialState, action: PayloadAction<any>) {
      state.prescribers = action.payload.data;
    },
    setShippingInfo(state: typeof initialState, action: PayloadAction<any>) {
      state.shipping = action.payload.data;
    },
    setBillingInfo(state: typeof initialState, action: PayloadAction<any>) {
      state.billing = action.payload.data;
    }
  }
});

export default Prescription;
