import CryptoJS from 'crypto-js';
const aesKey = '123456708123456781234567';
const aesivKey = '1234567081234567';
/* 
  储存token
*/
export function setToken(token) {
    localStorage.setItem('HCToken', _encrypt(token));
}
/* 
  获取token
*/
export function getToken() {
    let token = localStorage.getItem('HCToken') || '';
    try {
        token = _decrypt(token);
    } catch {
        token = '';
    }
    return token;
}

/* 
  解析地址栏 
  xxx.com?a=1&c=2
  parmsStr: a=1&c=2
*/

export function parseQueryString(parmsStr, name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = parmsStr.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            );
    return fmt;
};

String.prototype.endWith = function (endStr) {
    var d = this.length - endStr.length;
    return d >= 0 && this.lastIndexOf(endStr) == d;
};

/**
 * 获取网页地址的参数
 * @param {}} name
 */
export function GetHtmlUrlQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        let str = unescape(r[2]);
        if (EndWith(str, '/')) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    }
    return '';
}

/**
 * 是否有网页地址的参数
 * @param {}} name
 */
export function IsHtmlUrlcontainString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return true;
    }
    return false;
}

//国际时间转时间戳
export function UniversalTimeToStamp(strUniversalTime) {
    if (strUniversalTime.length == 0) {
        return '';
    }
    let sTime = new Date(strUniversalTime)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
    let date = new Date(sTime);
    var time = Date.parse(date) / 1000;
    return time;
}

//根据传入时间的分隔格式生成相应时间返回
//yyyy/MM/dd HH:mm:ss WW
export function ConversionTime(TimeFormat) {
    let str = '';
    let yy = new Date().getFullYear();
    let mm =
        new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
    let week = new Date().getDay();
    let ww = '';
    if (week == 1) {
        ww = '星期一';
    } else if (week == 2) {
        ww = '星期二';
    } else if (week == 3) {
        ww = '星期三';
    } else if (week == 4) {
        ww = '星期四';
    } else if (week == 5) {
        ww = '星期五';
    } else if (week == 6) {
        ww = '星期六';
    } else {
        ww = '星期日';
    }
    str = TimeFormat.replace(/\b(yyyy|MM|dd|HH|mm|ss|WW)\b/g, function ($0, $1) {
        return {
            yyyy: yy,
            MM: mm,
            dd: dd,
            HH: hh,
            mm: mf,
            ss: ss,
            WW: ww
        }[$1];
    });

    return str;
}

//时间戳转标准时间
export function toDate(number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + ' ' + h + m + s;
}

//国际时间转标准时间
export function UniversalTimeToStandard(strUniversalTime) {
    if (strUniversalTime.length == 0) {
        return '';
    }
    let sTime = new Date(strUniversalTime)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
    return sTime;
}

//日期字符串转时间戳（毫秒）
export function strToTimestamp(strTime) {
    let sData = new Date(strTime);
    return sData.getTime();
}

//时间戳转日期(毫秒)
export function timestampToData(timestamp) {
    let date = new Date(timestamp);
    return date;
}

//日期转时间戳（毫秒）
export function dateToTimestamp(data) {
    return data.getTime();
}

//日期转字符串
export function dateToStr(data) {
    let timestamp = dateToTimestamp(data);
    return toDate(timestamp / 1000);
}

//日期字符串转时间戳（毫秒）
export function strToData(strTime) {
    let sData = new Date(strTime);
    return sData;
}

//获取当前时间戳（毫秒）
export function getCurTimestamp() {
    let sData = new Date();
    return sData.getTime();
}

export function MyWriteLog() {
    var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
    //获取当前时间
    let date = new Date();
    let strDate = date.format('yyyy-MM-dd hh-mm-ss');
    console.log(strDate, args);
}

//中国标准时间转北京时间格式
export function StandardToBeijingtime(Standardtime) {
    var Beijintime = new Date(Standardtime);
    var Y = Beijintime.getFullYear() + '-';
    var M =
        (Beijintime.getMonth() + 1 < 10
            ? '0' + (Beijintime.getMonth() + 1)
            : Beijintime.getMonth() + 1) + '-';
    var D = Beijintime.getDate() < 10 ? '0' + Beijintime.getDate() : Beijintime.getDate();
    var h = (Beijintime.getHours() < 10 ? '0' + Beijintime.getHours() : Beijintime.getHours()) + ':';
    var m =
        (Beijintime.getMinutes() < 10 ? '0' + Beijintime.getMinutes() : Beijintime.getMinutes()) + ':';
    var s = Beijintime.getSeconds() < 10 ? '0' + Beijintime.getSeconds() : Beijintime.getSeconds();
    var datetime = Y + M + D + ' ' + h + m + s;
    return datetime;
}

// 快捷复制
export function onCopyText(strText) {
    var textValue = document.createElement('textarea');
    textValue.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
    textValue.value = strText;
    document.body.appendChild(textValue); //将textarea添加为body子元素
    textValue.select();
    var res = document.execCommand('copy');
    document.body.removeChild(textValue); //移除DOM元素
    return res;
}

/**
 * 判断是否后缀
 * @param strOrigin
 * @param strFlag
 * @returns {boolean|boolean}
 * @constructor
 */
export function EndWith(strOrigin, strFlag) {
    var d = strOrigin.length - strFlag.length;
    return d >= 0 && strOrigin.lastIndexOf(strFlag) == d;
}

export function IsFrameType() {
    let isFrame = GetHtmlUrlQueryString('isFrame');
    if (isFrame == 1) {
        return true;
    }
    return false;
}

export function Queue(size) {
    var list = [];

    //向队列中添加数据
    this.push = function (data) {
        if (data == null) {
            return false;
        }
        //如果传递了size参数就设置了队列的大小
        if (size != null && !isNaN(size)) {
            if (list.length == size) {
                this.pop();
            }
        }
        list.unshift(data);
        return true;
    };

    //从队列中取出数据
    this.pop = function () {
        return list.pop();
    };

    //返回队列的大小
    this.size = function () {
        return list.length;
    };

    //返回队列的内容
    this.quere = function () {
        return list;
    };

    this.remove = function (index) {
        list.splice(index, 1);
    };

    this.clear = function () {
        while (list.length > 0) {
            this.pop();
        }
    };
}

//存储到localStorage
export function SaveLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

//localStorage 获取
export function GetLocalStorage(key) {
    let value = localStorage.getItem(key);
    return value;
}

//localStorage 删除某个key
export function DeleteLocalStorageByKey(key) {
    localStorage.removeItem(key);
}

//localStorage 删除所有
export function DeleteLocalStorageAll() {
    localStorage.clear();
}

//存储到SessionStorage
export function SaveSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
}

//SessionStorage 获取
export function GetSessionStorage(key) {
    let value = sessionStorage.getItem(key);
    return value;
}

//SessionStorage 删除某个key
export function DeleteSessionStorageByKey(key) {
    sessionStorage.removeItem(key);
}

//SessionStorage 删除所有
export function DeleteSessionStorageAll() {
    sessionStorage.clear();
}

//生成UUID
export function CreateUUID() {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
    URL.revokeObjectURL(temp_url);
    return uuid.substr(uuid.lastIndexOf('/') + 1);
}

/**
 * rgba转16进制
 * @param rgbaColor
 * @returns {string}
 * @constructor
 */
export function ColorRgbaToHex(rgbaColor) {
    let values = rgbaColor
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
    let a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return (
        '#' +
        ('0' + r.toString(16)).slice(-2) +
        ('0' + g.toString(16)).slice(-2) +
        ('0' + b.toString(16)).slice(-2)
    );
}

/**
 * 16进制颜色转rgba
 * @param hexColor
 * @returns {[]} 颜色数组
 * @constructor
 */
export function ColorHexToRgba(hexColor) {
    let color = [];
    color.push(0, 0, 0, 0);
    let pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if (color && pattern.test(color)) {
        if (color.length == 4) {
            // 将三位转换为六位
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        //处理六位的颜色值
        let colorNew = [];
        for (var i = 1; i < 7; i += 2) {
            colorNew.push(parseInt('0x' + color.slice(i, i + 2)));
        }
        return colorNew;
    }
    return color;
}

export var ValueType = {
    String: 0,
    Int: 1,
    Float: 2,
    Object: 3,
    Bool: 4,
    Array: 5
};

/**
 * 传入Object判断并正确返回类型，同时修改传入的Object
 * @param jObject
 * @param strKey
 * @param valueType
 * @returns {string|null|number}
 * @constructor
 */
export class ValueTypeObject {
    constructor(jObject = {}) {
        this._originValue = JSON.parse(JSON.stringify(jObject));
        this._value = this._originValue;

        this._returnValue = null;
        this._valueType = ValueType.String;
        this._strKey = '';
    }

    GetValueByKey(strKey, valueType) {
        if (this._returnValue != null) {
            this.ToValue(false);
        }
        this._valueType = valueType;
        this._strKey = strKey;

        let value = '';
        let isNoContainer = false;
        if (this._value.hasOwnProperty(strKey)) {
            value = this._value[strKey];
        } else {
            this._value[strKey] = '';
        }
        this._returnValue = value;

        return this;
    }

    GetOriginValue() {
        return this._originValue;
    }

    ToValue(isRestoreValue = true) {
        let isMatchType = false;
        if (this._valueType == ValueType.String) {
            isMatchType = typeof this._returnValue == 'string';
        } else if (this._valueType == ValueType.Int || this._valueType == ValueType.Float) {
            isMatchType = typeof this._returnValue == 'number';
        } else if (this._valueType == ValueType.Object) {
            isMatchType = typeof this._returnValue == 'object';
        } else if (this._valueType == ValueType.Bool) {
            isMatchType = typeof this._returnValue == 'boolean';
        } else if (this._valueType == ValueType.Array) {
            isMatchType = Object.prototype.toString.call(this._returnValue) == '[object Array]';
        }

        let reV = this._returnValue;
        if (isMatchType) {
            if (this._valueType == ValueType.Int) {
                reV = parseInt(this._returnValue);
            }
            if (this._valueType == ValueType.Float) {
                reV = parseFloat(this._returnValue);
            }
        } else {
            if (this._valueType == ValueType.String) {
                if (typeof this._returnValue == 'number') {
                    reV = String(this._returnValue);
                }
                reV = '';
            } else if (this._valueType == ValueType.Int) {
                if (typeof this._returnValue == 'string') {
                    reV = parseInt(this._returnValue);
                }
                reV = 0;
            } else if (this._valueType == ValueType.Float) {
                if (typeof this._returnValue == 'string') {
                    reV = parseFloat(this._returnValue);
                }
                reV = 0.0;
            } else if (this._valueType == ValueType.Object) {
                reV = {};
            } else if (this._valueType == ValueType.Bool) {
                reV = false;
            } else if (this._valueType == ValueType.Array) {
                reV = [];
            }
        }
        this._value[this._strKey] = reV;
        this._value = this._value[this._strKey];

        if (isRestoreValue) {
            this._value = this._originValue;
            this._returnValue = null;
        }
        return reV;
    }
}

/**
 * @description: 渲染table
 * @param infoData heder头部信息
 * @param data 数据
 * @return {*}
 * 例子：
 *
 const infoData = [
 { label: '房间名称', key: 'classRoomNum' ,width: 170},
 { label: '姓名', key: 'abnormalSalaryRate',width: 170 },
 { label: '进入时间', key: 'warnTime',width: 170 },
 ];
 data = [{ classRoomNum: 1, abnormalSalaryRate: 1, warnTime :2}];
 renderTable(infoData,data)
 */
export function renderTable(infoData, data) {
    const headerRender = (
        <div className="css-header-wrap">
            {infoData.map((item, index) => {
                return (
                    <span key={index} style={{ width: item.width + 'px' }}>
            {item.label}
          </span>
                );
            })}
        </div>
    );
    const containRender = (
        <div className="css-contain-wrap">
            {data &&
                data.map((ele, eIndex) => {
                    return (
                        <div key={eIndex}>
                            {infoData.map((item, index) => {
                                return (
                                    <span key={index} style={{ width: item.width + 'px' }}>
                    {ele[item.key]}
                  </span>
                                );
                            })}
                        </div>
                    );
                })}
        </div>
    );
    return (
        <>
            {headerRender}
            {containRender}
        </>
    );
}
/**
 * @description: echart循环显示toolTip
 * @param {*} fn 调用函数
 * @param {*} time 时间
 * @param {*} number 循环的最大值
 * @return {*}
 * 例子：
 new Loop(
 function (i) {
        myChart.dispatchAction({
          type: 'showTip',
          dataIndex: i,
          seriesIndex: 0
        });
      },
 1500,
 dataIn.length,
 chartDom
 );
 *
 */
export class Loop {
    constructor(fn, time, number, ele) {
        this.fn = fn;
        this.time = time;
        this.number = number;
        /* 是否进行跑动 */
        this.isRun = true;
        this.ele = ele;
        ele.addEventListener(
            'mousemove',
            function () {
                this.isRun = false;
            }.bind(this, this)
        );
        ele.addEventListener(
            'mouseleave',
            function () {
                this.isRun = true;
            }.bind(this, this)
        );
        this.toLoop();
    }
    toLoop() {
        let i = 0;
        const fn2 = () => {
            setTimeout(() => {
                if (this.isRun) {
                    this.fn(i);
                    i++;
                    if (i === this.number) {
                        i = 0;
                    }
                }
                fn2();
            }, this.time);
        };
        fn2();
    }
}
/**
 * @description: 阻止点击事件
 * @param excludeArr 可点击的类目列表
 * @return {*}
 * 例子：
 const clickPrevent = new PreventClick(['css-app-highestLevel-toolBox-lineSelection']); // 不要反复注册 建议在state里注册
 clickPrevent.beginListen();  // 开始监听
 clickPrevent.stopListen();   // 停止监听
 */

export class PreventClick {
    constructor(excludeArr = []) {
        this.excludeArr = excludeArr;
        this.preventHandler = this.handler();
    }
    handler() {
        const excludeArr = this.excludeArr;
        return e => {
            if (!excludeArr.some(item => e.target.className.includes(item))) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
    }
    beginListen() {
        document.addEventListener('click', this.preventHandler, true);
    }
    stopListen() {
        document.removeEventListener('click', this.preventHandler, true);
    }
}
/**
 * @description: 滚动加载更多
 * @param dom dom元素
 * @param handler 加载方法
 * @return {*}
 */
export class LoadMore {
    constructor(dom, handler) {
        this.dom = dom;
        this.beginListen = function () {
            let scrollTop = this.scrollTop; // 获取div滚动离顶部的距离
            let listHight = this.clientHeight; // 获取div自身的的高度
            let scrollHeight = this.scrollHeight; // 获取div滚动区域的高度
            if (scrollTop + listHight === scrollHeight) {
                handler();
            }
        };
        dom.addEventListener('scroll', this.beginListen, true);
    }
    stopListen() {
        this.dom.removeEventListener('scroll', this.beginListen, true);
    }
}
/**
 * @description: 合并url
 * @param {*} urlHeader url头部
 * @param {*} urlTail url尾部
 * @return {*}
 */
export function mergeUrl(urlHeader, urlTail) {
    let retUrl = '';
    if (urlHeader == null) {
        console.error('urlHeader is null!');
        return urlTail;
    } else {
        let lastChar = urlHeader.substr(urlHeader.length - 1, 1);
        let firstChar = urlTail.substr(0, 1);
        if (lastChar == '/' && firstChar == '/') {
            retUrl = urlHeader + urlTail.substr(1, urlTail.length);
        } else if (lastChar != '/' && firstChar != '/') {
            retUrl = urlHeader + '/' + urlTail;
        } else {
            retUrl = urlHeader + urlTail;
        }
    }

    return retUrl;
}

/**
 * @description: 长按类
 * @param {*} ele 长按的dom
 * @param {*} handle 触发函数
 * @param {*} delay 延时触发时间
 * @return {*}
 */
export class LongPress {
    constructor(ele, handle, delay = 200) {
        if (!ele) {
            return console.error('LongPress canot get element,ele is null');
        }
        this.ele = ele;
        this.handle = handle;
        this.delay = delay;
        this.timer = null;
        this.flag = false;

        this.mouseDownFunction = e => {
            if (e.button === 0) {
                /* 开始点击 */
                this.handle && this.handle();
                this.flag = true;
                this.timer = setInterval(() => {
                    if (this.flag) {
                        this.handle && this.handle();
                    }
                }, this.delay);
            }
        };
        this.mouseUpFunction = e => {
            if (e.button === 0) {
                clearInterval(this.timer);
                this.flag = false;
                /* 结束点击 */
            }
        };
        this.beginListen();
    }
    beginListen() {
        this.ele.addEventListener('mousedown', this.mouseDownFunction);
        this.ele.addEventListener('mouseup', this.mouseUpFunction);
    }
    stopListen() {
        this.ele.removeEventListener('mousedown', this.mouseDownFunction);
        this.ele.removeEventListener('mouseup', this.mouseUpFunction);
    }
}
/**
 * 解密
 * @param data
 * @returns {string}
 */
export function _decrypt(data) {
    //aes decrypt
    let key = CryptoJS.enc.Utf8.parse(aesKey);
    let ivKey = CryptoJS.enc.Utf8.parse(aesivKey);
    let options = {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };

    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, ivKey, options);
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

/**
 * 加密
 * @param data
 * @returns {string}
 */
export function _encrypt(data) {
    let encrypted = '';
    let key = CryptoJS.enc.Utf8.parse(aesKey);
    let ivKey = CryptoJS.enc.Utf8.parse(aesivKey);
    let options = {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };
    let srcs;
    if (typeof data == 'string') {
        srcs = CryptoJS.enc.Utf8.parse(data);
    } else if (typeof data == 'object') {
        //对象格式的转成json字符串
        const strData = JSON.stringify(data);
        srcs = CryptoJS.enc.Utf8.parse(strData);
    }
    encrypted = CryptoJS.AES.encrypt(srcs, ivKey, options);
    return encrypted.ciphertext.toString();
}

export function getCurrentUrl() {
    return `${process.env.REACT_APP_NODE_API || ''}/`;
}

/**
 * @description: 过滤树级
 * @param {Array} treeData 树级数据
 * @param {Function} filterFunc 过滤函数
 * @param {Object} options {children:"child_node"}
 * @return {Array} filterTreeData
 * 例子：
 * filterTreeData(treeData, node => node.title.includes('child1'))
 */
export function filterTreeData(treeData, filterFunc, options = null) {
    let filesName = {
        children: 'children',
    };
    if (options) {
        for (let key in options) {
            filesName[key] = options[key];
        }
    }
    return treeData.reduce((acc, node) => {
        // 如果节点符合条件，则加入到过滤后的数组中
        let nodeChildren = node[filesName.children];
        if (filterFunc(node)) {
            const filteredNode = { ...node };
            // 如果有子节点，递归过滤子节点
            if (nodeChildren && nodeChildren.length) {
                const filteredChildren = filterTreeData(nodeChildren, filterFunc, filesName);
                if (filteredChildren.length) {
                    filteredNode[filesName.children] = filteredChildren;
                } else {
                    filteredNode[filesName.children] = undefined;
                }
            }
            acc.push(filteredNode);
        } else {
            // 如果不符合条件，递归过滤子节点
            if (nodeChildren && nodeChildren.length) {
                const filteredChildren = filterTreeData(nodeChildren, filterFunc, filesName);
                if (filteredChildren.length) {
                    acc.push({
                        ...node,
                        [filesName.children]: filteredChildren,
                    });
                }
            }
        }
        return acc;
    }, []);
}

export function formatJson(json, options) {
    let reg = null, formatted = '', pad = 0, PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false;
    options.spaceAfterColon = options.spaceAfterColon === false ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    json.split('\r\n').forEach(function (node, index) {
        var i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });
    return formatted;
}


export function JsonToForm(jsonData)
{
    let formData = new FormData();
    for (let key in jsonData) {
        formData.append(key, jsonData[key]);
    }
    return formData;

}

