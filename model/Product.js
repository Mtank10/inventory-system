import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true,
         index: true },
    description: {
         type: String, 
         required: true 
        },
    price: {
         type: Number, 
         required: true, 
         min: 0 },
    stock: { 
         type: Number,
         required: true, 
         min: 0 },
    category: {
         type: String, 
         required: true, 
         index: true },
    businessId: {
         type: mongoose.Schema.Types.ObjectId, 
         required: true, 
         index: true }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema);
export default Product;