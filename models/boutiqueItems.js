var mongoose = require('mongoose');

var boutiqueItemsSchema = new mongoose.Schema({
  boutiqueItemId: { type: String, unique: true, index: true }
  boutiqueId: { type : ObjectId, ref: 'Boutiques' },
  itemId: { type: ObjectId, ref: 'Clothes'}
});

module.exports = mongoose.model('Boutiques', boutiquesSchema);
