var async = require('async');
var _ = require('underscore');

module.exports = function(app, Users, Boutiques, BoutiqueItems, Items, jwtCheck) {
  /*
  Endpoint that returns all the current users boutiques and items within those boutiques

  return object is heavily nested at this moment, belief is that it is incomplete without all subparts
  maybe a Boutiques/:id (vs Me/Boutiques) endpoint will not return all item info
  influenced by http://programmers.stackexchange.com/questions/245987/nested-objects-in-rest

  TODO finalize structure of object returned
  TODO no doubt that this can be done better with less db calls
  TODO not found object should be expressed with a stock n/a object instead of the
  string "no item found"
  */
  app.use('/api/Users/Me/Boutiques', jwtCheck);
  app.get('/api/Users/Me/Boutiques' , function(req, res, next) {
    async.waterfall([
      function(callback) {
        Users.findOne({authId: req.user.sub}, function(err, user) {
          if(err) return next(err);
          if(!user) res.send([]);
          callback(err, user);
        })
      },
      function(user, callback) {
        Boutiques.find({owners: user}, function(err, boutiques){
          if (err) return next(err);
          if(!boutiques) res.send([]);
          callback(err, boutiques);
        });
      },
      function(boutiques, callback) {
        var fullBoutiques = [];
        async.each(boutiques, function(boutique, callback) {
          //use of .lean() because of performance (maybe) but mostly because
          //i want to add properties to the object returned and we wont be saving
          //these back to the db.
          //based on http://ilee.co.uk/mongoose-documents-and-jsonstringify/
          BoutiqueItems.find({boutiqueId: boutique.id }).lean().exec(
            function(err, boutiqueItems){
            fullBoutiques.push({
              info: boutique,
              items: boutiqueItems
            });
            callback();
          });
        }, function(err){
          if(err) return next(err);
          callback(err, fullBoutiques);
        });
      },
      function(fullBoutiques, callback) {
        var itemSet = new Set();
        _.each(fullBoutiques, function(b) {
          _.each(b.items, function(i) {
            let itemId = i.itemId.toString();
            if(!itemSet.has(itemId)) {
              itemSet.add(itemId);
            }
          });
        });
        var itemDetailMap = new Map();
        Items.find({'_id': { $in: Array.from(itemSet) }}).lean().exec(function(err, items) {
          _.each(items, function(item){
            itemDetailMap.set(item._id.toString(), item);
          });
          _.each(fullBoutiques, function(b) {
            _.each(b.items, function(i) {
              let itemId = i.itemId.toString();
              if(itemDetailMap.has(itemId)) {
                i.detail = itemDetailMap.get(itemId);
              } else {
                i.detail = "no item found";
              }
            });
          });
          res.send(fullBoutiques);
        });
      }
    ]);
  });
  //TODO make query params functionality more robust
  app.use('/api/Users/Me/Boutiques/BoutiqueItems', jwtCheck);
  app.get('/api/Users/Me/Boutiques/BoutiqueItems', function(req, res, next) {
    //TODO no doubt that this can be done better with less db calls
    async.waterfall([
      function(callback) {
        Users.findOne({authId: req.user.sub}, function(err, user) {
          if(err) return next(err);
          if(!user) res.send([]);
          callback(err, user);
        });
      },
      function(user, callback) {
        Boutiques.find({owners: user}, function(err, boutiques){
          if (err) return next(err);
          if(!boutiques) res.send([]);
          callback(err, boutiques);
        });
      },
      function(boutiques, callback) {
        BoutiqueItems.find({
          boutiqueId: { $in: _.pluck(boutiques, 'id') },
          itemId: req.query.itemId
        }, function(err, boutiqueItems){
          if (err) return next(err);
          var bitems = _.map(boutiques, function(boutique){
            return {
              id: boutique.id,
              name: boutique.name,
              items: _.map(_.filter(boutiqueItems, function(item) {
                return item.boutiqueId.toString() === boutique.id.toString()
              }),
              function(filteredItem){
                return {
                  id: filteredItem.id,
                  boutiqueId: filteredItem.boutiqueId,
                  itemId: filteredItem.itemId
                }
              })
            }
          });
          res.send(bitems);
        });
      }
      ]);
    });
}
