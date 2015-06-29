/*!GTD_Tool 2015-06-29
* created by fiona23
*/
define(["util","defaults","categoryData","todoData"],function(a,b,c,d){var e=window.localStorage,f={1:"#pending",2:"#completed",3:"#all"},g={showCategory:function(){function d(b){a.on(b,"click",function(){for(var c=k.length-1;c>=0;c--)a(k[c]).removeClass("active");a(b).addClass("active");b.className.split(" ")[0];a(".task-wrapper")[0].innerHTML='<div id="all"></div><div id="pending"></div><div id="completed"></div>',g.showTaskList(),g.showTaskDetail(),a.device.init()&&a.device.slideRight(a("aside")[0],a("section")[0])})}a("#"+b.cateL1Li)[0].innerHTML="";for(var e in c){var f=document.createElement("li");"默认分类"===c[e].name?f.innerHTML='<div class="category-name"><i class="fa fa-folder-open"></i>'+c[e].name+'(<span class="taskNumDivi"></span>)<i data-category= "'+c[e].id+'" class="fa fa-plus"></i></div>':f.innerHTML='<div class="category-name" data-category='+c[e].id+'><i class="fa fa-folder-open"></i>'+c[e].name+'(<span class="taskNumDivi"></span>)<i data-category= "'+c[e].id+'" class="fa fa-plus"></i><p class="'+b.delCateBtn+'"></p></div>',f.className=b.cateL1+" "+c[e].id,a(".category-name",f).addClass(c[e].id),a("#"+b.cateL1Li).append(f);var h=document.createElement("ol");if(h.className=b.cateL2Li,f.appendChild(h),c[e].child){for(var i in c[e].child){var j=document.createElement("li");j.className=c[e].child[i].id+" "+b.cateL2+" "+c[e].id,j.innerHTML='<i class="fa fa-file-o"></i>'+c[e].child[i].name,j.setAttribute("data-category",c[e].id),h.appendChild(j)}a("#"+b.allTaskNum)[0].innerHTML=a("."+b.cateL2).length}a("."+b.cateL2,f)[0]?a(".taskNumDivi",f)[0].innerHTML=a("."+b.cateL2,f).length:a(".taskNumDivi",f)[0].innerHTML=0}a("."+b.cateL2).addClass("active");var k=a("."+b.cateL2);a.each(k,d)},showTaskList:function(c){function d(c){var d=a(f[i[c].code])[0],e=document.createElement("li");e.id=i[c].id,e.innerHTML=i[c].title,"1"===i[c].code?a(e).addClass(b.pending):"2"===i[c].code&&a(e).addClass(b.completed);var g,j=a("."+b.oneDayTask,a(f[1])[0]),k=a("."+b.oneDayTask,a(f[2])[0]),l=a("."+b.pending),m=a("."+b.completed);"#"+d.id===f[1]?(g=!l[0],taskDateLi=j):"#"+d.id===f[2]&&(g=!m[0],taskDateLi=k),h(d,e,g,taskDateLi)}function g(c){var d=a("#all")[0],e=document.createElement("li");e.id=i[c].id,e.innerHTML=i[c].title,a(e).addClass("all"),"1"===i[c].code?a(e).addClass("all-pending"):a(e).addClass("all-completed");var f=a("."+b.oneDayTask,a("#all")[0]),g=a(".all"),j=!g[0];taskDateLi=f,h(d,e,j,taskDateLi)}function h(c,d,e){if(e){var f=document.createElement("div");c.appendChild(f),f.innerHTML="<p>"+i[k].date+"</p>",a(f).addClass(b.oneDayTask),a(f).addClass(i[k].className),f.appendChild(document.createElement("ol")),f.getElementsByTagName("ol")[0].appendChild(d)}else for(var g=taskDateLi.length,h=g-1;h>=0;h--){var j=new RegExp(i[k].date);if(j.test(taskDateLi[h].innerHTML)){taskDateLi[h].getElementsByTagName("ol")[0].appendChild(d);break}if(0==h){var f=document.createElement("div");c.appendChild(f),f.innerHTML="<p>"+i[k].date+"</p>",a(f).addClass(b.oneDayTask),f.appendChild(document.createElement("ol")),f.getElementsByTagName("ol")[0].appendChild(d)}}}a(f[1])[0].innerHTML="",a(f[2])[0].innerHTML="",a("#all")[0].innerHTML="";var c=a(".active",a("#"+b.cateL1Li)[0])[0].className.split(" ")[0],i=JSON.parse(e.getItem("todoData")),j=0;for(var k in i)i[k].className===c&&(d(k),g(k),j=1);j||(a("#all")[0].innerHTML='<p class="notask-note">暂时还没有任务哦，点击下方添加任务</p>')},showTaskDetail:function(){a("#"+b.taskName)[0].value="",a("#"+b.datepicker)[0].value="",a("#"+b.taskDescription)[0].value="";var c=a(".active",a("#"+b.cateL1Li)[0])[0].className.split(" ")[0],d=JSON.parse(e.getItem("todoData"));for(var f in d)if(d[f].className===c){a("#task-name-show")[0].innerHTML=d[f].title,a("#date-show")[0].innerHTML=d[f].date;var g=d[f].description;a("#description-show")[0].innerHTML="<pre>"+g+"</pre>",a("#"+b.taskName)[0].style.display="none",a("#"+b.datepicker)[0].style.display="none",a("#"+b.taskDescription)[0].style.display="none",a("#"+b.taskName)[0].setAttribute("data-id",d[f].id);break}},clickTask:function(){function c(c,f){a(".active-task")[0]&&a(".active-task").removeClass("active-task"),a(c).addClass("active-task");var g=c.id;d=JSON.parse(e.getItem("todoData")),a("#task-name-show")[0].innerHTML=d[g].title,a("#date-show")[0].innerHTML=d[g].date,a("#description-show")[0].innerHTML="<pre>"+d[g].description+"</pre>",a("#"+b.taskName)[0].setAttribute("data-id",g),a.device.init()&&a.device.slideRight(a("section")[0],a("article")[0])}a.delegate("section","li","click",c)},setOverlayCss:function(a){var b=parseInt(document.documentElement.clientWidth),c=parseInt(document.documentElement.clientHeight),d=parseInt(window.getComputedStyle(a,null).getPropertyValue("width")),e=parseInt(window.getComputedStyle(a,null).getPropertyValue("height"));a.style.left=(b-d)/2+"px",a.style.top=(c-e)/2+"px"},slide:function(b,c,d,e,f){var g=(window.innerWidth,b.changedTouches[0]),h=g.clientX-f.x;a.translate(c,h+"px",0,0),a.transition(c,"-webkit-transform","0s"),h>0?d&&(a.transition(d,"-webkit-transform","0s"),a.translate(d,parseInt(-innerWidth+h)+"px",0,0)):0>h&&e&&(a.transition(e,"-webkit-transform","0s"),a.translate(e,parseInt(innerWidth+h)+"px",0,0))}};return g});