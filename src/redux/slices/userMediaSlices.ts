import { createSlice } from "@reduxjs/toolkit";
import mediaProps from "../../types/file.type";

type Initialstate = {
    media: {
        mediaSelectOptions?: {
            singleSelection?: boolean,
            medieType?: string
            positiveNavigate?: string
            negativeNavigate?: string
        }
        mediaSelections?: mediaProps[]
        selectedMedia?: mediaProps[]
        displaySingleMedia?: mediaProps | null
        data: mediaProps[]
        loading: boolean
        error: string
    }
};

const initialState: Initialstate = {
    media: {
        mediaSelectOptions: {
            positiveNavigate: "",
            negativeNavigate: "",
            singleSelection: true,
            medieType: "all",
        },
        selectedMedia: [],
        mediaSelections: [],
        displaySingleMedia: null,
        data: [],
        loading: true,
        error: "",
    }
};

const usermedia = createSlice({
    name: "userMedia",
    initialState,
    reducers: {
        fetchMdia: (state, action: { payload: Initialstate["media"] }) => {
            state.media = action.payload;
        },
        addMdia: (state, action: { payload: mediaProps }) => {
            state.media.data.push(action.payload);
        },
        deleteMdia: (state, action: { payload: { _id: string } }) => {
            state.media.data = state.media.data.filter(
                (md) => md._id !== action.payload._id
            );
        },
        addToDisplaySingleMedia: (state, action: { payload: mediaProps }) => {
            state.media.displaySingleMedia = action.payload;
        },
        displayMediaOptions: (state, action: { payload: Initialstate["media"]["mediaSelectOptions"] }) => {
            state.media.mediaSelectOptions = action.payload;
        },
        addToMediaSelections: (state, action: { payload: mediaProps }) => {
            const getPreValue = state.media.mediaSelections || [];
            state.media.mediaSelections = [...getPreValue, action.payload];
        },
        selectedMedia: (state, action: { payload: mediaProps[] }) => {
            state.media.selectedMedia = action.payload;
        },
        removeFromMediaSelections: (state, action: { payload: { _id: string } }) => {
            const getPreValue = state.media.mediaSelections || [];
            state.media.mediaSelections = getPreValue.filter(
                (md) => md._id !== action.payload._id
            );
        },
        clearAllSelectedMedia: (state, action: { payload: [] }) => {
            state.media.mediaSelections = action.payload || [];
        },
    }
});

export const {
    fetchMdia, addMdia, deleteMdia,
    displayMediaOptions, addToMediaSelections, selectedMedia,
    removeFromMediaSelections, clearAllSelectedMedia,
    addToDisplaySingleMedia,
} = usermedia.actions;
export default usermedia.reducer;
