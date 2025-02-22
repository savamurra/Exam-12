import CssBaseline from "@mui/material/CssBaseline";
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./features/users/RegisterPage.tsx";
import LoginPage from "./features/users/LoginPage.tsx";
import Photos from "./features/photos/container/Photos.tsx";
import UserPhotos from "./features/photos/container/UsersPhotos.tsx";
import PhotosForm from "./features/photos/components/PhotosForm.tsx";
import ProtectedRoute from "./components/ProtetectedRoute/ProtectedRoute.tsx";
import { useAppSelector } from "./app/hooks.ts";
import { selectUser } from "./features/users/userSlice.ts";

const container = {
  maxWidth: 1640,
  width: "100%",
  margin: "auto",
  padding: "15px 0",
};

const App = () => {
  const user = useAppSelector(selectUser);
  return (
    <>
      <div>
        <CssBaseline />
        <header>
          <AppToolbar />
        </header>
        <div style={{ ...container }}>
          <Routes>
            <Route path="/" element={<Photos />} />
            <Route path="users-photo/:id" element={<UserPhotos />} />
            <Route
              path="/add-photo"
              element={
                <ProtectedRoute
                  isAllowed={
                    (user && user.role === "admin") ||
                    (user && user.role === "user")
                  }
                >
                  <PhotosForm />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<h1>Not found</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
