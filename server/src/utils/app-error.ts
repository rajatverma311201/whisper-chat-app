// export class AppError extends Error {
//     public readonly statusCode: number;
//     public readonly status: string;
//     public readonly isOperational: boolean;

//     constructor(message: string, statusCode: number) {
//         super(message);

//         this.statusCode = statusCode;
//         this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
//         this.isOperational = true;

//         Error.captureStackTrace(this, this.constructor);
//     }
// }

export class AppError extends Error {
    statusCode: number;

    status: string;

    isOperational: boolean;

    errors?: any;

    path?: any;

    value?: any;

    errmsg?: any;

    code?: any;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;

        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
