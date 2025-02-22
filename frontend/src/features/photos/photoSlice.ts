import { createSlice } from "@reduxjs/toolkit";
import { GlobalError, IPhoto, ValidationError } from "../../types";
import {
  createPhoto,
  deletePhoto,
  getOnePhoto,
  getPhotoThunks,
} from "./photoThunks.ts";
import { RootState } from "../../app/store.ts";

interface PhotoSliceState {
  photos: IPhoto[];
  onePhoto: IPhoto | null;
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  createError: ValidationError | null;
  deleteError: GlobalError | null;
}

const initialState: PhotoSliceState = {
  photos: [],
  onePhoto: null,
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  createError: null,
  deleteError: null,
};

export const selectPhotos = (state: RootState) => state.photos.photos;
export const selectLoading = (state: RootState) => state.photos.isLoading;
export const selectOnePhoto = (state: RootState) => state.photos.onePhoto;
export const isCreteError = (state: RootState) => state.photos.createError;
export const selectCreating = (state: RootState) => state.photos.isCreating;
export const selectDeleting = (state: RootState) => state.photos.isDeleting;

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
      .addCase(createPhoto.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createPhoto.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createPhoto.rejected, (state, { payload: error }) => {
        state.isCreating = false;
        state.createError = error || null;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deletePhoto.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deletePhoto.rejected, (state, { payload: error }) => {
        state.isDeleting = false;
        state.deleteError = error || null;
      });
  },
});

export const photoReducer = photosSlice.reducer;
