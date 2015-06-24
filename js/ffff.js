function $(selector) {
    if(/^\#[^\#\.\=]+$/.test(selector)){//排除嵌套的情况
        //id选择器
        selector = selector.replace('#', '').replace('/\.[a-zA-Z0-9\-]/','');
        return document.getElementById(selector)
    } else if(/^\.[^\#\.\=]+$/.test(selector)){//排除嵌套的情况
        //class选择器
        selector = selector.replace('.', '')
        var oClass = document.getElementsByTagName('*');
        var classResult = []
        oClass = document.getElementsByTagName('*')
        for (var i=0; i<oClass.length; i++){
            var classArr = oClass[i].className.split(" ")
            for (var j = classArr.length - 1; j >= 0; j--) {
                if (classArr[j] === selector) {
                    classResult.push(oClass[i]);
                    break;
                }
            }
        }
        return classResult[0];

    } else if (/\[[a-zA-Z0-9\-\=]+\]/.test(selector)){
        if (/\=/.test(selector)){ 
            var oAttrValue = selector.slice(selector.search(/\=/)+1, -1);
            selector = selector.replace('\[', '').replace(/\=+[\w\]]+/, '');
            var oAttr = document.getElementsByTagName('*');
            var oAttrResult = [];
            for (var j=0; j<oAttr.length; j++){
                if (oAttr[j].getAttribute(selector) == oAttrValue ){
                    oAttrResult.push(oAttr[j])
                }
            }
            return oAttrResult[0];
        } else {
            //去除中括号
            selector = selector.replace(/\[([^\[\]]*)\]/, '$1');
            var oAttr = document.getElementsByTagName('*');
            var oAttrResult = [];
            for (var j=0; j<oAttr.length; j++){
                if (oAttr[j].getAttribute(selector)){
                    oAttrResult.push(oAttr[j])
                }
            }
            return oAttrResult[0];
        } 
    // } else if(trim(selector).split(" ").length > 1){
    //         var reAttr = trim(selector).split(/\s+/)//将每个选择器分割成数组
    //         var lastSelector = reAttr[reAttr.length-1].replace(".","")//去掉最后一个class选择器的点
    //         var oAttrResult = getByClass(lastSelector)//数组保存所有满足最后一个class选择器的dom
    //         for (var j=0; j<oAttrResult.length; j++){
    //             parentFilter(oAttrResult[j], reAttr)
    //         }
    }else {
            return document.getElementsByTagName(selector)[0]
    }
}