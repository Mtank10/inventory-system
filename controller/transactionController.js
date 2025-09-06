import { validationResult } from 'express-validator';
import Transaction from '../model/Transaction.js';
import Product from '../model/Product.js';
import Contact from '../model/Contact.js';


export const getTransaction =( async (req, res) => {
  try {
    const { type, from, to } = req.query;
    let filter = { businessId: req.user.businessId };
    
    if (type) {
      filter.type = type;
    }
    
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    
    const transactions = await Transaction.find(filter)
      .populate('customerId', 'name')
      .populate('vendorId', 'name')
      .populate('products.productId', 'name');
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export const createTransaction = ( async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, customerId, vendorId, products, date } = req.body;
    
    
    if (type === 'sale') {
      const customer = await Contact.findOne({
        _id: customerId,
        businessId: req.user.businessId,
        type: 'customer'
      });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    } else {
      const vendor = await Contact.findOne({
        _id: vendorId,
        businessId: req.user.businessId,
        type: 'vendor'
      });
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
    }
    
    
    let totalAmount = 0;
    const lineItems = [];
    
    for (const item of products) {
      const product = await Product.findOne({
        _id: item.productId,
        businessId: req.user.businessId
      });
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      
      if (type === 'sale') {
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
          });
        }
        product.stock -= item.quantity;
      } else {
        product.stock += item.quantity;
      }
      
      await product.save();
      
      const lineTotal = item.quantity * item.price;
      totalAmount += lineTotal;
      
      lineItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        lineTotal
      });
    }
    
  
    const transaction = new Transaction({
      type,
      customerId: type === 'sale' ? customerId : null,
      vendorId: type === 'purchase' ? vendorId : null,
      products: lineItems,
      totalAmount,
      date: date || new Date(),
      businessId: req.user.businessId
    });
    
    await transaction.save();
    
    
    await transaction.populate('customerId', 'name');
    await transaction.populate('vendorId', 'name');
    await transaction.populate('products.productId', 'name');
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
