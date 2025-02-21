import { GlobalError, User, ValidationError } from "../../types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store.ts";
import { googleLogin, login, register } from "./userThunks.ts";

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginError: GlobalError | null;
  loginLoading: boolean;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginError: null,
  loginLoading: false,
};

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterError = (state: RootState) =>
  state.users.registerError;
export const selectLoginError = (state: RootState) => state.users.loginError;

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    clearRegisterError: (state) => {
      state.registerError = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, { payload: registerResponse }) => {
        state.registerLoading = false;
        state.user = registerResponse.user;
      })
      .addCase(register.rejected, (state, { payload: error }) => {
        state.registerLoading = false;
        state.registerError = error || null;
      })
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, { payload: user }) => {
        state.loginLoading = false;
        state.user = user;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loginLoading = true;
        state.registerError = null;
      })
      .addCase(googleLogin.fulfilled, (state, { payload: user }) => {
        state.loginLoading = false;
        state.user = user;
      })
      .addCase(googleLogin.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      });
  },
});

export const usersReducer = userSlice.reducer;
export const { unsetUser, clearRegisterError, clearLoginError } =
  userSlice.actions;
