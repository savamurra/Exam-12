export interface UserFields {
    password: string;
    email: string;
    token: string;
    role: string;
    displayName: string;
    googleId: string;
    avatar: string;
}

export interface IPhoto {
    user: string
    title: string;
    image: string | null;
}