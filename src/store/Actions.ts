import CreatePatient from "./Slices/Popup/CreatePatient";
import Dashboard from "./Slices/Dashboard";
import Patient from "./Slices/Patient";
import Physician from "./Slices/Physician";
import Prescription from "./Slices/Prescription";
import Product from "./Slices/Product";
import Profile from "./Slices/Profile";
import Settings from "./Slices/Settings";

export const profileActions = Profile.actions;
export const physicianActions = Physician.actions;
export const dashboardActions = Dashboard.actions;
export const patientActions = Patient.actions;
export const prescriptionActions = Prescription.actions;
export const productActions = Product.actions;
export const createPatientActions = CreatePatient.actions;
export const settingsActions = Settings.actions;