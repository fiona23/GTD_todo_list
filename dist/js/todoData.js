/*!GTD_Tool 2015-06-29
* created by fiona23
*/
define([],function(){var a=window.localStorage,b={"000":{id:"000",title:"使用说明",date:"2015/6/27",description:"欢迎使用fiona的todo应用\n左侧可以添加主目录，单击右键添加和删除子目录\n也可以点击主目录旁边的加号添加子目录",className:"default",code:"1"}};return a.getItem("todoData")||a.setItem("todoData",JSON.stringify(b)),b=JSON.parse(a.getItem("todoData"))});