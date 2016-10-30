var express = require("express")
var app = express()
var config = require("./server/config");
app = config.initialize(app);
app.set('port', (process.env.PORT || 5000));
app.get("/", function(req, res){
  res.render("home");
});

app.get("/chooseWorkout", function(req,res){
  res.render("chooseWorkout");
});
app.get("/workoutList", function(req,res){
  res.render("workoutList", {
    "workouts": ["Leg Day", "Chest Day", "Cardio", "Upper Body", "Push Day", "Crossfit", "Cycling"]
  })
});
app.get("/workoutInfo/:workout", function(req,res){
  res.render("workoutInfo", {
    "workout": req.params.workout,
    "workoutInfo": {
      "time": "53 minutes",
      "Bench Press": "3x5 135 lbs, 3 minute rest",
      "Push ups": "20 pushups, 1 minute rest",
      "Chest Flies": "3x8 35 lbs, 2 minute rest",
      "Incline Bench Press": "3x8 95 lbs, 2 minute rest",
      "Crossover Cable Flies": "3x8 50 lbs, 2 minute rest"
    }
  })
})
app.get("/workout/:workout/playlist", function(req,res){
  res.render("playlist", {
    "workout": req.params.workout,
    "playlists": ["EDM", "Alt Rock", "Discover Weekly", "Hip Hop", "Acoustic", "Classical"]
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
app.get("/getSongs/:playlist", function(req,res){
  res.send({songs: ["270890617","210883449"]});
});
app.get("/addWorkout", function(req,res){
  res.render("addWorkout");
})
app.listen(app.get('port'), function(){
  console.log("Listening on port "+app.get('port'));
})
