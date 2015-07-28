var fs = require("fs");
var Nightmare = require("nightmare");
var argv = require('minimist')(process.argv.slice(2));

var filename = "./app/screenshots/" + (argv.name || "__") + ".png";

new Nightmare()
  .viewport( (argv.w || 1200), (argv.h || 900))
  .goto( (argv.url || "http://www.google.com") )
  .screenshot(filename)
  .run(function (err, nightmare) {
    fs.readFile(filename, function (err, data) {
      if (err) {
        throw err
        process.exit(1)
      }
      process.stdout.write(data);
    });
  });
