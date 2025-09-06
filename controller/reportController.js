
import Product from '../model/Product.js';
import Transaction from '../model/Transaction.js';



export const getInventory =( async (req, res) => {
  try {
    const products = await Product.find({ businessId: req.user.businessId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export const transactionReport = ( async (req, res) => {
  try {
    const { type, from, to, customerId, vendorId } = req.query;
    let filter = { businessId: req.user.businessId };
    
    if (type) {
      filter.type = type;
    }
    
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    
    if (customerId) {
      filter.customerId = customerId;
    }
    
    if (vendorId) {
      filter.vendorId = vendorId;
    }
    
    const transactions = await Transaction.find(filter)
      .populate('customerId', 'name')
      .populate('vendorId', 'name')
      .populate('products.productId', 'name')
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

