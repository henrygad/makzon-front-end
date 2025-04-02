import { createSlice } from "@reduxjs/toolkit";
import notificationProps from "../../types/notification.type";


type Initialstate = {
    data: notificationProps[]
    loading: boolean,
    error: string
    popUpNotificationId?: string

};

const initialState: Initialstate = {
    data: [],
    loading: true,
    error: "",
    popUpNotificationId: undefined
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
            state.popUpNotificationId = action.payload._id;           
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
        removepopUpNotification: (state) => {
            state.popUpNotificationId = undefined;     
        }
    }
});

export const { fetchNotifications, addNotifications, viewedNotifications, deleteNotifications, removepopUpNotification } = userNotification.actions;
export default userNotification.reducer;

