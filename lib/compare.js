/*
  Mocha module test runner to compare screenshots with jshot docker image.
 */
module.exports = function (config) {

  var fs = require('fs'),
    spawn = require('child_process').spawn,
    chai = require('chai'),
    base_url = config.base_url[config.env],
    resemble = require('resemble').resemble;

  /*
    Helper for writing base64 image files.
   */
  var decodeBase64Image = function (dataString) {

    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
  
  };

  if (!fs.existsSync(config.path + config.compare_path)) {
    fs.mkdirSync(config.path + config.compare_path);
  }

  for (var i = 0, len = config.viewports.length; i < len; i++) {

    var viewport = config.viewports[i];

    var compare = function (viewport, path, name) {

      describe('Generating screenshot for compare at ' + base_url + path + ' for viewport ' + viewport.name + ' (' + viewport.width + 'x' + viewport.height + ')', function () {

        it('Screenshot generated', function (done) {

          /*
            Generates screenshot by calling docker jshot image and write output image.
           */
          var file = fs.createWriteStream(config.path + (config.compare_path + '/' + name + '_' + viewport.name + '.png')),
            jshot = spawn('docker', ['run', 'jitta/jshot', 'node', '/app/capture.js', '--url', base_url + path, '-w', viewport.width, '-h', viewport.height]);

          jshot.stderr.setEncoding('utf8');
          jshot.stderr.on('data', function (data) {
            console.error(data);
          });
          jshot.stdout.on('data', function (data) {
            file.write(data);
          });
          jshot.on('close', function (code) {
            file.end();
            chai.expect(code).to.eql(0.0);
            done();
          });

        });

        it('Compared styles to reference', function (done) {

          /*
            Compares screenshot images and write down the difference image file.
           */
          resemble(config.path + config.compare_path + '/' + name + '_' + viewport.name + '.png').compareTo(config.path + config.generate_path + '/' + name + '_' + viewport.name + '.png').onComplete( function (data) {

            var imageBuffer = decodeBase64Image(data.getImageDataUrl());
            
            fs.writeFileSync(config.path + (config.compare_path + '/_diff_' + name + '_' + viewport.name + '.png'), imageBuffer.data);
            chai.expect(data.misMatchPercentage).to.be.at.most(config.threshold);
            done();
          
          });
        });
      });
    };

    /*
      Generates a mocha test for each viewports and paths.
     */
    for (var j = 0, len1 = config.paths.length; j < len1; j++) {

      var path = config.paths[j],
        name = path.split('/');

      name = name[name.length - 1];

      compare(viewport, path, name);

    }
  }
};
