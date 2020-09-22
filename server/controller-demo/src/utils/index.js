import Clipboard from 'clipboard'
import Vue from 'vue'

var vueProto = Vue.prototype;
var CryptoJS = require('crypto-js');

var utils = {
    numberReg: /^[0-9]*$/,//验证数字
    bankCardReg: /^([1-9]{1})(\d{14}|\d{18})$/, //银行卡号正则验证
    phoneReg: /^1\d{10}$/, //手机号正则验证
    accountReg: /(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/, //验证金额
    identifyReg: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,//身份证号正则验证
    tagColor: [{
        name: '蓝色',
        value: '#4C7EE9'
    },{
        name: '绿色',
        value: '#3BC602'
    },{
        name: '红色',
        value: '#FF6555'
    }],
    clipboard: null,
    parseTime: function(time, cFormat){
        if (arguments.length === 0) {
            return null
        }

        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
                time = parseInt(time)
            }
            if ((typeof time === 'number') && (time.toString().length === 10)) {
                time = time * 1000
            }
            date = new Date(time)
        }

        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }

        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value ]
            }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    },
    getPassYearFormatDate: function() {
        var date = new Date()
        date.setDate(date.getDate()-365)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
            month = "0" + month
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate
        }
        return `${year}-${month}-${strDate}`
    },
    formatTime: function(time, option){
        if (('' + time).length === 10) {
            time = parseInt(time) * 1000
        } else {
            time = +time
        }
        const d = new Date(time)
        const now = Date.now()

        const diff = (now - d) / 1000

        if (diff < 30) {
            return '刚刚'
        } else if (diff < 3600) {
            return Math.ceil(diff / 60) + '分钟前'
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + '小时前'
        } else if (diff < 3600 * 24 * 2) {
            return '1天前'
        }
        if (option) {
            return parseTime(time, option)
        } else {
            return (
                d.getMonth() +
                1 +
                '月' +
                d.getDate() +
                '日' +
                d.getHours() +
                '时' +
                d.getMinutes() +
                '分'
            )
        }
    },
    param2Obj: function(url){
        const search = url.split('?')[1]
        if (!search) {
            return {}
        }
        return JSON.parse(
            '{"' +
              decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
                .replace(/\+/g, ' ') +
            '"}')
    },
    generateUUID: function(){
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    lianUUID: function(){
        var len = 32,
            radix = 16,
            chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
            r = '',
            uuid = [],
            i;

        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                     r = 0 | Math.random()*16;
                     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    copyFun: function(){
        if(this.clipboard){
            this.clipboard.destroy();
            this.clipboard = null;
        }

        this.clipboard = new Clipboard(".copy-btn");
        this.clipboard.on("success", function(e) {
            vueProto.$message({
                showClose: true,
                message: '复制成功！',
                type: 'success'
            })
            e.clearSelection();
        })

        this.clipboard.on("error", function(e) {
            vueProto.$message({
                showClose: true,
                message: '复制失败！',
                type: 'warning'
            })
        })
    },
    encrypt: function(word){
        try {
            if (utils.isAesEncrypt(word)) {
                 return word;
            }
            return utils.orgAesEncrypt(word);
       } catch (e) {
            // 忽略， 不要影响现有逻辑
            return word;
       }

    },
    decrypt: function(word){
        try {
            if (utils.isAesEncrypt(word)) {
                return utils.orgAesDecrypt(word);
            }
            return word;
        } catch (e) {
            // 忽略， 不要影响现有逻辑
            return word;
        }
    },
    orgAesEncrypt: function(word){
        var key = CryptoJS.enc.Utf8.parse("crm-workbench-ed"),
            srcs = CryptoJS.enc.Utf8.parse(word),
            encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});

        return encrypted.toString();
    },
    orgAesDecrypt: function(word){
        var key = CryptoJS.enc.Utf8.parse("crm-workbench-ed"),
            decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});

        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },
    isAesEncrypt: function(word){
        try {
            if (word != null && word != "" && word == utils.orgAesEncrypt(utils.orgAesDecrypt(word))) {
                return true;
            }
            return false;
        } catch (e) {
            // 忽略， 不要影响现有逻辑
            return false;
        }
    },
    mobileDesensitization: function(param){
        var reg = param.substring(param.length-3);

        return '*******'+reg;
    },
    baseImgUrl(fileId){
        var baseUrl = process.env.VUE_APP_BASE_API;
        if(/localhost/.test(location.host)){
            baseUrl = 'http://crmgateway-marketingdet-ctest2-8080.msxfcloud.test'
        }else{
            baseUrl = location.protocol + '//' + location.host
        }
        //return 'http://crmgateway-marketingdet-ctest2-8080.msxfcloud.test/fileSystem/attachmentDownload?addWatermarkFlag=N&fileId=' + this.detailTable.fileId;
        return `${baseUrl}/fileSystem/attachmentDownload?addWatermarkFlag=N&fileId=${fileId}`
    }
}
export default utils


