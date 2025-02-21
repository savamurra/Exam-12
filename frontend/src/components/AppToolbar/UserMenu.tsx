import { Button, CardMedia, Menu, MenuItem } from "@mui/material";
import { User } from "../../types";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks.ts";
import { logout } from "../../features/users/userThunks.ts";
import { unsetUser } from "../../features/users/userSlice.ts";
import { apiUrl } from "../../globalConstants.ts";


interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <Button onClick={handleClick} color="inherit">
        Hello, {user.displayName}!
        <CardMedia
          component="img"
          alt={user.displayName || "Artist Image"}
          image={updateAvatar.avatar}
          sx={{ width: 30, height: 30, borderRadius: "50%", marginLeft: 1 }}
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
