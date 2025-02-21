import { AppBar, styled, Toolbar, Typography } from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import AnonymousMenu from "./AnonymousMenu.tsx";
import UserMenu from "./UserMenu.tsx";
import { useAppSelector } from "../../app/hooks.ts";
import { selectUser } from "../../features/users/userSlice.ts";

const Link = styled(NavLink)({
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    color: "inherit",
  },
});

const container = {
  maxWidth: 1440,
  width: "100%",
  margin: "auto",
  padding: "15px 0",
};

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  return (
    <AppBar position="sticky" sx={{ mb: 2, backgroundColor: "#07575b" }}>
      <Toolbar
        sx={{
          ...container,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" sx={{ textTransform: "uppercase" }}>
            Exam 12
          </Link>
        </Typography>
        {user ? <UserMenu user={user} /> : <AnonymousMenu />}
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
