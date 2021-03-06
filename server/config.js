var bodyParser = require('body-parser'),
	express = require('express'),
	exphbs = require('express-handlebars'),
	router = require('./router');
module.exports.initialize = function(app){
	//parse application
	app.use(bodyParser.urlencoded({extended: false}));

	//parse application/json
	app.use(bodyParser.json());
	app.engine('handlebars', exphbs.create({defaultLayout: 'main'}).engine);
	app.set('view engine', 'handlebars');
	//Add routes
	router(app);
	//use public as the default static directory
	app.use(express.static('public'));
	return app;
}
