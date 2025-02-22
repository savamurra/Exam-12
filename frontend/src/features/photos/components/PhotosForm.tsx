import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PhotoMutation } from "../../../types";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../users/userSlice.ts";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import FileInput from "../../../components/FileInput/FileInput.tsx";
import Button from "@mui/material/Button";
import { createPhoto } from "../photoThunks.ts";
import { toast } from "react-toastify";
import { isCreteError, selectCreating } from "../photoSlice.ts";
import { useNavigate } from "react-router-dom";

const initialState = {
  title: "",
  image: null as File | null,
};
const PhotosForm = () => {
  const [form, setForm] = useState<PhotoMutation>(initialState);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const createError = useAppSelector(isCreteError);
  const navigate = useNavigate();
  const isCreate = useAppSelector(selectCreating);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (user) {
      setForm((prevState) => ({ ...prevState, user: user._id, [name]: value }));
    }
  };

  const fileEventChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setForm((prevState) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return createError?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.image) {
      return toast.error(
        "Поле Photo Title и выбор картинки обязателен к заполнению!",
      );
    }
    try {
      await dispatch(createPhoto(form)).unwrap();
      setForm(initialState);
      toast.success("Photos created successfully.");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        width: "600px",
        margin: "100px auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "20px", color: "#07575b" }}
      >
        Add New Cocktail
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
        onSubmit={onSubmit}
      >
        <Grid container spacing={2}>
          <Grid
            size={12}
            sx={{
              backgroundColor: "#ededed",
              padding: "0 10px",
              borderRadius: "10px",
            }}
          >
            <TextField
              fullWidth
              name="title"
              label="Photo Title"
              id="title"
              value={form.title}
              onChange={onChange}
              error={Boolean(getFieldError("title"))}
              helperText={getFieldError("title")}
              variant="outlined"
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
          </Grid>
          <Grid size={12}>
            <FileInput
              name="image"
              label="Upload Cocktail Image"
              onGetFile={fileEventChangeHandler}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#07575b",
              color: "#fff",
              padding: "10px 30px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#064f4a",
              },
            }}
            disabled={isCreate}
          >
            Create photo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PhotosForm;
