var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true }
});

module.exports = mongoose.model('Users', usersSchema);
