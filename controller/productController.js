import { validationResult } from 'express-validator';
import Product from '../model/Product.js';


export const getProducts = (async (req, res) => {
  try {
    const { q, category } = req.query;
    let filter = { businessId: req.user.businessId };
    
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    
    if (category) {
      filter.category = category;
    }
    
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export const createProduct=(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product({
      ...req.body,
      businessId: req.user.businessId
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export const updateProduct=(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export const deleteProduct=(async (req, res) => {
try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      businessId: req.user.businessId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

