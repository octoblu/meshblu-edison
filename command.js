'use strict';

var fs = require("fs");

fs.stat('meshblu.json', function(err, stat) {
  if(err == null) {
    console.log('File exists');
  } else if(err.code == 'ENOENT') {
    var json = {"server":"meshblu.octoblu.com","port":80,"uuid":"uuid-here","token":"token-here"} ;
    fs.writeFile('./meshblu.json', JSON.stringify(json));
  } else {
    console.log('Some other error: ', err.code);
  }
});

var config = require('./meshblu.json');
var Connector = require('./connector');

new Connector(config);
