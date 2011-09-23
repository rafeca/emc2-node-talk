
/**
 * Module dependencies.
 */

var express = require('express');
var stylus = require('stylus');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/public'
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

// Sockets handler
io.sockets.on('connection', function(socket){
  socket.on('message', function(message, callback){
    var output = {
      clientId: socket.id,
      message: message
    };
    socket.broadcast.emit('message', output);
    
    callback(output);    
  });
});

app.listen(5000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
