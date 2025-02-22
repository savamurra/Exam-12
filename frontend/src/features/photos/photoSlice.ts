import {createSlice} from "@reduxjs/toolkit";
import {IPhoto} from "../../types";
import {getOnePhoto, getPhotoThunks} from "./photoThunks.ts";
import {RootState} from "../../app/store.ts";

interface PhotoSliceState {
    photos: IPhoto[];
    onePhoto: IPhoto | null;
    isLoading: boolean;
    isCreating: boolean;
    isDeleting: boolean;
}

const initialState: PhotoSliceState = {
    photos: [],
    onePhoto: null,
    isLoading: false,
    isCreating: false,
    isDeleting: false,
}

export const selectPhotos = (state: RootState) => state.photos.photos;
export const selectLoading = (state: RootState) => state.photos.isLoading;
export const selectOnePhoto = (state: RootState) => state.photos.onePhoto;

export const photosSlice = createSlice({
    name: "photos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPhotoThunks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPhotoThunks.fulfilled, (state, { payload: photos }) => {
                state.isLoading = false;
                state.photos = photos;
            })
            .addCase(getPhotoThunks.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getOnePhoto.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOnePhoto.fulfilled, (state, { payload: photo }) => {
                state.isLoading = false;
                state.onePhoto = photo;
            })
            .addCase(getOnePhoto.rejected, (state) => {
                state.isLoading = false;
            })
    }
});

export const photoReducer = photosSlice.reducer;