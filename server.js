// Babel ES6/JSX Compiler
require('babel/register');


var config = require('./config');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var express = require('express');
var jwt = require('express-jwt');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var _ = require('underscore');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var mongoose = require('mongoose');
var Items = require('./models/items');
var Boutiques = require('./models/boutiques');
var BoutiqueItems = require('./models/boutiqueItems');
var Users = require('./models/users');

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

var app = express();

var jwtCheck = jwt({
  secret: new Buffer('lP6ZNzFUapPVsw_p6yCNXm4f_pWyI3R_alQDU9bfEyaTLjFfbuE3jpaQYLlecymA', 'base64'),
  audience: 'YooGnW8Z4qWUXxz98N4X1AA6B8BNO18n'
});

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//break these out to controllers

/**
* GET /api/items/count
* Returns the total number of items.
*/
app.get('/api/items/count', function(req, res, next) {
  Items.count({}, function(err, count) {
    if (err) return next(err);
    res.send({ count: count });
  });
});

/**
* GET /api/items/search
* Looks up a item by name. (case-insensitive)
*/
app.get('/api/items/search', function(req, res, next) {
  var itemName = new RegExp(req.query.name, 'i');

  Items.findOne({ name: itemName }, function(err, item) {
    if (err) return next(err);

    if (!item) {
      return res.status(404).send({ message: 'Item not found.' });
    }

    res.send(item);
  });
});

app.get('/api/items/:id', function(req, res, next) {
  var id = req.params.id;

  Items.findOne({'_id':id }, function(err, item) {
    if (err) return next(err);

    if (!item) {
      return res.status(404).send({ message: 'Item not found.' });
    }

    res.send(item);
  });
});

//or

// /api/Boutique/My

// /apy/Boutique/132134


app.use('/api/Boutiques/My', jwtCheck);
app.get('/api/Boutiques/My', function(req, res, next) {
  //get the req.user.sub
});

app.use('/api/Boutiques/My/items/:id', jwtCheck);
app.get('/api/Boutiques/My/items/:id', function(req, res, next) {
  //TODO no doubt that this can be done better with less db
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
                            return item.boutiqueId.id === boutique._id.id
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

app.use('/api/Boutiques/My/items', jwtCheck);
app.post('/api/Boutiques/My/items', function(req, res, next) {
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


//since we can have multiple boutiques per user.
app.use('/api/Boutiques/:boutiqueId/items', jwtCheck);
app.post('/api/Boutiques/:boutiqueId/items', function(req, res, next) {
  var id = req.params.id;
  var boutiqueId = req.params.boutiqueId;
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
        if(!_.contains(_.pluck(boutique.owners, 'id'), user._id.id)) {
          res.status(400).send({ message: 'You are not the owner of this boutique'});
        }
        callback(err, boutique);
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

app.use(function(req, res) {
  Router.match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

/**
* Socket.io stuff.
*/
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
