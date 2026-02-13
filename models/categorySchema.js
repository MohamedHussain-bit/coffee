const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'name category must be required'],
        unique : [true , 'name category must be unique'],
        minlenght : [5 , 'too short category name'],
        maxLength : [20 , 'too long category name'],
    },
    slug : {
        type : String,
        lowercase : true,
    },
    image : String,
} , {timestamps : true});

module.exports = mongoose.model('Category' , CategorySchema);