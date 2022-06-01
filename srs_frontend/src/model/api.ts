export interface ICourse {
    _id?: any,
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
    course: string,
    location: string, 
    lecturer: string,
    students?: string[]
}

enum Role {
    student = "student",
    lecturer = "lecturer", 
    admin = "admin"
  }

export interface IUser {
    email: string;
    name: string;
    surname: string;
    role: Role;
    activated: boolean;
}

export interface IRegisterUserData {
    email: string;
    name: string;
    surname: string;
    password: string;
    role: Role;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
}