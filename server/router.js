var fs = require('fs');
//Open up our fake database
var json = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));
var helper = require('../helpers/dataHelper');

module.exports = function(app){

  //Login page
  app.get("/", function(req, res){
    res.render("home");
  });

  //Render the workout page
  app.get("/chooseWorkout", function(req,res){
    res.render("chooseWorkout");
  });

  //Render the workout list
  app.get("/workoutList", function(req,res){
    //Retrieve just the names of the workouts using helper
    res.render("workoutList", {
      "workouts": helper.getNames(json.workouts)
    })
  });

  //Render the workoutInfo page
  app.get("/workoutInfo/:workout", function(req,res){
    //Function to match object with workout name
    var findFunc = helper.findHelper(req.params.workout);
    res.render("workoutInfo", json.workouts.find(findFunc));
  })
  app.get("/workout/:workout/playlist", function(req,res){
    res.render("playlist", {
      "workout": req.params.workout,
      "playlists": helper.getNames(json.playlists) //Get the names of the playlists
    })
  });
  app.get("/workout/:workout/:playlist/ready", function(req,res){
    res.render("ready", {
      "workout": req.params.workout,
      "playlist": req.params.playlist
    });
  })
  app.get("/workout/:workout/:playlist/begin", function(req,res){
    res.render("begin", {
      "workout": req.params.workout,
      "playlist": req.params.playlist
    });
  })
  //Returns a JSON object of the playlist
  app.get("/getSongs/:playlist", function(req,res){
    //Function to match object with the playlist name
    var findFunc = helper.findHelper(req.params.playlist);
    res.send({songs: json.playlists.find(findFunc)});
  });
  app.get("/addWorkout", function(req,res){
    res.render("addWorkout");
  });
}
