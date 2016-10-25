var express = require("express")
var app = express()
var config = require("./server/config");
app = config.initialize(app);

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
app.get("/workout/:workout/playlist", function(req,res){
  res.render("playlist", {
    "workout": req.params.workout,
    "playlists": ["EDM", "Alt Rock", "Discover Weekly", "Hip Hop", "Trap shit", "Anime Music"]
  })
});
app.get("/workout/:workout/:playlist/ready", function(req,res){
  res.render("ready", {
    "workout": req.params.workout,
    "playlist": req.params.playlist
  });
})

app.listen(3000, function(){
  console.log("Listening on port 3000");
})
