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

  //This route is pretty unecessary...
  //probably only need a api/Boutiques/:bid/items/:iid
  //or at least have both and reuse the more generic one
  app.use('/api/Users/Me/Boutiques/items/:id', jwtCheck);
  app.get('/api/Users/Me/Boutiques/items/:id', function(req, res, next) {
    //TODO no doubt that this can be done better with less db calls
    var id = req.params.id;
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
          itemId: id
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

    //even more unecessary...
    app.use('/api/Users/Me/Boutiques/items', jwtCheck);
    app.post('/api/Users/Me/Boutiques/items', function(req, res, next) {
      //TODO no doubt that this can be done better with less db calls
      var user;
      async.waterfall([
        function(callback) {
          Users.findOne({authId: req.user.sub}, function(err, user) {
            if(err) return next(err);
            //TODO create users in one place
            if (!user) {
              var dbUser = new Users({
                //TODO check if sub changes prefix
                //based on source fb,auth0..etc.
                //but for same users
                authId: req.user.sub
              });
              dbUser.save(function(err, user){
                if(err) return next(err);
                callback(err, user);
              });
            }
            else {
              callback(err, user);
            }
          });
        },
        function(user, callback) {
          Boutiques.find({owners: user.id}, function(err, boutiques){
            if (err) return next(err);
            if(boutiques.length === 0) {
              var boutique = new Boutiques({
                name: 'My Closet',
                owners: [user.id]
              });
              boutique.save(function(err, boutique){
                if(err) return next(err);
                callback(err, boutique);
              });
            }
            else if (boutiques > 1) {
              res.status(400).send({
                message: 'There are more than one boutiques for this user'
              });
            }
            else {
              callback(err, boutiques[0]);
            }
          });
        },
        function(boutique, callback) {
          var boutiqueItem = new BoutiqueItems({
            boutiqueId: boutique.id,
            itemId: req.body.itemId
          });
          boutiqueItem.save(function(err, boutiqueItem){
            if (err) return next(err);
            res.send({ message: 'Item added succesfully'});
          });
        }
        ]);
      });

}
