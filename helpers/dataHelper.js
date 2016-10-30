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
