var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  authId: String
});

module.exports = mongoose.model('Users', usersSchema);
