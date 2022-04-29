#!/usr/bin/env node

const path    = require('path');
const express = require('express');
const session = require('express-session');
const dao     = require('./dao.js'); 
const { Console } = require('console');

const app  = express();
const port = process.env.PORT || process.argv[2] || 3000;

// Use the session middleware
app.enable('trust proxy');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  proxy: true,
  cookie: { secure: false }
}));

// Use middleware to parse request body as JSON.
// bodyParser is deprecated and now merged into express itself.
app.use(express.json());

// Use middleware to serve static files from the public directory.
app.use(express.static(path.join(__dirname, 'dist/projE')));

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Log connections
app.use((req, res, next) => {
  console.log(`From ${req.ip}, Request ${req.url}`);
  next();
});

// Configure routes

app.get('/api/Catalog', function (req, res) { 
  res.setHeader('Content-Type', 'application/json');
  if(!req.query.id){
      dao.getAllCatalog(function (rows) {
          res.write(JSON.stringify(rows));
          res.end();
        });

  }
  else{
      let id = req.query.id;
      dao.getCatalog(id, function (rows) {
          res.write(JSON.stringify(rows));
          res.end();
        });
  }
});

app.post('/api/cart/checkout', function (req, res) { 
  res.setHeader('Content-Type', 'application/json');
  req.session.cart = req.session.cart || [];
  console.log(JSON.stringify(req.session.cart));
  console.log(JSON.stringify(req.body));
  req.session.cart  = [];
  res.end();
});

app.get('/api/products/category/:id', function (req, res) { 
    id = req.params.id;
    dao.getCategory(id, function (rows) {
        let response;
        if (rows.length >= 1) {
          response = rows;
        } else {
          response = new Error('Product not found');
        }
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(response));
        res.end();
      });
});

app.get('/api/products/:id', function (req, res) { 
    id = req.params.id;
    dao.getProduct(id, function (rows) {
        let response;
        if (rows.length == 1) {
          response = rows;
        } else {
          response = new Error('Product not found');
        }
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(response));
        res.end();
      });
});



app.get('/api/cart', function (req, res) { 

    res.setHeader('Content-Type', 'application/json');
    if(!req.session.cart){
      req.session.cart = [];
    }
    else{
      req.session.cart = req.session.cart;
    }
    
    res.write(JSON.stringify(req.session.cart));
    res.end();
});


app.post('/api/cart/update', function (req, res) { 

  res.setHeader('Content-Type', 'application/json');
  if(!req.session.cart){
    req.session.cart = [];
  }
  else{
    req.session.cart = req.session.cart;
  }
  const itm = req.body;
  idx = req.session.cart.findIndex( (element) => element.id === itm.id);
  if(idx < 0){
    //Not in cart
    if(itm.qty > 0){
      req.session.cart.push(itm);
    }
  }
  else{
    //In cart
    if(itm.qty > 0){
      req.session.cart[idx].qty = itm.qty;
    }
    else{
      req.session.cart.splice(idx,1);
    }
  }
  res.write(JSON.stringify(req.session.cart));
  res.end();
});


const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`server listening to ${host}:${port}`);
});