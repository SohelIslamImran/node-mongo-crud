const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const uri = "mongodb+srv://skSohel:4.TXcPvbEvJn4@A@database.1n8y8.mongodb.net/Database?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
  const collection = client.db("Database").collection("Products");

  app.get('/products', (req, res) => {
    collection.find({})
      .toArray((err, docs) => {
        res.send(docs)
      })
  })

  app.get('/product/:id', (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, docs) => {
        res.send(docs[0])
      })
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    collection.insertOne(product)
      .then(result => {
        console.log('one product added');
        res.redirect('/')
      })
  })

  app.patch('/update/:id', (req, res) => {
    collection.updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: { price: req.body.price, quantity: req.body.quantity }
      }
    ).then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

});


app.listen(3000);