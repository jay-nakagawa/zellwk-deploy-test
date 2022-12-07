const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const port = process.env.PORT || 3333;


app.use(bodyParser.json())


app.set('view engine', 'ejs') //setting view engine to ejs tells express that we are using ejs as the template engine.
app.use(express.static('public'))


console.log('server is RUNNING')





MongoClient.connect('mongodb+srv://jaynakagawa777:mongod123@cluster0.t6yfhjw.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {

    console.log('Connected to Database')

    const db = client.db('stoic-quotes')
    const quotesCollection = db.collection('quotes')

    app.use(bodyParser.urlencoded({ extended: true }))


    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
          console.log(result)
        })
        .catch(error => console.error(error))
    })

    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          console.log(results)
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))

      // res.sendFile(__dirname + '/index.html')
    })

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.json('Success')
       })
      .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vader's quote`)
      })
      .catch(error => console.error(error))
  })


    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })

  })
  .catch(console.error)






