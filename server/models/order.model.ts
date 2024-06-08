import { Document, Schema } from "mongoose";
import mongoose from 'mongoose';

export interface IOrder extends Document{
    courseId: string;
    userId:string;
    payment_info: object;
    
}

const orderSchema = new Schema<IOrder>({
    courseId:{
       type:String,
       required:true,
    },
    userId:{
        type: String,
        required:true,
    },
    payment_info:{
        type:Object,
        // required:true
    }
},{
    timestamps:true
});


export const orderModel = mongoose.model('Order',orderSchema)