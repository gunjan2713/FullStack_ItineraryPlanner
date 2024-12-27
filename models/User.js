const mongoose = require('mongoose');
const validator = require('validator')

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Please enter the valid Email'] },
  // photo: {type:String},
  password: { type: String, required: true },
});

// UserSchema.pre('save',function(next) {
//   if(!this.isModified('password')) return next();

  // encryp the password before saving it

// })
module.exports = mongoose.model('User', UserSchema);