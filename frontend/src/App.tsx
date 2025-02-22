import CssBaseline from "@mui/material/CssBaseline";
import AppToolbar from "./components/AppToolbar/AppToolbar.tsx";
import {Route, Routes} from "react-router-dom";
import RegisterPage from "./features/users/RegisterPage.tsx";
import LoginPage from "./features/users/LoginPage.tsx";
import Photos from "./features/photos/container/Photos.tsx";
import UserPhotos from "./features/photos/container/UsersPhotos.tsx";


const App = () => {

  return (
    <>
      <div>
          <CssBaseline/>
          <header>
              <AppToolbar/>
          </header>
          <div>
              <Routes>
                  <Route path='/' element={<Photos/>}/>
                  <Route path='users-photo/:id' element={<UserPhotos/>}/>
                  <Route path='/register' element={<RegisterPage/>}/>
                  <Route path="/login" element={<LoginPage/>} />
                  <Route path="*" element={<h1>Not found</h1>} />
              </Routes>
          </div>
      </div>
    </>
  )
};

export default App
