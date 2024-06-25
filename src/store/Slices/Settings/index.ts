import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { User } from '../../../models/User';
import { FacilityInterface, FacilityCardInterface } from '../../../interfaces/facility';

type initialStateType = {
  prescribers: User[];
  facilities: FacilityInterface[];
  facilityCard: FacilityCardInterface[];
  currentFacility: number;
};

const initialState: initialStateType = {
  prescribers: [],
  facilities: [],
  facilityCard: [],
  currentFacility: 0
};

const Settings = createSlice({
  name: 'SettingsSlice',
  initialState,
  reducers: {
    setPrescriptionData(state: typeof initialState, action: PayloadAction<{ data: User[] }>) {
      state.prescribers = action.payload.data;
    },
    setFacilityData(state: typeof initialState, action: PayloadAction<{ data: FacilityInterface[] }>) {
      state.facilities = action.payload.data;
    },
    setFacilityCardData(state: typeof initialState, action: PayloadAction<{ data: FacilityCardInterface[] }>) {
      state.facilityCard = action.payload.data;
    },
    setCurrentFacility(state: typeof initialState, action: PayloadAction<{ data: number }>) {
      state.currentFacility = action.payload.data;
    }
  }
});

export default Settings;
