// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

console.log(__dirname)

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the Client directory
app.use(express.static(path.join(__dirname, '../Client')));

// ✅ Debugging: Check if MONGO_URI is loaded
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));


// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Public/about.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Public/products.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Public/cart.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Public/order.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/Public/about.html'));
});



// 📌 Define Order Schema + Model inline
const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [
    {
      productId: Number,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

/**
 * 📌 Place Order Route
 * POST /api/orders
 */
app.post("/order-confirm", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer details and items are required" });
    }

    const order = new Order({
      customer,
      items,
      total
    });

    const savedOrder = await order.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });

  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// 📌 Get all orders
// Get Orders for a Specific Customer
app.get("/get-orders", async (req, res) => {
  try {
    const customerName = req.query.name;
    if (!customerName) return res.status(400).json({ message: "Customer name is required" });

    const orders = await Order.find({ "customer.name": customerName }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
