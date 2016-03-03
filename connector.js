'use strict';
var Plugin       = require('./index').Plugin;
var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var meshblu      = require('meshblu');
var packageJSON  = require('./package.json');
var _            = require('lodash');
var fs = require("fs");

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }

var Connector = function(config){
  var self = this;
  self.config = config;
  self.createConnection = bind(self.createConnection, self);
  self.onReady = bind(self.onReady, self);
  self.onMessage = bind(self.onMessage, self);
  self.onConfig = bind(self.onConfig, self);
  self.run = bind(self.run, self);
  self.emitError = bind(self.emitError, self);
  if(!process){
    return;
  }
  process.on('uncaughtException', function(error){
    self.emitError(error);
    process.exit(1);
  });
  return self;
};

util.inherits(Connector, EventEmitter);

Connector.prototype.createConnection = function(){
  var self = this;
  self.conx = meshblu.createConnection({
    server : self.config.server,
    port   : self.config.port,
    uuid   : self.config.uuid,
    token  : self.config.token
  });
  self.conx.on('notReady', function(data) {
    if(self.config.uuid == "uuid-here"){
      self.conx.register({
        "type": "device:edison"
      }, function(data) {
        self.config.uuid = data.uuid;
        self.config.token = data.token;
        fs.writeFile('meshblu.json', JSON.stringify(config), function(err) {
          var claim = 'https://app.octoblu.com/claim/' + self.config.uuid + '/' + self.config.token;
          console.log("CLAIM THIS DEVICE! -> ", claim);
          self.conx.authenticate({
            "uuid": self.config.uuid,
            "token": self.config.token
          }, function(data) {});
          if (err) return;
        });
      });
    }
  });
  self.conx.on('error', self.emitError);

  self.conx.on('ready', self.onReady);
  self.conx.on('message', self.onMessage);
  self.conx.on('config', self.onConfig);
};

Connector.prototype.onConfig = function(device){
  var self = this;
  self.emit('config', device);
  try{
    self.plugin.onConfig.apply(self.plugin, arguments);
  }catch(error){
    self.emitError(error);
  }
};

Connector.prototype.onMessage = function(message){
  var self = this;
  self.emit('message.recieve', message);
  try{
    self.plugin.onMessage.apply(self.plugin, arguments);
  }catch(error){
    self.emitError(error);
  }
};

Connector.prototype.onReady = function(){
  var self = this;
  var claim = 'https://app.octoblu.com/claim/' + self.config.uuid + '/' + self.config.token;
  console.log("CLAIM THIS DEVICE IF YOU HAVEN'T! -> ", claim);
  self.conx.whoami({uuid: self.config.uuid}, function(device){
    self.plugin.setOptions(device || {});
    var oldRecentVersions = device.recentVersions || [];
    var recentVersions = _.union(oldRecentVersions, [packageJSON.version]);
    self.conx.update({
      uuid:          self.config.uuid,
      token:         self.config.token,
      messageSchema: self.plugin.messageSchema,
      optionsSchema: self.plugin.optionsSchema,
      options:       self.plugin.options,
      initializing:  false,
      currentVersion: packageJSON.version,
      recentVersions: recentVersions
    });
  });
};

Connector.prototype.run = function(){
  var self = this;
  self.plugin = new Plugin();
  self.createConnection()
  self.plugin.on('data', function(data){
    self.emit('data.send', data);
    self.conx.data(data);
  });

  self.plugin.on('error', self.emitError);

  self.plugin.on('update', function(properties){
    self.conx.update(properties);
  });

  self.plugin.on('message', function(message){
    self.emit('message.send', message);
    self.conx.message(message);
  });
};

Connector.prototype.emitError = function(error){
  var self = this;
  self.emit('error', error);
};

module.exports = Connector;
