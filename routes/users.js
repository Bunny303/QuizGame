mongo = require('mongodb')
Server = mongo.Server
Db = mongo.Db
BSON = mongo.BSONPure;
con = null;

server = new Server('paulo.mongohq.com', 10003, { auto_reconnect: true });
var db = new Db('QuizGameDB', server, { safe: false });
db.open(function (err, db) {
    if (!err) {
        db.authenticate('Bunny', 'qwerty', function (err) {
            if (!err) {
                con = db;
            }
        });
    }
});

exports.register = function (req, res) {
    var user = {
        username: req.body.username,
        nickname: req.body.nickname,
        authCode: req.body.authCode,
        score: 0
    }; 
    console.log('Register user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]._id);
            }
        });
    });
}

exports.login = function(req, res) {
    var user = {
        username: req.body.username,
        authCode: req.body.authCode
    };
    console.log('Login user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.findOne(user, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send({
                    id: result._id,
                    nickname: result.nickname
                });
            }
        });
    });
}

exports.updateScore = function (req, res) {
    var id = req.params.id;
    
    db.collection('users', function (err, collection) {
        collection.update({ _id: new BSON.ObjectID(id) }, { $set: { score: req.body.score } }, function (err, result) {
            if (err) {
                console.log('Error updating: ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(result);
            }
        });
    });
}

exports.getAllScores = function (req, res) {
    db.collection('users', function (err, collection) {
        collection.find({},{ 'sort': 'score' }).toArray(function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success');
                res.send(result);
            }
        });
    });
}
 

 
