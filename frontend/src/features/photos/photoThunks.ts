import {createAsyncThunk} from "@reduxjs/toolkit";
import {GlobalError, IPhoto, PhotoMutation, ValidationError} from "../../types";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

export const getPhotoThunks = createAsyncThunk<IPhoto[], string | undefined>('photos/getPhotoThunks',
    async (id) => {
        const userId = id ? `photo?user=${id}` : 'photo'
        const photoResponse = await axiosApi<IPhoto[]>(userId);
        return photoResponse.data;
    }
);

export const getOnePhoto = createAsyncThunk<IPhoto, string>(
    "photos/getOnePhoto",
    async (id: string) => {
        const response = await axiosApi<IPhoto>(`/photo/${id}`);
        return response.data;
    },
);

export const createPhoto = createAsyncThunk<void, PhotoMutation, { rejectValue: ValidationError }>('photos/createPhoto',
    async (photoMutation, {rejectWithValue}) => {
        try {
            const formData = new FormData();

            const keys = Object.keys(photoMutation) as (keyof PhotoMutation)[];

            keys.forEach((key) => {
                const value = photoMutation[key];
                if (value !== null) {
                    formData.append(key, value);
                }
            });
            await axiosApi.post("/photo", formData);
        } catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    }
);

export const deletePhoto = createAsyncThunk<void, string, {rejectValue: GlobalError }>(
    'photos/deletePhoto', async (id: string, { rejectWithValue}) => {
        try {
            await axiosApi.delete(`/photo/${id}`);
        } catch (e) {
            if (isAxiosError(e) && e.response) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }

    },
);