import {createAsyncThunk} from "@reduxjs/toolkit";
import {IPhoto} from "../../types";
import axiosApi from "../../axiosApi.ts";

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
