const path = require('path')
const fs=require("fs")
const readline = require('readline');
let fileList = [];

const readdir = function(dir){
	var files = fs.readdirSync(dir),
	    index = -1,
        pathLoad = '',
        pageIndex = -1,
        name = '',
	    tempArr = [];
    
    files.forEach(function(filename){
    	var stats = fs.statSync(path.join(dir,filename));
    	if(stats.isFile()){
            tempArr = dir.split(path.sep);
            index = tempArr.indexOf('views');
            tempArr = tempArr.slice(index);
            name = filename.split('.')[0];
            pathLoad = tempArr.join('/')+'/'+name;
            tempArr.shift();

            if(name === 'index'){
                fileList.push({
                    name: tempArr.join('/'),
                    path: pathLoad
                });
            }else if(pathLoad.indexOf('page')>0){
                pageIndex = tempArr.indexOf('page');
                tempArr.splice(pageIndex,pageIndex+1);

                fileList.push({
                    name: tempArr.join('/')+'/'+name,
                    path: pathLoad
                });
            }
    	}else if(stats.isDirectory()){
			readdir(path.join(dir,filename));
		}
    });
}

const writeFile = function(dir){

    var wr = fs.createWriteStream(dir);

    wr.once("open", () =>{
    });
    wr.once("close", () => {
    });
    
    wr.write('const routerMap = {\r\n');
    fileList.forEach(function(item,index){
        wr.write('"'+item.name+'": () => import("@/'+item.path+'"),\r\n');
    })
    wr.write('}\r\n');
    wr.write('export default routerMap;');
    wr.end();
}

const createRouterMap = function(){
	var readDir = path.join(__dirname, './src/views'),
        writeDir = path.join(__dirname, './src/router/router-map.js');

	readdir(readDir);
    fs.exists(writeDir,function(exists){
    	if(!exists){
    		writeFile(writeDir);
	    }else{
            fs.unlinkSync(writeDir);
            writeFile(writeDir); 
        }
    })
}

createRouterMap();