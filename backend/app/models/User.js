'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userName:{
    type: String,
    required: true,
    unique: true,
    default: ''
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: Number,
    default: '',
    minlength: 10,
    maxlength: 10,
    required: true
  },
  countryCode: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: 'false'
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('User', userSchema);