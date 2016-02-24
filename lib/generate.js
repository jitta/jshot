/*
  Mocha module test runner to generate screenshots with jshot docker image.
 */
module.exports = function (config) {

  var fs = require('fs'),
    spawn = require('child_process').spawn,
    chai = require('chai'),
    base_url = config.base_url[config.env];

  if (!fs.existsSync(config.path + config.generate_path)) {
    fs.mkdirSync(config.path + config.generate_path);
  }

  for (var i = 0, len = config.viewports.length; i < len; i++) {

    var viewport = config.viewports[i];
        
    var generate = function (viewport, path, name) {

      describe('Generating screenshot at ' + base_url + path + ' for viewport ' + viewport.name + ' (' + viewport.width + 'x' + viewport.height + ')', function () {

        it('Screenshot generated', function (done) {

          /*
            Generates screenshot by calling docker jshot image and write output image.
           */
          var file = fs.createWriteStream(config.path + (config.generate_path + '/' + name + '_' + viewport.name + '.png')),
            jshot = spawn('docker', ['run', '--rm', 'jitta/jshot', 'node', '/app/capture.js', '--url', base_url + path, '-w', viewport.width, '-h', viewport.height]);

          jshot.stderr.setEncoding('utf8');
          jshot.stderr.on('data', function (data) {
            console.error(data);
          });
          jshot.stdout.on('data', function (data) {
            file.write(data);
          });
          jshot.on('close', function (code) {
            file.end();
            chai.expect(code).to.eql(0);
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

      generate(viewport, path, name);
    
    }
  }
};
