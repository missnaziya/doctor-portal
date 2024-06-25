import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { PatientInterface } from "../../../interfaces/patient";

const initialState: {
  patients: PatientInterface[]
  searchPatient: PatientInterface[]
  patientCards: []
  redirectToPatientPreHistory:boolean
} = {
  patients: [],
  searchPatient:[],
  patientCards: [],
  redirectToPatientPreHistory:false
};

const Patient = createSlice({
  name: "PatientSlice",
  initialState,
  reducers: {
    setCurrentPatient(state: typeof initialState, action: PayloadAction<any>) {
      state.patients = action.payload;
    },
    setCurrentPatientCards(state: typeof initialState, action: PayloadAction<any>){
      state.patientCards = action.payload
    },
    setSearchPatient(state: typeof initialState, action: PayloadAction<any>) {
      state.searchPatient = action.payload;
    },
    setRedirectToPatientPreHistory(state: typeof initialState, action: PayloadAction<any>){
      state.redirectToPatientPreHistory = action.payload;
    }
  },
});
export default Patient;
