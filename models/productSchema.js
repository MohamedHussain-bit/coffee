const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true , 'title product required'],
        minLength : [5 , 'too short title product'],
        maxLength : [20 , 'too long title product'],
    },
    slug : {
        type : String,
        lowercase : true,
    },
    description : {
        type : String,
        required : true,
        minLength : [20 , 'to short descripton in this product']
    },
    quantity : {
        type : Number,
        required : true,
        default : 0
    },
    sold : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : true,
        max : [100000 , 'too long price']
    },
    size : {
        type : String,
        required : true,
    },
    priceAfterDiscount : {
        type : Number,
    },
    imageCover : {
        type : String,
    },
    images : [String],
    category : {
        type : mongoose.Schema.ObjectId,
        ref : 'Category',
        required : [true , 'product must be belong to category']
    },
    ratingsAverage : {
        type : Number,
        min : [1 , 'Rating average must be above or equale 1.0'], 
        max : [5 , 'Rating average must be below or equale 5.0'] 
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    }
} , {timestamps : true});

// Populate category name
productSchema.pre(/^find/ , function(next){
    this.populate({path : 'category' , select : 'name -_id'});
});

// Return image url in responce
productSchema.post('init' , (document) => {
    if(document.imageCover){
        const imageCoverURL = `${process.env.BASE_URL}/products/${document.imageCover}`;
        document.imageCover = imageCoverURL;
    };
});

productSchema.post('save' , (document) => {
    if(document.imageCover){
        const imageCoverURL = `${process.env.BASE_URL}/products/${document.imageCover}`;
        document.imageCover = imageCoverURL;
    };
});


module.exports = mongoose.model('Product' , productSchema);