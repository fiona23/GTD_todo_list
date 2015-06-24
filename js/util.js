var util = function (selector, context) {
    return new Util(selector, context)
}

var Util = function (selector, context) {
    if (typeof selector === 'string') {
        for (i in $(selector, context)){
            this.push($(selector, context)[i]);
        }
        return this;
    } else if (selector.nodeType){
        return this.push(selector);
    }
}

Util.prototype = {
    length: 0,
    push: [].push,
    sort: [].sort,
    splice: [].splice,
    hasClass: function (className) {
        var classNames = this[0].className;
        if(!classNames) {
            return false;
        }
        classNames = classNames.split(/\s+/);
        for (var i = classNames.length - 1; i >= 0; i--) {
            if (classNames[i] === className) {
                return true;
            };                
        }
        return false;
    },
    // 为dom增加一个样式名为newClassName的新样式
    addClass: function (newClassName) {

        if (!this.hasClass(newClassName)) {
            this[0].className += " "+ newClassName
            this[0].className = util.trim(this[0].className);
        };
        return this;
    },

    // 移除dom中的样式oldClassName
    removeClass: function (oldClassName) {
         if (this.hasClass(oldClassName)) {
            this[0].className = this[0].className.replace(oldClassName,"");
            this[0].className = util.trim(this[0].className);
         };
         return this;
    },
    append: function (ele) {
        this[0].appendChild(ele)
    },
    eq: function (k) {
        var newArr = util.cloneObject(this);
        newArr.length = this.length;
        newArr.splice(0, k);
        newArr.splice(1, newArr.length);
        return newArr;
    }
}

util.trim = function (str) {
    if (this.istype(str) !== 'String'){return false;}
    var whitespace = "\t\n\r "
    var newstr = "";
    //去除头的空格
    for (var i=0; i<str.length;i++){
        //判断第一个不是空格的字符
        if (whitespace.indexOf(str.charAt(i)) == -1){
            newstr = str.slice(i);
            break;
        }
    }
    //去除尾的空格
    for (var j=newstr.length; j>0;j--){
        //判断最后一个不是空格的字符
        if(whitespace.indexOf(newstr.charAt(j)) == -1){
            newstr = newstr.slice(0,j+1);
            break;
        }
    }
    return newstr;
}


util.isFunction = function (fn) {
    if(typeof fn == 'function'){
        return true;
    } else {
        return false;
    }
}

util.isArray = function (arr) {
    var result = arr instanceof Array;
    return result;
}

util.isDate = function (date) {
    return date instanceof Date;
}

util.isRegExp = function (regexp) {
    return regexp instanceof RegExp;
}

util.istype = function(ele) {
    if(ele===null) return "Null";
    if(ele===undefined) return "Undefined";
    return Object.prototype.toString.call(ele).slice(8,-1);
}

//深度克隆
util.cloneObject = function (src) {
    var srcType = this.istype(src);
    var result,k;
    //判断需要克隆的对象是否是Object类型或者Array类型
    if(srcType === "Object" || srcType === "Array"){
        result = srcType === "Object"? {}:[];
        for(k in src){
            result[k] = this.cloneObject(src[k])
        }
        return result;
    } else {     //普通类型直接浅复制
        result = src;
        return result;
    }

}

util.uniqArray = function (arr) {
    var length = arr.length;
    var newArr = [];
    var k;//标记是否出现相同元素
    for (var i=0; i<length; i++){
        k = true;
        for(var j=0; j<i; j++){
            if (arr[i] == newArr[j]){
                k = false;
            }
        }
        if(k === true){
            newArr.push(arr[i])
        }
    }
    return newArr;
}





// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
util.each = function (arr, fn) {
    //  if(!isArray(arr)){
    //     return false;
    // }
    // if(!isFunction(fn)){
    //     return false;
    //}
    for (var i=0; i<arr.length; i++){
        fn.call(this, arr[i], i)
    }
}


// 获取一个对象里面第一层元素的数量，返回一个整数
       
util.getObjectLength = function (obj) {
    var key,
    a=0;
    for (key in obj){
        a += 1
    }
    return a;
}


// 判断是否为邮箱地址
util.isEmail = function (emailStr) {
    var emailTest = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]$/;
    return emailTest.test(emailStr);
}

// 判断是否为手机号
util.isMobilePhone = function (phone) {
    var phoneTest = /^1[0-9]{10}$/;
    return phoneTest.test(phone);
}




// 判断siblingNode和dom是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode == siblingNode.parentNode;
}

// 获取dom相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    return {x: element.scrollLeft, y:element.scrollTop}
}


// 给一个dom绑定一个针对event事件的响应，响应函数为listener
util.on = function(selector, event, listener){
    //如果输入的是选择器，就转为dom
    if (typeof selector === 'string') {
        selector = $(selector)[0]
    }
    if (selector.addEventListener) {
        selector.addEventListener(event, listener, false);
    } else if(selector.attachEvent) {
        selector.attachEvent("on" + event, listener);
    } else {
        selector["on" + event] = listener;
    }
}


// 例如：
//function clicklistener(event) {
    
//}

// 移除dom对象对于event事件发生时执行listener的响应，当listener为空时，移除所有响应函数
util.un = function(selector, event, listener){
    if (typeof selector === 'string') {
        selector = $(selector)[0]
    }
    if(listener){
        if (selector.removeEventListener) {
            selector.removeEventListener(event, listener, false);
        } else {
            selector.DetachEvent(event, listener);
        }
    } else {
        //通过复制节点移除所有响应函数
        var newElement = selector.cloneNode(true)
        selector.parentNode.replaceChild(newElement, selector);
    }
}

// 实现对click事件的绑定
util.click = function(selector, listener){
    util.on(selector,"click", listener)
}

// 实现对于按Enter键时的事件绑定
util.enter = function(selector, listener){
    util.on(selector,"onkeydown", function () {
        if(keyCode == 13){
            listener()
        } else {
            return false;
        }
    })
}



// 先简单一些
function delegateEvent(selector, tag, eventName, listener) {
    util.on(selector, eventName, function (event) {
        var e = event || window.event;
        target = e.srcElement? e.srcElement : e.target;
        if(target.tagName.toLowerCase() === tag){
            //把被点击的元素和事件触发者传入
            listener(target, e);
        }
    })
}

util.delegate = delegateEvent;


// 判断是否为IE浏览器，返回-1或者版本号

function isIE() {

    var ua = navigator.userAgent;
    if (/MSIE ([^;]+)/.test(ua)) {
        return RegExp["$1"]
    } else {
        return -1;
    }
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
    var cookieText = encodeURIComponent(cookieName) + "=" + encodeURIComponent(cookieValue);
    if (expiredays instanceof Date){
        cookieText += "; expires=" + expiredays.toGMTString();
    }
}

// 获取cookie值
function getCookie(cookieName) {
    var cookieName = encodeURIComponent(cookieName) + "=",
        cookieStart = document.cookie.indexOf(cookieName);
        cookieValue = null;
    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf(";", cookieStart);
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
    }s
    return cookieValue;
}

// 
function ajax(url, options) {
    // your implement
    if (!options.type) {
        options.type = "post"
    };
    var xhr = new XMLHttpRequest();
    if (options.type.toLowerCase() == "get") {
        url += (url.indexOf("?") == -1 ? "?" : "&");
        //记得改格式
        url += encodeURIComponent(options.data) + "=" + encodeURIComponent(options.data);
        xhr.open(options.type, url, true);
        xhr.send();
    } else if (options.type.toLowerCase() == "post") {
        xhr.open(options.type, url, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
        xhr.send(options.data);
    }
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            options.onsuccess(xhr.responseText, xhr)
        } else {
            options.onfail(xhr.responseText, xhr);
        }
        };
    }
}



function $(selector, context) {
    var idReg = /^#([\w_\-]+)/;
    var classReg = /^\.([\w_\-]+)/;
    var tagReg = /^\w+$/i;
    // [data-log]
    // [data-log="test"]
    // [data-log=test]
    // [data-log='test']
    var attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

    // 不考虑'>' 、`~`等嵌套关系
    // 父子选择器之间用空格相隔
    var context = context || document;

    function blank() {}
    function hasClass(element, className) {
        var classNames = element.className;
        if (!classNames) {
            return false;
        }
        classNames = classNames.split(/\s+/);
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] === className) {
                return true;
            }
        }
        return false;
    }

    function direct(part, actions) {
        actions = actions || {
            id: blank,
            className: blank,
            tag: blank,
            attribute: blank
        };
        var fn;
        var params = [].slice.call(arguments, 2);
        // id
        if (result = part.match(idReg)) {
            fn = 'id';
            params.push(result[1]);
        }
        // class
        else if (result = part.match(classReg)) {
            fn = 'className';
            params.push(result[1]);
        }
        // tag
        else if (result = part.match(tagReg)) {
            fn = 'tag';
            params.push(result[0]);
        }
        // attribute
        else if (result = part.match(attrReg)) {
            fn = 'attribute';
            var tag = result[1];
            var key = result[2];
            var value = result[4];
            params.push(tag, key, value);
        }
        return actions[fn].apply(null, params);
    }

    function find(parts, context) {
        var part = parts.pop();

        var actions = {
            id: function (id) {
                return [
                    document.getElementById(id)
                ];
            },
            className: function (className) {
                var result = [];
                if (context.getElementsByClassName) {
                    result = context.getElementsByClassName(className)
                }
                else {
                    var temp = context.getElementsByTagName('*');
                    //console.log(temp)
                    for (var i = 0, len = temp.length; i < len; i++) {
                        var node = temp[i];
                        if (hasClass(node, className)) {
                            result.push(node);
                        }
                    }
                }
                return result;
            },
            tag: function (tag) {
                return context.getElementsByTagName(tag);
            },
            attribute: function (tag, key, value) {
                var result = [];
                var temp = context.getElementsByTagName(tag || '*');

                for (var i = 0, len = temp.length; i < len; i++) {
                    var node = temp[i];
                    if (value) {
                        var v = node.getAttribute(key);
                        (v === value) && result.push(node);
                    }
                    else if (node.hasAttribute(key)) {
                        result.push(node);
                    }
                }
                return result;
            }
        };

        var ret = direct(part, actions);

        // to array
        ret = [].slice.call(ret);

        return parts[0] && ret[0] ? filterParents(parts, ret) : ret;
    }

    function filterParents(parts, ret) {
        var parentPart = parts.pop();
        var result = [];

        for (var i = 0, len = ret.length; i < len; i++) {
            var node = ret[i];
            var p = node;

            while (p = p.parentNode) {
                var actions = {
                    id: function (el, id) {
                        return (el.id === id);
                    },
                    className: function (el, className) {
                         return hasClass(el, className);
                    },
                    tag: function (el, tag) {
                        return (el.tagName.toLowerCase() === tag);
                    },
                    attribute: function (el, tag, key, value) {
                        var valid = true;
                        if (tag) {
                            valid = actions.tag(el, tag);
                        }
                        valid = valid && el.hasAttribute(key);
                        if (value) {
                            valid = valid && (value === el.getAttribute(key))
                        }
                        return valid;
                    }
                };
                var matches = direct(parentPart, actions, p);

                if (matches) {
                    break;
                }
            }

            if (matches) {
                result.push(node);
            }
        }

        return parts[0] && result[0] ? filterParents(parts, result) : result;
    }

    var result = find(selector.split(/\s+/), context);
    return result;
}

if ( typeof define === "function" && define.amd ) {
    define(function() {
        return util;
    });
}
