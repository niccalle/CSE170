module.exports.getNames = function(data){
  var names = [];
  for(var i in data){
    names.push(data[i].name);
  }
  return names;
}

module.exports.findHelper = function(param){
  return function(element){
    return element.name == param;
  }
}

module.exports.getImage = function(workout){
  var index = Math.floor((Math.random()*9)+1);
  workout.workoutInfo.image = "/assets/background"+index+".jpg";
}
