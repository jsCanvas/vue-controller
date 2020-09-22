import Layout from '@/layout'

var routerMap = [
	
]

export default function(){
	var modulesFiles = require.context('./modules', true, /\index.js$/)
	modulesFiles.keys().reduce((modules, modulePath) => {
		var moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
		var value = modulesFiles(modulePath)
		modules[moduleName] = value.default
		routerMap.push(value.default);
		return modules
	}, {})
	
	return routerMap;
}
