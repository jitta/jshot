/*
  Demo test for comparing screenshots.
 */

describe('Running comparing screenshots demo test', function () {

  var app = undefined;
  
  before( function (done) {  
      app = require('../example-app/app.js');  //have your app instance fired up first.
      app.on('listening', done);
  });
  
  //Intregrate these into your mocha test files.
  var jshot = require('../index.js');

  //setup config and environment.
  var config = require('./config.js');
  config.env = 'local';
  
  //fired up to compare screenshots.
  jshot.compare(config);
  
});
