import { createSlice } from "@reduxjs/toolkit";
import postProps from "../../types/post.type";

type Initialstate = {
    drafts: {
        data: postProps[]
        loading: boolean,
        error: string
    }
    blogposts: {
        data: postProps[]
        loading: boolean,
        error: string
    }
    savedBlogposts: {
        data: postProps[]
        loading: boolean,
        error: string
    }
};

const initialState: Initialstate = {
    drafts: {
        data: [],
        loading: true,
        error: "",
    },
    blogposts: {
        data: [],
        loading: true,
        error: "",
    },
    savedBlogposts: {
        data: [],
        loading: true,
        error: "",
    },
};

const userBlogposts = createSlice({
    name: "userBlogposts",
    initialState,
    reducers: {
        fetchBlogposts: (state, action: { payload: Initialstate["blogposts"] }) => {
            state.blogposts = action.payload;
        },
        addBlogpost: (state, action: { payload: postProps }) => {
            state.blogposts.data = [action.payload, ...state.blogposts.data];
        },
        editBlogpost: (state, action: { payload: postProps }) => {
            state.blogposts.data = state.blogposts.data.map(
                (item) => item._id === action.payload._id ? { ...item, ...action.payload } : item
            );
        },
        deleteBlogpost: (state, action: { payload: { _id: string } }) => {
            state.blogposts.data = state.blogposts.data.filter(
                (item) => item._id !== action.payload._id
            );
        },
        fetchDrafts: (state, action: { payload: Initialstate["drafts"] }) => {
            state.drafts = action.payload;
        },
        addDraft: (state, action: { payload: postProps }) => {
            state.drafts.data = [action.payload, ...state.drafts.data];
        },
        editDraft: (state, action: { payload: postProps }) => {
            state.drafts.data = state.drafts.data.map(
                (item) => item._id === action.payload._id ? { ...item, ...action.payload } : item
            );
        },
        deleteDraft: (state, action: { payload: { _id: string } }) => {
            state.drafts.data = state.drafts.data.filter(
                (item) => item._id !== action.payload._id
            );
        },
        fetchSavedBlogposts: (state, action: { payload: Initialstate["savedBlogposts"] }) => {
            state.savedBlogposts = action.payload;
        },
        addSaveBlogposts: (state, action: { payload: postProps }) => {
            state.savedBlogposts.data = [action.payload, ...state.savedBlogposts.data];
        },
        removeSaveBlogpost: (state, action: { payload: { _id: string } }) => {
            state.savedBlogposts.data = state.savedBlogposts.data.filter((item) => item._id !== action.payload._id);
        },
    },
});

export const {
    fetchBlogposts, addBlogpost, editBlogpost, deleteBlogpost,
    fetchDrafts, addDraft, editDraft, deleteDraft,
    fetchSavedBlogposts, addSaveBlogposts, removeSaveBlogpost
} = userBlogposts.actions;
export default userBlogposts.reducer;
