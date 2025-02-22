import { Button, CardMedia } from "@mui/material";
import { User } from "../../types";
import { useAppDispatch } from "../../app/hooks.ts";
import { logout } from "../../features/users/userThunks.ts";
import { unsetUser } from "../../features/users/userSlice.ts";
import { apiUrl } from "../../globalConstants.ts";
import { Link } from "react-router-dom";

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(unsetUser());
  };

  const updateAvatar = { ...user };
  const image = user.avatar;

  if (image && image.startsWith("http")) {
    updateAvatar.avatar = image;
  } else if (image) {
    updateAvatar.avatar = apiUrl + "/" + image;
  } else {
    updateAvatar.avatar =
      "https://mui.com/static/images/cards/contemplative-reptile.jpg"; // Значение по умолчанию
  }
  return (
    <>
      <Link
        to={`/users-photo/${user._id}`}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          color: "inherit",
          textTransform: "uppercase",
          fontSize: "13px",
          marginRight: "10px",
        }}
      >
        Hello, {user.displayName}!
        <CardMedia
          component="img"
          alt={user.displayName || "Artist Image"}
          image={updateAvatar.avatar}
          sx={{ width: 30, height: 30, borderRadius: "50%", marginLeft: 1 }}
        />
      </Link>

      <Button onClick={handleLogout} color="inherit">
        Logout
      </Button>
    </>
  );
};

export default UserMenu;
