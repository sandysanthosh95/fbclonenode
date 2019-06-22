let mongoose = require('mongoose')
let Schema = mongoose.Schema

var user = new Schema({
    name: { type: String, required: [true, 'Please enter name'] },
    mobileNumber: { type: String, required: [true, 'Please enter mobile number'], unique: true },
    password: { type: String, required: [true, 'Please enter password to Login/Signup '] }
})

module.exports = mongoose.model('users', user)