var express = require('express');
var validUrl = require("valid-url");
var app = express();
var path = process.cwd();
var db;

// Retrieve
var mongo = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");

// Connect to the db
mongo.connect("mongodb://user:123456@ds141024.mlab.com:41024/url-shortener", function(err, database) {
    if(err) { return console.dir(err); }
    db = database;
    app.listen(process.env.PORT, function () {
      console.log('Node.js listening ...');
    });
});

app.get('/new/*?', function(req, res) {
    var original = req.params[0];

    if (validUrl.isHttpUri(original)) {
      autoIncrement.getNextSequence(db, 'link', function (err, autoIndex) {
        if (err) throw err;
        var collection = db.collection('link');
        collection.insert({
            _id: autoIndex,
            link: original
        }, (err, data) => {
          if (err) throw err;
          var insertId = data.insertedIds[0];
          var newUrl = "http://" + req.hostname + "/" + insertId;
          res.json({ original_url: original, short_url: newUrl});
        });
    });

    }
    else {
        res.send("Not a valid url");
    }
})

app.get('/:id', function(req, res) {
    var id = parseInt(req.params.id, 0);

    var links = db.collection('link');

    links.find({"_id": id}).toArray((err, link) => {
      if (err) throw err;
      if (link.length > 0) {
        res.redirect(link[0].link);
      }
      else {
        res.send("No link exist for this id");
      }
    });
})

app.get('/', function(req, res) {
    res.sendFile(path + '/index.html');
})
