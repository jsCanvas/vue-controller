import {cachedApi} from '@/settings'
/*
     根据路径
        URL 为第一层对象 ，
            参数 为第二层对象 默认def ，
            outTime 超时时间
     config：path 缓存接口配置
        url： 接口路径
        outTime ：缓存时长
     config：clearPath： 清除缓存配置
        url： 接口路径
        clearUrl: 清除缓存 路径
 */
let sessionData = {};
let sConfig = {
    outTime: 0,
    path: [
        // {
        //     url: ['member/findOrderList','customer/findList$'],
        //     outTime: 30 * 1000
        // },{
        //     url: ['customer/getInfo','activity/getCustomerMark',
        //     'tms/getTmsMark', 'member/getMemberInfo','customer/getWeChatConcernStatus'],
        //     outTime: 20 * 1000
        // }
    ],
    clearPath: [
        // {
        //     url: ['workorder/group/update','workorder/group/delete'], // 符合规则
        //     clearUrl: ['workorder/group/findList']   // 清楚的缓存
        // }
    ]
}
if (cachedApi) {
    sConfig.outTime = cachedApi.outTime || sConfig.outTime;
    sConfig.path = cachedApi.path || sConfig.path;
    sConfig.clearPath = cachedApi.clearPath || sConfig.clearPath;
}
filterPathInit(sConfig.path);
clearAfterPathInti(sConfig.clearPath);

// console.log(sConfig.clearPath)
function sessionDataUrl(url, param, data) {
    url = url.replace(new RegExp('.*?' + location.host.replace(/([\-\.])/g, '\\$1')), '')
    if (data) {
        return setUrl(url, param, data, sessionData)
    }
    return getUrl(url, param, sessionData)
}

function setUrl(url, param, data, sessionData) {
    // 清楚过滤 指定 的URL
    clearAfterPath(url, sessionData);
    let urldata = sessionData[url];
    if (!urldata) {
        urldata = sessionData[url] = {}
    }
    let outTime = getOutTime(url, param);
    if (!outTime) {
        return null
    }
    urldata[paramToStr(param)] = {
        value: data, outTime:
        outTime + Date.now()
    };
    // console.log(sessionData)
}

function getUrl(url, param, sessionData) {
    clearData(sessionData);
    let data = sessionData[url];
    param = paramToStr(param);
    if (!data) {
        return null;
    }
    if (!data[param]) {
        return null;
    }
    // 缓存超时
    if (Date.now() > data[param].outTime) {
        delete data[param]
        return null
    }
    return data[param].value;

}

function clearData(sessionData) {
    if (clearFilterData.isRun) {
        return;
    }
    clearFilterData(sessionData);
    clearFilterData.isRun = true;
    setTimeout(function () {
        clearFilterData.isRun = null;
    }, 1000);
}

function clearFilterData(sessionData) {
    var urls = Object.keys(sessionData);
    urls.forEach(url => {

        let params = Object.keys(sessionData[url]);
        let newTime = Date.now();
        params.forEach(param => {
            if (newTime > sessionData[url][param].outTime) {
                delete sessionData[url][param]
            }
        });
        if (Object.keys(sessionData[url]).length <= 0) {
            delete sessionData[url];
        }
    })
}

function paramToStr(param) {
    if (!param || typeof param == 'string') {
        return param || 'def';
    }
    let keys = Object.keys(param);
    var str = '';
    keys.forEach(o => {
        str += o + '|' + paramToStr(param[o])
    })
    return str || 'def';
}

function clearAfterPathInti(list = []) {
    list.forEach(o => {
        o.url = pathReg(o.url.filter(url => url))
        o.clearUrl = pathReg(o.clearUrl.filter(url => url))
    })
}

function clearAfterPath(ourl, sessionData) {
    let clearPath = sConfig.clearPath || [];
    let dataUrls = Object.keys(sessionData);
    let filterUrl;
    clearPath.forEach(o => {
        if (!o.url || !o.clearUrl) {
            return;
        }
        // 判断当前 URL 是否在 指定清楚过滤 path 内
        // console.log(o.url)
        filterUrl = toArray(o.url).filter(regUrl => regUrl.test(ourl));
        if (filterUrl.length > 0) {
            // 查找 可清楚 的 缓存 url
            dataUrls = dataUrls.filter(url => {
                return toArray(o.clearUrl).filter(regUrl => regUrl.test(url)).length
            });
            dataUrls.forEach(url => {
                delete sessionData[url]
            })
        }
    })
}

function delUrlData(url, sessionData) {
    delete sessionData[url]
}

function toArray(str) {
    return Array.isArray(str) ? str : [str]
}

function filterPathInit(path) {
    //var path = sConfig.path;
    path.forEach(o => {
        o.url = pathReg(o.url)
    })
}

function pathReg(param) {
    if (param && typeof param == 'string') {
        return new RegExp(param.trim())
    }
    if (Array.isArray(param)) {
        return param.map(o => {
            return pathReg(o)
        })
    }
    return param;
}

function getOutTime(url, param) {
    var outTime = sConfig.outTime;
    sConfig.path.forEach(o => {
        if (!o || !o.url) return;
        if (Array.isArray(o.url)) {
            o.url.filter(reg => {
                return reg.test(url)
            }).length && (outTime = o.outTime || outTime)
        } else {
            o.url.test(url) && (outTime = o.outTime || outTime)
        }
    });
    return outTime
}


export default sessionDataUrl
