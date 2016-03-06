// Babel ES6/JSX Compiler
require('babel/register');


var config = require('./config');
var request = require('request');
var xml2js = require('xml2js');
var express = require('express');
var jwt = require('express-jwt');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

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

//routes
require('./controllers/itemController')(app, Items);
require('./controllers/boutiqueController')(app, Users, Boutiques, BoutiqueItems, jwtCheck);
require('./controllers/userBoutiqueController')(app, Users, Boutiques, BoutiqueItems, jwtCheck);

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
