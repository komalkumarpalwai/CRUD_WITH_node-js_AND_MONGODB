require('dotenv').config();
const express = require('express');
const connectDB = require('./connection/db');
const Product = require('./models/product.model');
const path = require('path');

// Connect to the database
connectDB();

const app = express();

// Use the PORT from the .env file or default to 3000
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Homepage Route
app.get('/', async (req, res) => {
  try {
    // Fetch first 8 products from the database
    const products = await Product.find().limit(8);
    res.render('homepage', { products });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
app.post('/products', async (req, res) => {
    try {
      const productData = req.body; // Assuming request body contains product data
      const product = new Product(productData);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Internal Server Error');
    }
  });
// Route to fetch all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      // If there are no products in the database, render a message indicating so
      res.render('no-products');
    } else {
      // If there are products in the database, render the products page with the fetched products
      res.render('products', { products });
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Admin Panel Route
app.get('/admin', (req, res) => {
  res.render('admin');
});

// Route to delete a product by ID
// Route to delete a product by ID
app.post('/admin/delete-product', async (req, res) => {
    try {
      const { productId } = req.body;
      console.log('Deleting product with ID:', productId); // Log the product ID being deleted
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        console.log('Product not found'); // Log if product not found
        return res.status(404).send('Product not found');
      }
      console.log('Product deleted successfully:', deletedProduct); // Log the deleted product
      res.redirect('/admin'); // Redirect to the admin panel after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Route to delete all products
app.post('/admin/delete-all-products', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.redirect('/admin'); // Redirect to the admin panel after deletion
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
