import { createSlice } from "@reduxjs/toolkit";
import mediaProps from "../../types/media.type";
//import image from "../../assert/profilepic.png";

type Initialstate = {
    media: {      
        selectedMedia?: mediaProps[]
        data: mediaProps[]
        loading: boolean
        error: string
    }
};

const initialState: Initialstate = {
    media: {
        selectedMedia: [],        
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
        addSelectedMedia: (state, action: { payload: mediaProps }) => {
            const getPreValue = state.media.selectedMedia || [];
            state.media.selectedMedia = [...getPreValue, action.payload];
        },       
        removeSelectedMedia: (state, action: { payload: {_id: string } }) => {
            const getPreValue = state.media.selectedMedia || [];
            state.media.selectedMedia = getPreValue.filter((md) => md._id !== action.payload._id);
        },
        clearSelectedMedia: (state, action: { payload: [] }) => {
            state.media.selectedMedia = action.payload || [];
        },
    }
});

export const {
    fetchMedia, addMedia, deleteMdia,
    addSelectedMedia,
   removeSelectedMedia, clearSelectedMedia
} = usermedia.actions;
export default usermedia.reducer;
