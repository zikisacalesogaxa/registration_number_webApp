module.exports = function(app) {
  'use strict';
  var plateList = {};
  var platesList = [];

  var mongoose = require('mongoose');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('We are connected');
  });

  const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/regnumbers";
  mongoose.connect(mongoURL);

  var plateSchema = mongoose.Schema({plate: String});
  var regnumbers = mongoose.model('regnumbers', plateSchema);

  app.get('/', function (req, res){
    'use strict';
    res.render('reg_numbers', {});
    console.log('user on route: ' + req.url);
  });

  app.post('/reg_numbers', function (req, res) {
    'use strict';
    console.log('user on route: ' + req.url);
    for (var i = 0; plateList.length; i++) {}

    var plateInput = req.body.regNumberInput;
    var button = req.body.button;
    var city = req.body.city;

    function getCity(city) {
      'use strict';
      var filterd = [];
      for (var i = 0; i < platesList.length; i++) {
        var pList = platesList[i];
        if (city === 'Cape Town' && pList.startsWith('CA')) {
          filterd.push(pList);
        } else if (city === 'Paarl' && pList.startsWith('CJ')) {
          filterd.push(pList);
        } else if (city === 'Bellville' && pList.startsWith('CY')) {
          filterd.push(pList);
        } else if (city === 'Stellenbosch' && pList.startsWith('CL')) {
          filterd.push(pList);
        } else if (city === 'All') {
          filterd.push(pList);
        }
      }
      return filterd;
    }

    if (button === 'add') {
      if (plateList[plateInput] === undefined && plateInput !== "") {
        plateList[plateInput] = 1;
        platesList.push(plateInput.toUpperCase());
        res.render('reg_numbers', {plateList: platesList});
        regnumbers.create({plate: plateInput});
        console.log('Plate added to DB');
      }
    } else if (button === 'filter') {
      if (city) {
        var getCity = getCity(city);
        res.render('reg_numbers', {plateList: getCity});
      } else {
        res.render('reg_numbers', {plateList: platesList});
      }
    }
  });
};
