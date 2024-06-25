import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  statistics: {
    patients: 0,
    prescriptions: 0,
  },
  orders: [],
  sliderOrders: [],
  mediaction:[],
  prescriptionMediaction:[],
};

const Dashboard = createSlice({
  name: "DashboardSlice",
  initialState,
  reducers: {
    setProductData(state: typeof initialState, action: PayloadAction<any>) {
      state.data = action.payload.data;
    },
    setStatisticsData(state: typeof initialState, action: PayloadAction<any>) {
      state.statistics.patients = action.payload.patients;
      state.statistics.prescriptions = action.payload.prescriptions;
    },
    setRecentOrders(state: typeof initialState, action: PayloadAction<any>) {
      state.orders = action.payload;
    },
    setSliderOrders(state: typeof initialState, action: PayloadAction<any>) {
      state.sliderOrders = action.payload;
    },
    setMedicationData(state: typeof initialState, action: PayloadAction<any>) {
      state.mediaction = action.payload.data;
    },
    setPrescriptionMedicationData(state: typeof initialState, action: PayloadAction<any>) {
      state.prescriptionMediaction = action.payload;
    },
  },
});
export default Dashboard;
