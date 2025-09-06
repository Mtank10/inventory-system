import mongoose from 'mongoose';


const contactSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            index: true },
        phone: {
             type: String
             },
        email: {
             type: String, 
             lowercase: true
             },
        address: { 
            type: String
         },
        type: {
             type: String,
             enum: ['customer', 'vendor'], 
             required: true,
             index: true },
        businessId: {
             type: mongoose.Schema.Types.ObjectId,
             required: true,
             index: true },
    },
    { timestamps: true }
);


const Contact = mongoose.model('Contact', contactSchema);
export default Contact;