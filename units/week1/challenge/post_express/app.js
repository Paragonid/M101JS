var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res){
        res.render('fruitPicker');
    });

    app.post('/addMovie', function(req, res, next) {
        let {title, year, imbd} = req.body;
        if (!(title && year && imbd)) {
            next('Required!');
        }
        else {
            db.collection('movies').insert({title, year, imbd}, function(err, added) {
                res.send(added);
            });
        }
    });

    // Handler for internal server errors
    function errorHandler(err, req, res, next) {
        console.error(err.message);
        console.error(err.stack);
        res.status(500).render('error_template', { error: err });
    }

    app.use(errorHandler);

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});