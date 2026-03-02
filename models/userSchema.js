const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true , 'user name required'],
    },
    slug : {
        type : String,
        lowercase : true,
    },
    email : {
        type : String,
        required : [true , 'user emai required'],
        unique : [true , 'user email must be unique'],
        lowercase : true,
    },
    password : {
        type : String,
        required : [true , 'user password required'],
        minLength : [6 , 'too short user passeord'],
    },
    phone : String,
    profileImage : String,
    role : {
        type : String,
        enum : ['user' , 'admin'],
        default : 'user',
    },
    active : {
        type : Boolean,
        default : true,
    },
});

module.exports = mongoose.model('User' , userSchema);