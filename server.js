import express from 'express';
import bodyParser  from 'body-parser';
import dotenv from 'dotenv'
import { Connection } from './connection/connection.js';

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productsRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import reportRoutes from './routes/reportRoutes.js'



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000
app.use(bodyParser.json())

app.use(express.urlencoded({extended:true}))

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/contacts', contactRoutes);
app.use('/transactions', transactionRoutes);
app.use('/reports', reportRoutes);


const startServer = async()=>{
    const connect =await Connection();
    if(connect){
        console.log("Database connected successfully");
    }
    else{
        console.log("Database connection failed");
    }
    return app;
}
startServer()
.then(app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}))
.catch((error)=>console.log("Error while starting the server",error))