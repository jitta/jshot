/*
  Edit this config file for your proposes :)
 */
module.exports = {

  path: __dirname, //use it like this to generate screenshots inside the same directory as test files.
  generate_path: '/generate',
  compare_path: '/compare',
  threshold: 0.1, //how much you accept for difference.

  /*
    These base url are used for the docker process to request your app!
    In many situations the ip address stays the same.
   */
  base_url: {
    local: 'http://192.168.99.1:7666', //For use on your local machine.
    ci: 'http://172.17.42.1:7666' //For use maybe on your ci test development.
  },
  
  viewports: [{
    name: 'phone',
    width: 375,
    height: 667
  },{
    name: 'tablet',
    width: 768,
    height: 1024
  },{
    name: 'laptop',
    width: 1200,
    height: 900
  }],
  
  paths: [
    '/index.html',
    '/generic.html',
    '/elements.html'
  ]
};