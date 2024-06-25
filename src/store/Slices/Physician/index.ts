import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  dropdownData: [],
};

const Physician = createSlice({
  name: "PhysicianSlice",
  initialState,
  reducers: {
    setUserData(state: typeof initialState, action: PayloadAction<any>) {
      state.dropdownData = action.payload.dropdownData;
    },
  },
});

export default Physician;
