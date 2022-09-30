const mongoose = require('mongoose');

const discordUserSchema = new mongoose.Schema({

  discordId: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  username: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  }
});

module.exports = mongoose.model('discordUsers', discordUserSchema);
