const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    passwordChangedAt : Date,
    passwordResetOtp : String,
    resetOtpExpires : Date,
    passwordResetOtpVerified : Boolean,
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

userSchema.pre('save' , async function(){
    if(! this.isModified('password')) return true;
    this.password = await bcrypt.hash(this.password , 10);
});

module.exports = mongoose.model('User' , userSchema);