const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzyej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const products = client.db(`${process.env.DB_NAME}`).collection("products");
  const orders = client.db(`${process.env.DB_NAME}`).collection("orders");
  // perform actions on the collection object
  console.log("database Connected");

  app.post("/addProducts", (req, res) => {
    const productDetails = req.body;
    console.log(productDetails);
    products.insertMany(productDetails).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });
  app.post("/addOrders", (req, res) => {
    const order = req.body;

    orders.insertOne(order).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/product/:key", (req, res) => {
    products
      .find({ key: req.params.key })

      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
  app.post("/productsByKeys", (req, res) => {
    const productsKeys = req.body;
    products.find({ key: { $in: productsKeys } }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/products", (req, res) => {
    products
      .find({})

      .toArray((err, document) => {
        res.send(document);
      });
  });
});

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(4000);
