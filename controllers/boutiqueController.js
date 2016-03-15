var async = require('async');
var _ = require('underscore');

module.exports = function(app, Users, Boutiques, BoutiqueItems, jwtCheck) {

      app.get('/api/Boutiques/:id', function(req, res, next) {
        //TODO no doubt that this can be done better with less db calls
        var boutiqueId = req.params.id;
        async.waterfall([
          function(callback) {
            Boutiques.findOne(boutiqueId, function(err, boutique) {
              if (err) return next(err);
              if (!boutique) res.status(400).send({ message: 'No boutique found' });
              callback(err, boutique);
            });
          },
          function(boutique, callback) {
            BoutiqueItems.find({boutiqueId: boutique.id}, function(err, items){
              if (err) return next(err);
              var fullBoutique = {
                info: boutique,
                items: items
              };
              res.send(fullBoutique);
              //TODO we probably want more item info here
            });
          }
          ]);
        });

        app.use('/api/Boutiques/:id/items', jwtCheck);
        app.post('/api/Boutiques/:id/items', function(req, res, next) {
          var boutiqueId = req.params.id;
          async.waterfall([
            function(callback) {
              Users.findOne({authId: req.user.sub}, function(err, user) {
                if(err) return next(err);
                //TODO create users in one place
                if (!user) res.status(400).send({ message: 'No user found' });
                callback(err, user);
              });
            },
            function(user, callback) {
              Boutiques.findOne(boutiqueId, function(err, boutique){
                if (err) return next(err);
                if(!boutique) {
                  res.status(400).send({ message: 'No boutique found '});
                }
                if(!_.contains(_.pluck(boutique.owners, 'id'), user.id.toString())) {
                  res.status(400).send({ message: 'You are not the owner of this boutique'});
                }
                callback(err, boutique);
              });
            },
            function(boutique, callback) {
              console.log(req);
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
