import mongoose from 'mongoose';


const lineItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        lineTotal: {
            type: Number,
            required: true,
            min: 0
        },
    },
    { _id: false }
);

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['sale', 'purchase'],
            required: true,
            index: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        },
        products: {
            type: [lineItemSchema],
            required: true,
            validate: v => v.length > 0
        },
        totalAmount: {
            type: Number,
            required: true, min: 0
        },
        date: {
            type: Date, default: () => new Date(),
            index: true
        },
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
    },
    { timestamps: true }
);


const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;