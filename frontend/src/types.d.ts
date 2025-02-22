export interface User {
    _id: string;
    email: string;
    token: string;
    role: string;
    avatar: string;
    displayName: string;
}

export interface RegisterMutation {
    email: string;
    displayName: string;
    avatar: File | null;
    password: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface RegisterResponse {
    user: User;
    message: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        };
    };
    message: string;
    name: string;
    _message: string;
}

export interface GlobalError {
    error: string;
}

export interface IPhoto {
    _id: string;
    user: {
        _id: string;
        displayName: string;
    };
    title: string;
    image: File | null;
}