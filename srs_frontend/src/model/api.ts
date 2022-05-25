export interface ICourse {
    startTime: {
        hour: number;
        minutes: number;
    };
    endTime: {
        hour: number;
        minutes: number;
    };
    startDate: string;
    endDate: string;
    day: number;
}

export interface IUser {
    email: string;
    name: string;
    surname: string;
    role: "student" | "lecturer";
    activated: boolean;
}

export interface IRegisterUserData {
    email: string;
    name: string;
    surname: string;
    password: string;
    role: "student" | "lecturer";
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
}