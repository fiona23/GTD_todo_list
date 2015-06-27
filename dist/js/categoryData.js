/*!GTD_Tool 2015-06-27
* created by fiona23
*/
define([],function(){var a=window.localStorage,b={};return a.getItem("categoryData")?b=JSON.parse(a.getItem("categoryData")):(b.category0={id:"category0",name:"默认分类",child:{"default":{id:"default",name:"使用说明"}}},a.setItem("categoryData",JSON.stringify(b))),b});