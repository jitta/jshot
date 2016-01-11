/**
 * This is an example app fired up to capture screenshots
 */

var express = require('express'),
  app = express();

app.use('/', express.static(__dirname + '/public'));

module.exports = app.listen((process.env.PORT || 7666));