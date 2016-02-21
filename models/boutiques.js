var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var boutiquesSchema = new Schema({
  name: String,
  owners: [{ type : ObjectId, ref: 'Users' }]
});

module.exports = mongoose.model('Boutiques', boutiquesSchema);
