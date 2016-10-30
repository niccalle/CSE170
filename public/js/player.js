/*
  First, the widget is loaded. The listener is binded to the play button
  which will make the timer go down. Also, all the songs are loaded.
  When the timer hits 0, the interval is stopped and the next song is loaded.
*/
$(document).ready(function(){

  var widgetIframe = document.getElementById('sc-widget'),
      widget       = SC.Widget(widgetIframe);
  var seconds = 20;
  var playlist;
  var songNum = 0;
  var startTimer;
  /*Initial dummy timer*/
  drawCanvas(20, false);
  function canvasListener(){
    $("#mycanvas").click(function(){
      widget.play();
    });
  }
  canvasListener();
  function updateSeconds(){
    seconds--;
    // $("#timer").text(seconds);
    if(seconds == 0){
      songNum++;
      clearInterval(startTimer);
      loadSong(playlist.tracks[songNum])
    }
  }
  function loadSong(track){
    seconds = 20;
    widget.load("https://api.soundcloud.com/tracks/"+track.id
    // ,
    // {
    //   callback: function(){
    //     widget.play();
    //   }
    // }
    );
  }
  widget.bind(SC.Widget.Events.READY, function() {
    console.log("Ready");
    widget.bind(SC.Widget.Events.PLAY, function(){
      $("#mycanvas").remove();
      $("<canvas id=\"mycanvas\" width=\"345\" height=\"345\"></canvas>").appendTo(".canvas");
      canvasListener();
      drawCanvas(20, true);
      startTimer =  setInterval(updateSeconds, 1000);
    });
    $.get("/getSongs/"+$("#playlist").text(), function(data){
      playlist = data['songs'];
      loadSong(playlist.tracks[0]);

    })

  });

});
