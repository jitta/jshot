var fs = require("fs");
var Nightmare = require("nightmare");
var argv = require('minimist')(process.argv.slice(2));

var filename = "./app/screenshots/" + (argv.name || "__") + ".png";

new Nightmare()
  .viewport( (argv.w || 1200), (argv.h || 900))
  .goto( (argv.url || "http://www.google.com") )
  .scrollTo(200, 0)
  .wait(500)
  .scrollTo(500, 0)
  .wait(500)
  .scrollTo(1000, 0)
  .wait(500)
  .scrollTo(1500, 0)
  .wait(500)
  .scrollTo(2000, 0)
  .wait(2000)
  .scrollTo 0, 0
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
