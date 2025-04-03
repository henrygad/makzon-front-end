import { createSlice } from "@reduxjs/toolkit";
import userprops from "../../types/user.type";
import Cookies from "js-cookie";

type InitialState = {
  userProfile: {
    data: userprops;
    loading: boolean;
    error: string;
  };
};

const initialState: InitialState = {
  userProfile: {
    data: (() => {
      const loginUserData: userprops = JSON.parse(Cookies.get("makzonFrtendSession") || JSON.stringify({ userName: "", email: "", login: false, sessionId: "" }));
      if (loginUserData) {
        return loginUserData;
      }
      return loginUserData;
    })(),
    loading: true,
    error: "",
  },
};

const userProfile = createSlice({
  name: " userProfile",
  initialState,
  reducers: {
    fetchProfile: (state, action: { payload: InitialState["userProfile"] }) => {
      state.userProfile = action.payload;
    },
    editProfile: (state, action: { payload: userprops }) => {
      const { data } = state.userProfile;
      state.userProfile.data = { ...data, ...action.payload };
    },
    clearProfile: (state, action: { payload: InitialState["userProfile"] }) => {
      state.userProfile = action.payload;
    },
    follow: (state, action: { payload: { userName: string } }) => {
      const { data } = state.userProfile;
      if (!data) return;
      state.userProfile.data = {
        ...data,
        followings: [...data.followings, action.payload.userName],
      };
      state.userProfile.data = {
        ...data,
        timeline: [...data.timeline, action.payload.userName],
      };
    },
    unFollow: (state, action: { payload: { userName: string } }) => {
      const { data } = state.userProfile;
      if (!data) return;
      state.userProfile.data = {
        ...data,
        followings: data.followings.filter(
          (item) => item !== action.payload.userName
        ),
      };
      state.userProfile.data = {
        ...data,
        timeline: data.timeline.filter(
          (item) => item !== action.payload.userName
        ),
      };
    },
  },
});

export const { fetchProfile, editProfile, clearProfile, unFollow, follow } =
  userProfile.actions;

export default userProfile.reducer;
