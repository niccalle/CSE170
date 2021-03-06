var fs = require('fs');
//Open up our fake database
var json = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));
var helper = require('../helpers/dataHelper');

module.exports = function(app){

  //Login page
  app.get("/", function(req, res){
    res.render("home");
  });

  app.post("/login", function(req,res){
    var login = JSON.parse(req.body.data);
    var found = false;
    for(var i = 0; i < json.accounts.length; i++){
      var account = json.accounts[i];
      if(login.username == account.username
        && login.password == account.password){
          res.send("success");
          found = true;
        }
    }
    if(!found)
      res.send("failure");
  })
  //Render the workout page
  app.get("/chooseWorkout", function(req,res){
    res.render("chooseWorkout");
  });

  //Render the workout list
  app.get("/workoutList", function(req,res){
    //Retrieve just the names of the workouts using helper
    res.render("workoutList", {"workouts": json.workouts});
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
  app.get("/getPlaylist/:playlist", function(req,res){
    //Function to match object with the playlist name
    var findFunc = helper.findHelper(req.params.playlist);
    res.send({songs: json.playlists.find(findFunc)});
  });
  app.get("/getWorkout/:workout", function(req,res){
    var findFunc = helper.findHelper(req.params.workout);
    res.send({workout: json.workouts.find(findFunc)});
  })
  app.get("/addWorkout", function(req,res){
    res.render("addWorkout");
  });
  app.post("/submitWorkout", function(req,res){
    var workout = JSON.parse(req.body.data);
    helper.getImage(workout);
    var found = false;
    for(var i = 0; i < json.workouts.length; i++){
      if(json.workouts[i].name == workout.name){
        json.workouts[i] = workout;
        found = true;
        break;
      }
    }
    if(!found){
      json.workouts.unshift(workout);
    }

    fs.writeFile('./server/data.json', JSON.stringify(json,null,2), 'utf8', function(){res.send("success!");});

  })
  app.post("/saveProgress", function(req,res){
    var progress = JSON.parse(req.body.data);
    var found = false;
    for(var i = 0; i < json.workoutsCompleted.length; i++){
      if(json.workoutsCompleted[i].id == progress.id){
        json.workoutsCompleted[i] = progress;
        found = true;
      }
    }
    if(!found){
      json.workoutsCompleted.push(progress);
    }
    fs.writeFile('./server/data.json', JSON.stringify(json,null,2), 'utf8', function(){res.send("success!");});
  })
  //Render the workout list
  app.get("/workoutCalendar", function(req,res){
    //Retrieve just the names of the workouts using helper
    res.render("workoutCalendar", {"workouts": json.workoutsCompleted});
  });

  app.get("/workoutCalendar2", function(req,res){
    //Retrieve just the names of the workouts using helper
    res.render("workoutCalendar2", {"workouts": json.workoutsCompleted});
  });

  //Edit a workout
  app.get("/editWorkout/:workout", function(req,res){
    var findFunc = helper.findHelper(req.params.workout);
    res.render("editWorkout", json.workouts.find(findFunc));
  })

  app.get("/workoutsCompleted", function(req, res) {
    res.send({"workoutsCompleted": json.workoutsCompleted});
  })
}
