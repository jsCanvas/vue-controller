import {maskList} from '@/settings';
function setMaskList(maskList, list){
    list.forEach((item,index) => {
        list[index] = setMask(maskList, item);
    });
    return list;
}
function setMask(maskList, obj){
    if(!maskList || !Array.isArray(maskList)|| maskList.length <= 0){
        return obj;
    }
    var isString = false;
    if(typeof obj == 'string'){
        try{
            obj = JSON.parse(obj);
            isString = true;
        }catch(err){
            obj = toStrMask(maskList, obj);
            return obj;
            //obj = obj;
        }
    }
    if(!isObject(obj) && !isArray(obj)) {
        return obj;
    }
    obj = JSON.parse(JSON.stringify(obj));
    var keys = Object.keys(obj);
    keys.forEach((item,index) => {
        var val = obj[item];
        if(isNumStr(val)){
            maskList.forEach(msItem => {
                item == msItem && (obj[item] = toMask(val));
            })
        }
        if(isObject(val)) {
            obj[item] = setMask(maskList, val);
        }
        if(isArray(val)) {
            obj[item] = val.map(msItem=>{
                return setMask(maskList, msItem);
            })
        }
    })
    if(isString){
        obj = JSON.stringify(obj);
    }
    return obj;
}
function toStrMask(maskList, str){
    var reg;
    maskList.forEach(msItem => {
        reg = eval(`/(\\W)(${msItem}=)([\\w\*]+)\\b/g`);
        str = str.replace(reg, function(...arge){
            //console.log(str)
            //console.log('=======================================',arge[3]);
            arge[3] = toMask(arge[3]);
            return arge.slice(1,4).join("")
        });
    });
    return str;
}
function toMask(str){
    if(!str){
        return str;
    }
    if(/^\d{4,12}$/.test(str)) {
        if(/^\d*\*{3,18}\d+$/.test(str)) {
            return str;
        }
        str = str + '';
        var len = str.length;
        var slice = [Math.floor(len/3), Math.ceil(len * 1.3/3 )];
        //str = str.slice(0, slice[0]) + '*'.repeat( slice[1]) + str.slice(slice[0] + slice[1]);
        str =  '*'.repeat(len - 3) + str.slice(-3);
    }else if(/^\d{12,17}$/.test(str)){
        str = str + '';
        var len = str.length;
        var slice = [Math.floor(len/3), Math.ceil(len * 1.3/3 )];
        //str = str.slice(0, 4) + '*'.repeat(len - 4-4) + str.slice(-4);
        str = str.slice(0, 2) + '*'.repeat(len - 4) + str.slice(-2);
    }else if(/^\d{17,}$/.test(str)){
        str = str + '';
        var len = str.length;
        var slice = [Math.floor(len/3), Math.ceil(len * 1.3/3 )];
        //str = str.slice(0, 3) + '*'.repeat(len - 7) + str.slice(-4);
        str = str.slice(0, 1) + '*'.repeat(len - 2) + str.slice(-1);
    }else if(/^[\w\-\.]+\@[\w\-\.]/.test(str)){
        str = str.split('@');
        str[0] = str[0].slice(0,str[0].length/2 ) + '*'.repeat(Math.ceil(str[0].length/2));
        str = str.join('@');
    }else{
        str = str + '';
        var len = str.length;
        var slice = [Math.floor(len/3), Math.ceil(len * 1.3/3 )];
        str = str.slice(0, slice[0]) + '*'.repeat(slice[1]) + str.slice(slice[0] + slice[1]);
        //str = str.slice(0, 2) + '*'.repeat(len - 4) + str.slice(-2);
    }
    return str;
}
function isObject(obj){
    return Object.prototype.toString.call(obj) === '[object Object]';
}
function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}
function isNumStr(obj) {
    var t = Object.prototype.toString.call(obj);
    return t === '[object Number]' || t === '[object String]';
}

if(1||maskList && maskList.length >0){
    let log = console.log;
    console.log = function(){
        if(!window.openConsole){
            return
        }
        log.apply(null, setMaskList(maskList, [].slice.apply(arguments)))
    }
}
