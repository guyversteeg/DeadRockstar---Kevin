var express     = require('express');
var bodyParser  = require('body-parser');
var xml         = require('xml');
var path        = require('path');
var morgan      = require('morgan');
var compression = require('compression');

var app = express();
app.set('view engine', 'ejs');
app.set('json spaces', 3);

app.use(morgan('dev'));
app.use(compression({threshold: 1}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'client-side')));

var mongo    = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

mongo.connect('mongodb://127.0.0.1:27017/dead_rockstars', function(err, db) {
  if(err) throw err;

  var collection = db.collection('rockstars');

  var rockstarRoutes = express.Router();
  // get the list of rockstars

  rockstarRoutes.get('/', function(request, response) {
      collection.find().toArray( function(err, resultArray){
         if(err) throw err;
         response.format({
            text: function(){
               response.status(406);
               response.send('The server cannot render the requested content type. Accepted types are: \n  *  text/html\n  *  application/xml\n  *  application/json\n\n');
            },
            html: function(){
               response.render("rockstarList.html.ejs", {list:resultArray});
            },
            json: function(){
               response.json(resultArray);
            },
            xml: function(){
               response.render("rockstarList.xml.ejs", {list:resultArray });
            }
         }); // end res.format
      }); // end collection.find.toArray
   }); // end router.get
   // get a single movie
   rockstarRoutes.get('/:id', function(request, response) {
      var theID = request.params.id
      if(theID.length > 20) {
         theID = ObjectId(theID)
      }
      collection.findOne({_id:theID}, function(err, rockstarInfo) {
         if(err) throw err;
         if(rockstarInfo == null) {
            response.status(404);
            response.send('No rockstar with that ID.\n\n');
            return;
         }
         response.format({
            text: function(){
               response.status(406);
               response.send('The server cannot render the requested content type. Accepted types are: \n  *  text/html\n  *  application/xml\n  *  application/json\n\n');
            },
            html: function(){
               response.render("rockstar.html.ejs", {star:rockstarInfo});
            },
            json: function(){
               response.json(rockstarInfo);
            },
            xml: function(){
               response.render("rockstar.xml.ejs", {star:rockstarInfo });
            }
         }); // end res.format
      }); // end findOne
   }); // end route.get

  rockstarRoutes.post('/', function(request, response) {
     request.body.created_at = new Date();
     collection.insert(request.body, function(err, result) {
        if(err) throw err;
        response.json(request.body);
     });
  });

  rockstarRoutes.put('/:id', function(request, response) {
     delete request.body._id; // body-parser made _id a string. Mongo does not like that.
     collection.update({_id:request.params.id}, request.body, function(err, result) {
        if(err) throw err;
        request.body[_id] = request.params.id;
        response.json({ok:true, result: request.body[_id]});
     });
  });

  rockstarRoutes.delete('/:id', function(request, response) {
     var theID = request.params.id
     if(theID.length > 20) {
        theID = ObjectId(theID)
     }
     collection.remove({_id: theID}, function(err,result){
        if(err) throw err;
        response.json({ok:true});
     });
  });
  app.use("/stars",rockstarRoutes);

   function fillEmptyDatabase() {
      collection.find().toArray( function(err, resultArray){
         if(err) throw err;
         if( resultArray.length == 0) {
            var stars = require('./largeStarList.json');
            for( var idx in stars ) {
               var callbackCounter = 0;
               collection.insert(stars[idx], function(err, result) {
                  if(err) throw err;
                  if(callbackCounter==idx) {
                    console.log( "Database was empty: added", parseInt(idx)+1, "dead rockstars to the database called \"dead_rockstars\".");
                  } else {
                    callbackCounter++
                  }
               }); // end insert
            } // end for
         } // end if
     }); // end
  } // end function
   fillEmptyDatabase(); // call fillEmptyDatabase immediately
});

app.listen(3000);
console.log("Server running on port 3000.");
