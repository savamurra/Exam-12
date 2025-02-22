import {Card, CardMedia, CardContent, Typography, Modal} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {selectDeleting, selectLoading, selectOnePhoto, selectPhotos} from "../photoSlice.ts";
import {useEffect, useState} from "react";
import {deletePhoto, getOnePhoto, getPhotoThunks} from "../photoThunks.ts";
import Spinner from "../../../components/UI/Spinner/Spinner.tsx";
import {apiUrl} from "../../../globalConstants.ts";
import {NavLink} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import {selectUser} from "../../users/userSlice.ts";


const Photos = () => {
    const dispatch = useAppDispatch();
    const photos = useAppSelector(selectPhotos);
    const onePhoto = useAppSelector(selectOnePhoto);
    const loading = useAppSelector(selectLoading);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectDelete, setSelectDelete] = useState<string>('');
    const isDelete = useAppSelector(selectDeleting);
    const user = useAppSelector(selectUser);

    useEffect(() => {
        dispatch(getPhotoThunks())
    }, [dispatch]);

    const openModalHandler = async (id: string) => {
        await dispatch(getOnePhoto(id));
        setOpenModal(true);
    }

    const closeModal = () => {
        setOpenModal(false);
    };

    const onDelete = async (photoId: string) => {
        setSelectDelete(photoId);
        try {
            await dispatch(deletePhoto(photoId)).unwrap();
            await dispatch(getPhotoThunks())
            toast.success("Product deleted successfully.");
            setSelectDelete('');
        } catch (error) {
            toast.error((error as { error: string }).error);
        }
    }

    const image = onePhoto?.image
        ? apiUrl + "/" + onePhoto.image
        : "https://mui.com/static/images/cards/contemplative-reptile.jpg";


    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 4 }}>
                    {photos.map((photo) => {
                        const image = photo.image
                            ? apiUrl + "/" + photo.image
                            : "https://mui.com/static/images/cards/contemplative-reptile.jpg";
                        return (
                            <Grid key={photo._id} sx={{flexWrap: "wrap"}}>
                                    <Card sx={{
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        width: "250px",
                                        height: '100%',
                                        transition: "0.3s",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                        "&:hover": { transform: "scale(1.05)" }
                                    }}
                                    >
                                        <CardMedia
                                            component="img"
                                            alt={photo.title || "Artist Image"}
                                            width="100%"
                                            height="300px"
                                            image={image}
                                            onClick={() => {openModalHandler(photo._id)}}
                                        />
                                        <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                {photo.title}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                By: <NavLink to={`/users-photo/${photo.user._id}`} style={{color: 'black'}}>{photo.user.displayName}</NavLink>
                                            </Typography>
                                        </CardContent>
                                        {user && user.role === 'admin' && (
                                            <Button
                                                sx={{
                                                    backgroundColor: "transparent",
                                                    border: "1px solid #07575b",
                                                    color: "#07575b",
                                                    marginTop: '5px',
                                                    width: 'max-content',
                                                    margin: '0 auto 10px auto',
                                                    "&:hover": {
                                                        backgroundColor: "#064f4a",
                                                        color: "white",
                                                    },
                                                }}
                                                onClick={() => {
                                                    onDelete(photo._id)
                                                }}
                                                disabled={isDelete && selectDelete === photo._id}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Card>
                            </Grid>
                            )
                    })}
                    <Modal
                        open={openModal}
                        onClose={closeModal}
                        aria-labelledby="youtube-modal-title"
                        aria-describedby="youtube-modal-description"
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: 2,
                                maxWidth: 800,
                                width: "90%",
                                outline: "none",
                                textAlign: "center",

                            }}
                        >
                            <CardMedia
                                component="img"
                                alt={onePhoto?.title || "Artist Image"}
                                width="100%"
                                height="500px"
                                image={image}
                            />
                            <Button onClick={closeModal} sx={{ mt: 2 }}>
                                Close
                            </Button>
                        </Box>
                    </Modal>
                </Grid>
            )
            }
        </>

    );
};

export default Photos;
