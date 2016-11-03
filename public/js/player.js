/*
  First, the widget is loaded. The listener is binded to the play button
  which will make the timer go down. Also, all the songs are loaded.
  When the timer hits 0, the interval is stopped and the next song is loaded.
*/
$(document).ready(function(){

  var widgetIframe = document.getElementById('sc-widget'),
      widget       = SC.Widget(widgetIframe);
  var seconds = 20; //The seconds for the timer
  var playlist;  //Object that holds the tracks, name, and ID
  var songNum = 0; //Which song number we're on right now
  var startTimer; //Returned value for setInterval, use it to start and stop the timer
  var workout; //Object that holds the information for the workout we're completing
  var currExercise; //Object for the current exercise
  var workoutLength; //How many exercises the workout is long
  var workoutNum = 0;
  var set = 1;
  /*Get data from the API for this workout and playlist*/
  $.get("/getWorkout/"+$("#workout").text(), function(data){
    workout = data['workout'];

    $.get("/getPlaylist/"+$("#playlist").text(), function(data2){
      playlist = data2['songs'];
      /*Load the song once everything has been retrieved from the API*/
      workoutLength = workout.workoutInfo.exercises.length;
      currExercise = workout.workoutInfo.exercises[workoutNum];
      loadSong(playlist.tracks[0]);
    });
  });
  /*When we click on the clock, play the soundcloud song*/
  function canvasListener(){
    $("#mycanvas").click(function(){
      $("#mycanvas").remove();
      $("<canvas id=\"mycanvas\" width=\"345\" height=\"345\"></canvas>").appendTo(".canvas");
      widget.play();
    });
  }
  canvasListener();
  /*Updates the clock and if the seconds hits 0, load the next song*/
  function updateSeconds(){
    seconds--;
    // $("#timer").text(seconds);
    if(seconds == 0){
      songNum++;
      set++;
      /*If we should move onto the next exercise*/
      if(set > parseInt(currExercise.sets)){
        set = 1;
        workoutNum++;
        currExercise = workout.workoutInfo.exercises[workoutNum];
      }
      clearInterval(startTimer);
      loadSong(playlist.tracks[songNum%playlist.tracks.length]);
    }
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
    seconds = 20;
    updateText();
    widget.load("https://api.soundcloud.com/tracks/"+track.id);
  }
  widget.bind(SC.Widget.Events.READY, function() {
    drawCanvas(20, false);
    widget.bind(SC.Widget.Events.PLAY, function(){
      // $("#mycanvas").remove();
      // $("<canvas id=\"mycanvas\" width=\"345\" height=\"345\"></canvas>").appendTo(".canvas");
      canvasListener();
      drawCanvas(20, true);
      startTimer =  setInterval(updateSeconds, 1000);
      var speech = "Begin set " + set + " of " + currExercise.name + " at "
        + currExercise.weight + "pounds for " + currExercise.reps + "reps";
      responsiveVoice.speak(speech, "UK English Male");

    });
  });

});
