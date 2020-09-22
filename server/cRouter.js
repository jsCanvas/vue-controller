// var requireContext = require('require-context');
var fs = require('fs');
var readdir = promisify(fs.readdir);
var stat = promisify(fs.stat);
var readFile = promisify(fs.readFile);
var routerMap = [
	
]
// 简单实现一个promisify
function promisify(fn) {
  return function() {
    var args = arguments;
    return new Promise(function(resolve, reject) {
      [].push.call(args, function(err, result) {
        if(err) {
          console.log(err)
          reject(err);
        }else {
          resolve(result);
        }
      });
      fn.apply(null, args);
    });
  }
}
 
function readDirRecur(file, callback) {
  return readdir(file).then((files) => {
    files = files.map((item) => {
      var fullPath = file + '/' + item;
 
      return stat(fullPath).then((stats) => {
          if (stats.isDirectory()) {
              return readDirRecur(fullPath, callback);
          } else {
            /*not use ignore files*/
            if(item[0] == '.'){
              //console.log(item + ' is a hide file.');
            } else {
              /**获取 */  
              callback && callback(fullPath)
            }
          }
        })
    });
    return Promise.all(files);
  });
}
 
var fileList = []
 
var timeStart = new Date()
var filePath = path.resolve('static/sx')
 
readDirRecur(filePath, function(filePath) {
  fileList.push(filePath)
}).then(function() {
  console.log('done', new Date() - timeStart); //done 3.3
  console.log(fileList); //打印出来目录下的所有文件
}).catch(function(err) {
  console.log(err);
});
// const cdefault  = function(){
// 	var modulesFiles = requireContext('../../../src/router/modules', true, /\index.js$/)
// 	modulesFiles.keys().reduce((modules, modulePath) => {
// 		var moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
// 		var value = modulesFiles(modulePath)
// 		modules[moduleName] = value.default
// 		routerMap.push(value.default);
// 		return modules
// 	}, {})

// 	return routerMap;
// }

module.exports = {
    cdefault:cdefault
}
