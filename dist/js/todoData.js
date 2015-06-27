/*!GTD Tool 2015-06-27
* created by fiona23
*/
define([],function(){var a=window.localStorage,b={"000":{id:"000",title:"使用说明",date:"2015/6/6",description:"欢迎使用fiona的todo应用",className:"default",code:"1"}};return a.getItem("todoData")||a.setItem("todoData",JSON.stringify(b)),b=JSON.parse(a.getItem("todoData"))});