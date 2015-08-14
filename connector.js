'use strict';
var Plugin = require('./index').Plugin;
var meshblu = require('meshblu');
var fs = require("fs");
var sent = false;

var Connector = function(config) {
  var conx = meshblu.createConnection({
    server : config.server,
    port   : config.port,
    uuid   : config.uuid,
    token  : config.token
  });

  var consoleError = function(error) {
    console.error(error.message);
    console.error(error.stack);
  };

  process.on('uncaughtException', consoleError);
  conx.on('notReady', function(data) {
    if(config.uuid == "uuid-here"){
      conx.register({
        "type": "device:edison"
      }, function(data) {
        config.uuid = data.uuid;
        config.token = data.token;
        fs.writeFile('meshblu.json', JSON.stringify(config), function(err) {
          if (err) return;
        });
      });

      var claim = 'https://app.octoblu.com/node-wizard/claim/' + config.uuid + '/' + config.token;
      console.log("CLAIM THIS DEVICE! -> ", claim);

      conx.authenticate({
        "uuid": config.uuid,
        "token": config.token
      }, function(data) {

      });
    }
  });
  conx.on('error', consoleError);
  if(!sent){
    var plugin = new Plugin();
    sent = true;
  }

  conx.on('ready', function(){
    var claim = 'https://app.octoblu.com/node-wizard/claim/' + config.uuid + '/' + config.token;
    console.log("CLAIM THIS DEVICE IF YOU HAVEN'T! -> ", claim);
    conx.whoami({uuid: config.uuid}, function(device){
      plugin.setOptions(device.options || plugin.options);
      conx.update({
        uuid: config.uuid,
        token: config.token,
        optionsSchema: plugin.optionsSchema,
        options:       plugin.options
      });

      setTimeout(function () {
        conx.whoami({uuid: config.uuid}, function(device){
          plugin.StartBoard(device);
        });
      }, 3000);
    });

    plugin.Read();


  conx.on('message', function(){
    try {
      plugin.onMessage.apply(plugin, arguments);
    } catch (error){
      console.error(error.message);
      console.error(error.stack);
    }
  });

  conx.on('config', function(){
    try {
      plugin.onConfig.apply(plugin, arguments);
    } catch (error){
      console.error(error.message);
      console.error(error.stack);
    }
  });

  plugin.on('message', function(message){
    conx.message(message);
  });

  plugin.on('updateConfig', function(message){
    conx.update({
      uuid: config.uuid,
      token: config.token,
      "messageSchema": message.messageSchema,
      "messageFormSchema":  message.messageFormSchema,
      "optionsSchema":  message.optionsSchema,
      "optionsForm":  message.optionsForm
    });
  });

  plugin.on('updateOptions', function(message){
    conx.update({
      uuid: config.uuid,
      token: config.token,
      options:  message
    });
  });

  plugin.on('config', function(){
    conx.whoami({uuid: config.uuid}, function(device){
      plugin.checkConfig(device);
    });
  });

  plugin.on('error', consoleError);

});

};

module.exports = Connector;
