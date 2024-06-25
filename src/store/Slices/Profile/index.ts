import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { User } from "../../../models/User";

// import ProfileModel from "../../../models/ProfileModel";
// import { MyProfile, Gender } from "../../../models/ProfileModel";

const initialState = {
  user: new User() ,
  isLogin: false,
  isDoctor: false,
  token: null as String | null
};

const Profile = createSlice({
  name: "ProfileSlice",
  initialState,
  reducers: {
    setUserData(state: typeof initialState, action: PayloadAction<{user: User}>) {
      state.user = action.payload.user;
    },
    setToken(state: typeof initialState, action: PayloadAction<{token: string}>) {
      state.token = action.payload.token;
    },
    removeToken(state: typeof initialState) {
      state.token = null;
    },
    setLogin(state: typeof initialState, action: PayloadAction<boolean>) {
      state.isLogin = action.payload
    }
  },
});

export default Profile;
