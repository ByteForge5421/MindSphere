const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by community and sorting by date
MessageSchema.index({ communityId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
