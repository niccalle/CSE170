var express = require("express")
var app = express()
var config = require("./server/config");
var mongoose = require('mongoose');
//Sets up the dependencies and routes
app = config.initialize(app);
app.set('port', (process.env.PORT || 5000));
// 
// mongoose.connect('mongodb://127.0.0.1:27017/cse170');
//
// mongoose.connection.on('open', function(){
// 	console.log("Mongoose connected");
// })

app.listen(app.get('port'), function(){
  console.log("Listening on port "+app.get('port'));
})
