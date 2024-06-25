import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  isPatientAllergies: {
    yes: boolean,
    no: boolean
  }
} = {
  isPatientAllergies: {
    yes: true,
    no: false,
  },
};

const CreatePatient = createSlice({
  name: "CreatePatientSlice",
  initialState,
  reducers: {
    changeHandler(state: typeof initialState, action: PayloadAction<any>) {
      if (action.payload.name === "yes") {
        state.isPatientAllergies = {
          yes: true,
          no: false,
        };
      } else if (action.payload.name === "no") {
        state.isPatientAllergies = {
          yes: false,
          no: true,
        };
      } else {
        state.isPatientAllergies = {
          yes: false,
          no: false,
        };
      }
    },
  },
});
export default CreatePatient;
