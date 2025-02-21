import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {PersistGate} from "redux-persist/integration/react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {addInterceptors} from "./axiosApi.ts";
import {persistor, store} from "./app/store.ts";
import {GOOGLE_CLIENT_ID} from "./globalConstants.ts";
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router-dom";

addInterceptors(store);

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <ToastContainer />
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </GoogleOAuthProvider>,
);