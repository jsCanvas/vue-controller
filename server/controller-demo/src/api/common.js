import request, { postRequest } from '@/utils/request'

export function requestApi(url,type,params) {	
	var apiList = [];
var modulesFiles = require.context('./modules', true, /\index.js$/)
	modulesFiles.keys().reduce((modules, modulePath) => {
		var moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
		var value = modulesFiles(modulePath)
		modules[moduleName] = value.default;
		// apiList.push(value.default);
		apiList = [...apiList,...value.default]
		return modules
	}, {})
	console.log(apiList);
	// apiRequest('/mocks',{mock:apiList});
	postRequest('/control/api',{mock:apiList});
}

export function commonRequest(url,type,params) {
	return request({
		url: url,
		method: type,
		data: params
	})
}

export const getDataDictionary = (data) => {
    return postRequest('/dataDictionary/findByType', data)
}

export function dataDictionary(params) {
	return request({
	    url: '/dataDictionary/findByType',
	    method: 'post',
		data: params,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

export function organizationList(params) {
	return request({
	    url: '/org/list',
	    method: 'post',
	    data: params
	})
}

export function getIccUrl(params) {
	return request({
	    url: '/icc/getConfig',
	    method: 'post',
	    data: params
	})
}

export function getIccAccount(params){
	return request({
	    url: '/icc/getAccount',
	    method: 'post',
	    data: params
	})
}

export function down(params){
	return request({
		url: '/knowledge/point/fileDownload',
		method: 'post',
		data: params,
		responseType: 'blob'
	  })
}

//附件信息查询
export function getFileDetailMessage(params){
	return request({
	    url: '/file/get?id='+params.id,
	    method: 'post',
	    data: params
	})
}

