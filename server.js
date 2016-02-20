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
  console.log(req.user);
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

  Items.findOne({ _id: id }, function(err, item) {
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


app.use('/api/Boutique/My', jwtCheck);
app.get('/api/Boutique/My', function(req, res, next) {
  //get the req.user.sub
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
