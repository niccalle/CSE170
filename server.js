var express = require("express")
var app = express()
var config = require("./server/config");
//Sets up the dependencies and routes
app = config.initialize(app);
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function(){
  console.log("Listening on port "+app.get('port'));
})
