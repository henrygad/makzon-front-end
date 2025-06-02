import { createSlice } from "@reduxjs/toolkit";
import mediaProps from "../../types/media.type";
//import image from "../../assert/profilepic.png";

type Initialstate = {
    media: {              
        data: mediaProps[]
        loading: boolean
        error: string
    }
};

const initialState: Initialstate = {
    media: {               
        data: [],
        loading: true,
        error: "",
    }
};


const usermedia = createSlice({
    name: "userMedia",
    initialState,
    reducers: {
        fetchMedia: (state, action: { payload: Initialstate["media"] }) => {
            state.media = action.payload;
        },
        addMedia: (state, action: { payload: mediaProps }) => {
            state.media.data.push(action.payload);
        },
        deleteMdia: (state, action: { payload: { _id: string } }) => {
            state.media.data = state.media.data.filter(
                (md) => md._id !== action.payload._id
            );
        },        
    }
});

export const {
    fetchMedia, addMedia, deleteMdia,     
} = usermedia.actions;
export default usermedia.reducer;
