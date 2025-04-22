import { createSlice } from "@reduxjs/toolkit";
import notificationProps from "../../types/notification.type";


type Initialstate = {
    data: notificationProps[]
    loading: boolean,
    error: string
};

const initialState: Initialstate = {
    data: [],
    loading: true,
    error: "",   
};

const userNotification = createSlice({
    name: "userNotification",
    initialState,
    reducers: {
        fetchNotifications: (state, action: { payload: Initialstate }) => {
            return state = action.payload;
        },
        addNotifications: (state, action: { payload: notificationProps }) => {
            state.data.push(action.payload);                   
        },
        viewedNotifications: (state, action: { payload: { _id: string } }) => {
            state.data = state.data.map((notis =>
                notis._id === action.payload._id ?
                    { ...notis, checked: true } :
                    notis
            ));
        },
        deleteNotifications: (state, action: { payload: { _id: string } }) => {
            state.data = state.data.filter(
                (notis) => notis._id !== action.payload._id
            );
        },       
    }
});

export const { fetchNotifications, addNotifications, viewedNotifications, deleteNotifications } = userNotification.actions;
export default userNotification.reducer;

