const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 5000
const userRoutes = express.Router();

const graylog2 = require('graylog2');
const logger = new graylog2.graylog({
    servers: [{ 'host': '127.0.0.1', port: 5000 }]
  });


let User = require('./user.model')

app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/customers', {useNewUrlParser: true})
const connection =mongoose.connection


connection.once('open',function(){
    console.log('MongoDB database connection established successfully')
}) 

userRoutes.route('/').get(function(req,res){
    // logger.log("Fetching the list of all customers");
     User.find(function(err,users){
         if (err) {
             console.log(err)
         } else {
             res.json(users)
         }
     })
})

userRoutes.route('/:id').get(function(req,res){
    
    let id = req.params.id;
    User.findById(id, function(err,user){
        res.json(user)
        logger.log("Fetching a particular customer: "+user.firstname);
    })
    
})

userRoutes.route('/add').post(function(req,res){
    let user = new User(req.body)
    
    user.save()
        .then(user => {
            res.status(200).json({'user': 'user information registered successfully'})
        })
        .catch(err => {
            res.status(400).send('registering new user failed  ')
        })
        logger.log("Customer info created for "+user.firstname);
})


userRoutes.route('/update/:id').post(function(req,res){
    logger.log("Editing Customer Info");
    User.findById(req.params.id, function(err,user){
        if (!user)
            res.status(404).send('customer is not found')
        else
            user.firstname = req.body.firstname;
            user.surname = req.body.surname;
            user.street = req.body.street;
            user.streetnum = req.body.streetnum;
            user.city = req.body.city;
            user.country = req.body.country;

            user.save().then(user => {
                res.json('User info updated')
            })
            .catch(err => {
                 res.status(400).send("Update not possible")
            });

            logger.log("Customer info updated for "+user.firstname);

    });
}); 

app.use('/users', userRoutes)


app.listen(PORT, function(){
    console.log("Server running on PORT: "+PORT)
})



