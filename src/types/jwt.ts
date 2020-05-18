import { IUser } from "./user";

export interface TokenInterface {
    user: {
        email: string;
        username: string;
        role: string;
        firstName: string;
        id: string;
    }
}

export interface AdminPayload{
    status: string
    user: IUser
}