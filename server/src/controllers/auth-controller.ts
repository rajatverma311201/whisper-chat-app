import { User } from "@/models/user-model";
import { AppError } from "@/utils/app-error";
import { catchAsync } from "@/utils/catch-async";
import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
    const expiry = process.env.JWT_EXPIRES_IN;
    const jwtTokenExpiry =
        Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000;

    const cookieExpiry = new Date(jwtTokenExpiry);

    const token = signToken(user._id as string);
    const cookieOptions = {
        expires: cookieExpiry,
        httpOnly: true,
        secure: false,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    const filteredUser = JSON.parse(JSON.stringify(user));

    filteredUser.password = undefined;
    filteredUser.passwordConfirm = undefined;

    res.status(statusCode).json({
        status: "success",
        data: {
            user: filteredUser,
            jwtToken: token,
            jwtTokenExpiry: jwtTokenExpiry,
        },
    });
};

export const signup = catchAsync(async (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return next(new AppError("Please provide all the fields", 400));
    }

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
        return next(new AppError("User already exists!", 400));
    }

    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError("Passwords do not match!", 400));
    }

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    // const url = `${req.protocol}://${req.get('host')}/me`;
    // await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

// Only for rendered pages, no errors!
export const isLoggedIn = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            // 1) verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            ) as JwtPayload;

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat as number)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            req.user = currentUser;
            return next();
        } catch (err) {
            console.log(err);
            return next();
        }
    }
    next();
});
export const logout = catchAsync(async (req, res, next) => {
    const cookieExpiry = new Date(
        Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    );
    const cookieOptions = {
        expires: cookieExpiry,
        httpOnly: true,
        secure: false,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    try {
        res.cookie("jwt", "loggedOut", {
            expires: new Date(Date.now() + 10000),
            httpOnly: true,
        });
        res.status(200).json({
            status: "success",
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
export const protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                "You are not logged in! Please log in to get access.",
                401
            )
        );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token does no longer exist.",
                401
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat as number)) {
        return next(
            new AppError(
                "User recently changed password! Please log in again.",
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});
