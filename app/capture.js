var Nightmare = require("nightmare");

if (process.argv[2] === undefined) {
  throw 'URL required for screenshot.';
  process.exit(1);
}

var url = process.argv[2];

new Nightmare()
  .viewport(1200, 900)
  .goto(url)
  .screenshot("./app/screenshots/test.png")
  .run(function (err, nightmare) {
    console.log(url + " Screenshot capture!")
  });
