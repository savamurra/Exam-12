import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import {
  clearLoginError,
  selectLoginError,
  selectRegisterError,
} from "./userSlice.ts";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogin, login } from "./userThunks.ts";
import { Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogin } from "@react-oauth/google";
import { LoginMutation } from "../../types";
import * as React from "react";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";

const reqEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const RegisterPage = () => {
  const [form, setForm] = useState<LoginMutation>({
    email: "",
    password: "",
  });
  const [password, setPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const registerError = useAppSelector(selectRegisterError);

  const dispatch = useAppDispatch();
  const loginError = useAppSelector(selectLoginError);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearLoginError());
    };
  }, [dispatch]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      if (!value) {
        setErrors((prevState) => ({ ...prevState, email: "" }));
      } else if (reqEmail.test(value)) {
        setErrors((prevState) => ({ ...prevState, email: "" }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          email: "Invalid email format",
        }));
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(form)).unwrap();
    navigate("/");
  };

  const hiddenPassword = () => {
    setPassword(!password);
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate("/");
  };

  const getFieldError = (fieldName: string) => {
    try {
      return registerError?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <Container>
      <CssBaseline />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#F4F4F4",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            width: "800px",
            margin: "100px auto",
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          <Box
            sx={{
              height: "444px",
              width: "400px",
              backgroundColor: "#07575b",
              borderRadius: "10px 90px 90px 10px",
            }}
          >
            <Grid container sx={{ position: "relative" }}>
              <Grid
                style={{
                  color: "white",
                  position: "absolute",
                  top: "150px",
                  left: "80px",
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" fontWeight="500">
                  Hello Welcome!
                </Typography>
                <Typography>Don't have an account?</Typography>
                <NavLink
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    border: "1px solid white",
                    padding: "10px 60px",
                    borderRadius: "10px",
                    marginTop: "20px",
                    display: "block",
                  }}
                >
                  Register
                </NavLink>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              width: "400px",
            }}
          >
            <Typography component="h1" variant="h5">
              Login
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mt: 3, width: "100%" }}>
                {loginError.error}
              </Alert>
            )}

            <Box sx={{ pt: 2 }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    void googleLoginHandler(credentialResponse.credential);
                  }
                }}
                onError={() => alert("Login failed")}
              />
            </Box>
            <Box
              component="form"
              noValidate
              onSubmit={onSubmit}
              sx={{ mt: 3, width: "270px" }}
            >
              <Grid container direction={"column"} size={12} spacing={2}>
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ededed",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={inputChange}
                    error={
                      Boolean(getFieldError("email")) || Boolean(errors.email)
                    }
                    helperText={getFieldError("email") || errors.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "gray",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "gray",
                      },
                    }}
                  />
                  <PersonIcon />
                </Grid>
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ededed",
                    padding: "0 10px",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={password ? "text" : "password"}
                    id="password"
                    value={form.password}
                    onChange={inputChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "gray",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "gray",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{ color: "black" }}
                            onClick={() => hiddenPassword()}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {password ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#07575b" }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default RegisterPage;
