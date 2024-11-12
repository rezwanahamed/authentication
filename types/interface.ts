export interface IFetchUserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    age: number;
    dateOfBirth: Date | string;
    createdAt: Date;
    password: string;
  }
  

// Interface for a User object
interface IPasskeyUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: number;
    address: string;
    dateOfBirth: string; // ISO string format for Date
    password: string;
    verified: boolean;
    createdAt: string; // ISO string format for Date
    updatedAt: string; // ISO string format for Date
    __v: number;
}

// Interface for a Passkey object
export interface IPasskey {
    passkey: string;
}

// Interface to hold the User and their Passkeys
export interface IUserPassKeysResponse {
    user: IPasskeyUser;
    passkeys: IPasskey[];
}

// interface for next auth middleware 
export interface ICustomSession {
    user?: {
      id?: string | null;
      email?: string | null;
    };
    accessToken: string;
    refreshToken: string | null;
  }