const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Meeting = new Schema({
  meetingId: {
    type: String,
    unique: true,
    required: true,
    index: true,
    default: ''
  },
  title: {
    type: String,
    required: true,
    default: ''
  },
  inviter: {
    type: String,
    required: true,
    default: ''
  },
  invitee: {
    type: String,
    required: true,
    default: ''
  },
  purpose: {
    type: String,
    required: true,
    default: '',
  },
  start: {
    type: Date,
    required: true,
    default: ''
  },
  end: {
    type: Date,
    required: true,
    default: ''
  },
  location: {
    type: String,
    required: true,
    default: ''
  },
  inviterEmail: {
    type: String,
    required: true,
    default: ''
  },
  inviteeEmail: {
    type: String,
    required: true,
    default: ''
  },
  createdOn: {
    type: Date,
    default: ''
  }
});

module.exports = mongoose.model('Meeting', Meeting);