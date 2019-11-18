const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  email: { type : String, required : true, unique:true }, // unique will not throw a error, but allow mongoose to optimize data
  password: { type : String, required : true}
});

userSchema.plugin(uniqueValidator); // using unique validator package, now we will get a error


module.exports = mongoose.model('User', userSchema);
