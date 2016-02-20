var mongoose = require('mongoose');

var itemsSchema = new mongoose.Schema({
  itemId: { type: String, unique: true, index: true },
  name: String,
  type: String
});

module.exports = mongoose.model('Items', itemsSchema);
