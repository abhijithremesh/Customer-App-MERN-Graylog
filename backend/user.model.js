const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({ 
    firstname:{
        type:String
    },
    surname:{
        type:String
    },
    street:{
        type:String
    },
    streetnum:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    }
})

module.exports = mongoose.model('User',User)