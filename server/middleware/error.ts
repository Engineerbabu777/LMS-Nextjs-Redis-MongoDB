import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

// Middleware function to handle errors
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    // If the error does not have a status code, set it to 500 (Internal Server Error)
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle specific error types:

    // Handle Mongoose "CastError" (e.g., invalid MongoDB ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Mongoose duplicate key error (e.g., unique field constraint violated)
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // Handle invalid JSON Web Token error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is invalid, Try again!';
        err = new ErrorHandler(message, 400);
    }

    // Handle expired JSON Web Token error
    if (err.name === 'TokenExpiredError') {
        const message = 'Json Web Token is expired, Try again!';
        err = new ErrorHandler(message, 400);
    }

    // Send error response with appropriate status code and message
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}
