const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');


router.get('/:sessionId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    
    if (!cart) {
      cart = new Cart({
        sessionId: req.params.sessionId,
        items: [],
        total: 0
      });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:sessionId/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ sessionId: req.params.sessionId });
    
    if (!cart) {
      cart = new Cart({
        sessionId: req.params.sessionId,
        items: [],
        total: 0
      });
    }
    

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      
      cart.items[existingItemIndex].quantity += quantity;
    } else {
     
      cart.items.push({
        productId: productId,
        quantity: quantity,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
    
    
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:sessionId/remove/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;