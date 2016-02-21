var mongoose = require('mongoose');

var itemsSchema = new mongoose.Schema({
  name: String,
  type: String
});

module.exports = mongoose.model('Items', itemsSchema);
