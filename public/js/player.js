/*
  First, the widget is loaded. The listener is binded to the play button
  which will make the timer go down. Also, all the songs are loaded.
  When the timer hits 0, the interval is stopped and the next song is loaded.
*/
$(document).ready(function(){

  var widgetIframe = document.getElementById('sc-widget'),
      widget       = SC.Widget(widgetIframe);
  var seconds = 0; //The seconds for the timer
  var playlist;  //Object that holds the tracks, name, and ID
  var songNum = 0; //Which song number we're on right now
  var startTimer; //Returned value for setInterval, use it to start and stop the timer
  var workout; //Object that holds the information for the workout we're completing
  var currExercise; //Object for the current exercise
  var workoutLength; //How many exercises the workout is long
  var workoutNum = 0;
  var set = 1;
  var factor = 1;
  var playing = false;
  var paused = false;
  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
  var completedWorkout = {
    "name": "",
    "id": "",
    "workoutInfo":{
      "image": "",
      "exercises": [],
      "timeCompleted":0
    }
  };

  $(document).keydown(function(e) {

    kkeys.push( e.keyCode );
    if ( kkeys.toString().indexOf( konami ) >= 0 ) {

      $(document).unbind('keydown',arguments.callee);

      // do something awesome
      factor = 10;
      seconds /= factor;
      $(".navbar").css("background-color", "yellow");

    }

  });

  /*Get data from the API for this workout and playlist*/
  $.get("/getWorkout/"+$("#workout").text(), function(data){
    workout = data['workout'];
    initializeCompletedWorkout();

    $.get("/getPlaylist/"+$("#playlist").text(), function(data2){
      playlist = data2['songs'];
      /*Load the song once everything has been retrieved from the API*/
      workout.workoutInfo.exercises.length;
      currExercise = workout.workoutInfo.exercises[workoutNum];

      /*Add the current exercise and initialize the sets to be 0*/
      addWorkout();
      loadSong(playlist.tracks[0]);
    });
  });
  /*When we click on the clock, play the soundcloud song*/
  function canvasListener(){
    $(".canvas").click(function(){
      //Either start a new song or continue playing
      console.log("Clicked");
      if(!playing){
        //When we have to load a song
        if(seconds == 0){
          seconds = parseInt(currExercise.rest)/factor;
          paused = false;
        }
        $("#mycanvas").remove();
        $("<canvas id=\"mycanvas\" width=\"345\" height=\"345\"></canvas>").appendTo(".canvas");
        if(playlist.name == "None"){
          drawCanvas(seconds, true);
          startTimer =  setInterval(updateSeconds, 1000);
          var speech = "Begin set " + set + " of " + currExercise.name + " at "
            + currExercise.weight + "pounds for " + currExercise.reps + "reps";
          if(!paused)
            responsiveVoice.speak(speech, "UK English Male");
        }
        else{
          widget.play();
        }

        playing = true;
      }
      else{
        $("#mycanvas").remove();
        $("<span class=\"glyphicon glyphicon-play\" id=\"mycanvas\"></span>").appendTo(".canvas");
        clearInterval(startTimer);
        widget.pause();
        playing = false;
        paused = true;
      }

    });
  }
  canvasListener();
  /*Updates the clock and if the seconds hits 0, load the next song*/
  function updateSeconds(){
    seconds--;
    // $("#timer").text(seconds);
    if(seconds == 0){
      clearInterval(startTimer);
      songNum++;
      set++;
      /*Increment the sets completed*/
      completedWorkout.workoutInfo.exercises[workoutNum].sets += 1
      /*If we should move onto the next exercise*/
      if(set > parseInt(currExercise.sets)){
        set = 1;
        workoutNum++;
        if(workoutNum == workoutLength){
          return endWorkout();
        }
        currExercise = workout.workoutInfo.exercises[workoutNum];
        addWorkout();
      }
      console.log(completedWorkout);
      saveProgress();
      if(playlist.name != "None")
        loadSong(playlist.tracks[songNum%playlist.tracks.length]);
    }
  }

  function endWorkout(){
    $("#mycanvas").remove();
    $("<h1>Congratulations!</h1>").appendTo(".canvas");
  }
  function updateText(){
    $("#exercise").text(currExercise.name);
    $("#song-name").text(playlist.tracks[songNum%playlist.tracks.length].name);
    $("#set-number").text(set);
    $("#rep-number").text(currExercise.reps);
    $("#weight-number").text(currExercise.weight);

  }
  /*Loads our invisible widget with the next track*/
  function loadSong(track){
    //seconds = parseInt(currExercise.rest)/factor;
    updateText();
    $("#mycanvas").remove();
    $("<span class=\"glyphicon glyphicon-play\" id=\"mycanvas\"></span>").appendTo(".canvas");
    widget.load("https://api.soundcloud.com/tracks/"+track.id);
    playing = false;
  }
  /*Make a unique ID for today's workout*/
  function makeid()
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  /*
    PREREQUISITE: This function is called after currExercise has been updated
  */
  function addWorkout(){
    var n = {
      "name": currExercise.name,
      "weight": currExercise.weight,
      "sets": 0,
      "reps": currExercise.reps,
      "rest": currExercise.rest
    }
    completedWorkout.workoutInfo.exercises.push(n);
  }
  /*Initialize our completed workout with a random id and other fields*/
  function initializeCompletedWorkout(){
    var date = new Date();
    completedWorkout.name = workout.name;
    completedWorkout.id = makeid();
    completedWorkout.workoutInfo.image = workout.workoutInfo.image;
    completedWorkout.workoutInfo.timeCompleted = date.toDateString();
  }

  function saveProgress(){
    $.post("/saveProgress", {"data": JSON.stringify(completedWorkout)},
            function(){
              console.log("Saved progress");
            })
  }

  widget.bind(SC.Widget.Events.READY, function() {
    // drawCanvas(20, false);
    console.log("READY!");
    widget.bind(SC.Widget.Events.PLAY, function(){
      // $("#mycanvas").remove();
      // $("<canvas id=\"mycanvas\" width=\"345\" height=\"345\"></canvas>").appendTo(".canvas");
      //canvasListener();
      drawCanvas(seconds, true);
      startTimer =  setInterval(updateSeconds, 1000);
      var speech = "Begin set " + set + " of " + currExercise.name + " at "
        + currExercise.weight + "pounds for " + currExercise.reps + "reps";
      if(!paused)
        responsiveVoice.speak(speech, "UK English Male");

    });
  });

});
