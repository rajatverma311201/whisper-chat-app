/* eslint-disable */
/* eslint-disable */
import { AppError } from "@/utils/app-error";

const handleCastErrorDB = (err: {
    name?: any;
    message?: any;
    statusCode?: any;
    isOperational?: any;
    stack?: any;
    status?: any;
    errors?: any;
    path: any;
    value: any;
    errmsg?: any;
}) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return {
        name: err.name,
        message: message,
        statusCode: 400,
        isOperational: true,
        stack: err.stack,
        status: err.status,
        errors: err.errors,
        path: err.path,
        value: err.value,
        errmsg: err.errmsg,
    };
};

const handleDuplicateFieldsDB = (err: {
    name?: any;
    message?: any;
    statusCode?: any;
    isOperational?: any;
    stack?: any;
    status?: any;
    errors?: any;
    path?: any;
    value?: any;
    errmsg: any;
    code?: number; // Add the 'code' property
}) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return {
        name: err.name,
        message: message,
        statusCode: 400,
        isOperational: true,
        stack: err.stack,
        status: err.status,
        errors: err.errors,
        path: err.path,
        value: err.value,
        errmsg: err.errmsg,
        code: err.code, // Add the 'code' property
    };
};

const handleValidationErrorDB = (err: {
    name?: any;
    message?: any;
    statusCode?: any;
    isOperational?: any;
    stack?: any;
    status?: any;
    errors: any;
    path?: any;
    value?: any;
    errmsg?: any;
}) => {
    // eslint-disable-next-line no-unused-vars
    const errors = Object.values(err.errors).map((el: any) => el.message);

    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
    new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (
    err: { statusCode: any; status: any; message: any; stack: any },
    res: {
        status: (arg0: any) => {
            (): any;
            new (): any;
            json: {
                (arg0: {
                    status: any;
                    error: any;
                    message: any;
                    stack: any;
                }): void;
                new (): any;
            };
        };
    }
) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (
    err: {
        name?: any;
        message: any;
        statusCode: any;
        isOperational: any;
        stack?: any;
        status: any;
        errors?: any;
        path?: any;
        value?: any;
        errmsg?: any;
    },
    res: {
        status: (arg0: number) => {
            (): any;
            new (): any;
            json: { (arg0: { status: any; message: any }): void; new (): any };
        };
    }
) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error("ERROR 💥", err);

        // 2) Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};

export const globalErrorHandler = (
    err: {
        statusCode: number;
        status: string;
        name: any;
        message: any;
        isOperational: any;
        stack: any;
        errors: any;
        path: any;
        value: any;
        errmsg: any;
    },
    req: any,
    res: any,
    next: any
) => {
    // console.log(err.stack);
    // console.log(process.env.NODE_ENV);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = {
            name: err.name,
            message: err.message,
            statusCode: err.statusCode,
            isOperational: err.isOperational,
            stack: err.stack,
            status: err.status,
            errors: err.errors,
            path: err.path,
            value: err.value,
            errmsg: err.errmsg,
        };

        error.message = err.message;
        // if (error.name === "CastError") error = handleCastErrorDB(error);
        // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        // if (error.name === "ValidationError")
        //     error = handleValidationErrorDB(error);
        // if (error.name === "JsonWebTokenError") error = handleJWTError();
        // if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
