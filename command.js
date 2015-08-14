'use strict';

var fs = require("fs");


fs.stat('meshblu.json', function(err, stat) {
  if(err == null) {
    console.log('File exists');

   var config = require('./meshblu.json');
   var Connector = require('./connector');
   new Connector(config);

  } else if(err.code == 'ENOENT') {
    var json = {"server":"meshblu.octoblu.com","port":80,"uuid":"uuid-here","token":"token-here"} ;
    fs.writeFile('./meshblu.json', JSON.stringify(json));
    setTimeout(function () {
    var config = require('./meshblu.json');
    var Connector = require('./connector');
    new Connector(config);
  }, 300);
  } else {
    console.log('Some other error: ', err.code);
  }
});
