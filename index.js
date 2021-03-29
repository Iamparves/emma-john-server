const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = 5000;
app.use(cors())
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0pmd.mongodb.net/emmaJohn?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('<h1>This is the server homepage</h1>');
});


client.connect(err => {
    const products = client.db("emmaJohn").collection("products");
    const orders = client.db("emmaJohn").collection("orders");

    // Add single product in the database
    app.post('/addProduct', (req, res) => {
        const productData = req.body;

        products.insertOne(productData)
            .then(result => {
                res.send(result.insertedCount > 0)
            });
    });

    // Get all products from the database
    app.get('/products', (req, res) => {
        products.find({})
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    // Get single product by key
    app.get('/product/:key', (req, res) => {
        const key = req.params.key;
        products.find({ key })
            .toArray((error, documents) => {
                res.send(documents[0]);
            });
    });

    // Get multiple product by keys
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({ key: { $in: productKeys } })
            .toArray((error, documents) => {
                res.send(documents);
            });
    });

    // Add order
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orders.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });

    // Get all orders
    app.get('/orders', (req, res) => {
        orders.find({})
            .toArray((error, documents) => {
                res.send(documents);
            });
    });

    console.log('database connected');
});


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});