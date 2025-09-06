import mongoose from "mongoose";

export const Connection = async ()=>{
    try{
     const mongoConn=await mongoose.connect(process.env.MONGO_URL);
     return mongoConn;
    }
    catch(error){
        console.log("Error while connecting to database",error);
    }
   
}