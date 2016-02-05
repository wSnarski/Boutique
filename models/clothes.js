var mongoose = require('mongoose');

var clothesSchema = new mongoose.Schema({
  clothesId: { type: String, unique: true, index: true },
  name: String,
  type: String
});

module.exports = mongoose.model('Clothes', clothesSchema);
