import { NextFunction, Request, Response } from "express";

export const catchAsync = (fn: (...PARAMS: any) => any): any => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
