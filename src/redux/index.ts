import { configureStore } from "@reduxjs/toolkit";
import userProfileSlices from "./slices/userProfileSlices";
import userBlogpostSlices from "./slices/userBlogpostSlices";
import userMediaSlices from "./slices/userMediaSlices";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        userProfileSlices,
        userBlogpostSlices,
        userMediaSlices,
    },
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export  default store; 
