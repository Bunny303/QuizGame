var express = require('express'),
    user = require('./routes/users'),
    flag = require('./routes/flags');
 
var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
 
app.configure(function () {
    app.use(express.logger('dev'));     
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
});
 
app.post('/users/register', user.register);
app.post('/users/login', user.login);
app.put('/users/score/:id', user.updateScore);
app.get('/users/score', user.getAllScores);
app.get('/flags', flag.getAll);
app.post('/flags', flag.addFlag);
app.get('/flags/:index', flag.getQuestion);
 
app.listen(3000);
console.log('Listening on port 3000...');