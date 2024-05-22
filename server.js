require('dotenv').config();
const express = require('express');
const connectDB = require('./connection/db');
const Product = require('./models/product.model');
const path = require('path');


connectDB();

const app = express();


const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));


app.use(express.static('public'));
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
      const productData = req.body; 
      const product = new Product(productData);
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Internal Server Error');
    }
  });
//  all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      
      res.render('no-products');
    } else {
      
      res.render('products', { products });
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Admin Panel
app.get('/admin', (req, res) => {
  res.render('admin');
});

/
app.post('/admin/delete-product', async (req, res) => {
    try {
      const { productId } = req.body;
      console.log('Deleting product with ID:', productId); // Log the product ID being deleted
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        console.log('Product not found'); 
        return res.status(404).send('Product not found');
      }
      console.log('Product deleted successfully:', deletedProduct); // Log the deleted product
      res.redirect('/admin'); 
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// delete all products
app.post('/admin/delete-all-products', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.redirect('/admin')
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
