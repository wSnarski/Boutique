var mongoose = require('mongoose');

var boutiquesSchema = new mongoose.Schema({
  boutiqueId: { type: String, unique: true, index: true }
  owners: [{ type : ObjectId, ref: 'Users' }],
});

module.exports = mongoose.model('Boutiques', boutiquesSchema);
