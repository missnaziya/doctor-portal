import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {products: [], patientBlueViewProducts: [], prescriberBlueViewProducts: []} = {
  products: [],
  patientBlueViewProducts: [],
  prescriberBlueViewProducts: []
};

const Product = createSlice({
  name: "ProductSlice",
  initialState,
  reducers: {
    setProductCatalogData(state: typeof initialState, action: PayloadAction<any>) {
      state.products = action.payload.data;
    },
    setPatientBlueViewProductCatalogData(state: typeof initialState, action: PayloadAction<any>) {
      state.patientBlueViewProducts = action.payload.data;
    },
    setPrescriberBlueViewProductCatalogData(state: typeof initialState, action: PayloadAction<any>) {
      state.prescriberBlueViewProducts = action.payload.data;
    }
  },
});
export default Product;
