var express = require('express');
var app = express();

app.get('/new/:link', function(req, res) {
    var original = req.params.link;
    
    res.send(original);
})

app.get('/', function(req, res) {
    res.redirect('http://www.google.com');
})

app.listen(process.env.PORT || 8080, function() {
    console.log('Listening on port 8080.')
})