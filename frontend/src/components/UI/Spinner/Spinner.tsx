import { Box, CircularProgress } from "@mui/material";

const Spinner = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress
        sx={{ mx: "auto" }}
        style={{ width: "40px", height: "40px" }}
      />
    </Box>
  );
};

export default Spinner;
