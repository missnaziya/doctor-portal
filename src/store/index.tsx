import CreatePatient from "./Slices/Popup/CreatePatient";
import Dashboard from "./Slices/Dashboard";
import Patient from "./Slices/Patient";
import Physician from "./Slices/Physician";
import Prescription from "./Slices/Prescription";
import Product from "./Slices/Product";
import Profile from "./Slices/Profile";
import Settings from "./Slices/Settings";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
	reducer: {
		profileReducer: Profile.reducer,
		physicanReducer: Physician.reducer,
		dashboardReducer:Dashboard.reducer,
		prescriptionReducer:Prescription.reducer,
		patientReducer: Patient.reducer,
		productReducer: Product.reducer,
		createPatientReducer: CreatePatient.reducer,
		settingReducer: Settings.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false
	})
	//.concat(logger),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
