const mongoose = require('mongoose');

const { Schema } = mongoose;

const requestSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skillRequested: {
      type: String,
      required: true,
      trim: true
    },
    skillOfferedInReturn: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);

