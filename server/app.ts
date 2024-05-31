import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app = express()
require("dotenv").config();

// body parser!
app.use(express.json({limit:"50md"}));

// cookie parser!
app.use(cookieParser());

// cors!
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN!
}))

// testing route!
app.get("/test", async(req:Request,res:Response,next:NextFunction) => {
    res.status(200).json({message:"APi working..."})
})


// unknown routes!
app.all("*", async(req:Request,res:Response,next:NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`) as any;
  err.statusCode = 404;
  next(err);
})