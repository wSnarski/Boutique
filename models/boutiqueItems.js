var mongoose = require('mongoose');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var boutiqueItemsSchema = new Schema({
  boutiqueId: { type : ObjectId, ref: 'Boutiques' },
  itemId: { type: ObjectId, ref: 'Items'}
});

module.exports = mongoose.model('BoutiqueItems', boutiqueItemsSchema);
