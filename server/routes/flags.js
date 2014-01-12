mongo = require('mongodb')
Server = mongo.Server
Db = mongo.Db
BSON = mongo.BSONPure;
con = null;

server = new Server('paulo.mongohq.com', 10003, {auto_reconnect: true});
var db = new Db('QuizGameDB', server, {safe: false});
db.open(function(err, db) {
    if(!err) {
        db.authenticate('Bunny', 'qwerty', function (err) {
            if (!err) {
                con = db;
            }
        });
    }
});

//exports.getAll = function (req, res) {
//    db.collection('flags', function (err, collection) {
//        collection.find().toArray(function (err, result) {
//            if (err) {
//                res.send({ 'error': 'An error has occurred' });
//            } else {
//                console.log('Success');
//                res.send(result);
//            }
//        });
//    });
//}

exports.getQuestion = function (req, res) {
    var searchedIndex = req.params.index.toString();
    console.log(searchedIndex);
    db.collection('flags', function (err, collection) {
        collection.findOne({ index: searchedIndex }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send({
                    url: result.url,
                    answer: result.answer,
                    index: result.index
                });
            }
        });
    });
}

//exports.addFlag = function (req, res) {
//    var flag = {
//        url: req.body.url,
//        answer: req.body.answer,
//        index: req.body.index
//    };
//    console.log('Flag added');
//    db.collection('flags', function (err, collection) {
//        collection.insert(flag, { safe: true }, function (err, result) {
//            if (err) {
//                res.send({ 'error': 'An error has occurred' });
//            } else {
//                console.log('Success: ' + JSON.stringify(result[0]));
//                res.send(result[0]._id);
//            }
//        });
//    });
//}