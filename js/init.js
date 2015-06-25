define(['util', 'defaults', 'categoryData'], function ($, defaults, categoryData) {
        var storage = window.localStorage;
        var data = {};
        if (storage.getItem("todoData")) {
            data = JSON.parse(storage.getItem("todoData"));
        }
        var codes = {
            "1" : "#pending",
            "2" : "#completed",
            '3' : '#all'
        };
        var init =  {
        //show category
        showCategory: function  () {
            $('#'+defaults.cateL1Li)[0].innerHTML = ''
            for (var params in categoryData) {
                var cateLi = document.createElement('li');
                if (categoryData[params]['name'] === '默认分类') {
                    cateLi.innerHTML = '<div class="category-name"><i class="fa fa-folder-open"></i>'+categoryData[params]['name']
                    + '(<span class="taskNumDivi"></span>)</div>' ;
                }
                else {
                    cateLi.innerHTML = '<div class="category-name"><i class="fa fa-folder-open"></i>'+categoryData[params]['name']
                    + '(<span class="taskNumDivi"></span>)<p class="'
                    +defaults.delCateBtn+'"></p></div>';
                }
                cateLi.className = defaults.cateL1 + " " + categoryData[params]['id'];
                $('.category-name', cateLi).addClass(categoryData[params]['id'])
                $('#'+defaults.cateL1Li).append(cateLi)
                var ol = document.createElement('ol');
                ol.className = defaults.cateL2Li;
                cateLi.appendChild(ol);
                //显示子类
                if (categoryData[params]['child']) {
                    console.log(categoryData[params]['child'])
                    for (var childParams in categoryData[params]['child']){
                        var newCateL2 = document.createElement('li');
                        newCateL2.className = categoryData[params]['child'][childParams]['id'] + ' '
                        + defaults.cateL2 + ' ' + categoryData[params]['id'];
                        newCateL2.innerHTML = '<i class="fa fa-file-o"></i>'+categoryData[params]['child'][childParams]['name'] ;
                        ol.appendChild(newCateL2);
                        console.log(newCateL2)
                    }
                    //show amount of tasks
                    $('#'+defaults.allTaskNum)[0].innerHTML = $('.'+defaults.cateL2).length;
                }
                if ($('.'+defaults.cateL2, cateLi)[0]) {
                    $('.taskNumDivi', cateLi)[0].innerHTML = $('.'+defaults.cateL2, cateLi).length
                } else {
                    $('.taskNumDivi', cateLi)[0].innerHTML = 0;
                }
            };
           
                $('.'+defaults.cateL2).addClass('active')
                var allTask = $('.'+defaults.cateL2);
                //add taskClick method to all task
                $.each(allTask, taskClick);

                function taskClick (ele) {
                    $.on(ele, 'click', function () {
                        //remove all objects' 'active' class
                        for (var i = allTask.length - 1; i >= 0; i--) {
                            $(allTask[i]).removeClass('active')
                        };
                        //sub category click hightlight
                        $(ele).addClass('active')
                        var choosedClass = ele.className.split(' ')[0];
                        $('.task-wrapper')[0].innerHTML = '<div id="all"></div><div id="pending"></div><div id="completed"></div>';
                        init.showTaskList();
                        //显示该分类下第一个任务
                        init.showTaskDetail();

                    })
                }
        },
        
        //show tasklist
        showTaskList: function (choosedClass) {
            //clear task
            $(codes['1'])[0].innerHTML = '';
            $(codes['2'])[0].innerHTML = '';
            console.log($('#all')[0].innerHTML)
            var choosedClass = $('.active', $('#'+defaults.cateL1Li)[0])[0].className.split(' ')[0];
            var _data = JSON.parse(storage.getItem('todoData'))
            for (var params in _data){
                //get which category choosed
                if (_data[params]['className'] === choosedClass) {
                    appendToCP(params)
                    appendToAll(params)
                }
            }
            function appendToCP (params) {
                var parent = $(codes[_data[params]['code']])[0];
                //taskDetail is each task
                var taskDetail = document.createElement('li');
                taskDetail.id = _data[params]['id'];
                taskDetail.innerHTML = _data[params]['title'];
                if (_data[params]['code'] === '1') {
                    $(taskDetail).addClass(defaults.pending)
                }
                else if (_data[params]['code'] === '2'){
                    $(taskDetail).addClass(defaults.completed)
                }
                //get all task list by date
                var pendingTaskDateLi = $('.'+defaults.oneDayTask, $(codes['1'])[0]);
                var completedTaskDateLi = $('.'+defaults.oneDayTask, $(codes['2'])[0]);
                //判断pending 和 completed是否都存在
                var pendingTask = $('.' + defaults.pending);
                var completedTask = $('.' + defaults.completed);
                var condition;
                if ('#'+parent.id === codes['1']) {
                    condition = !pendingTask[0];
                    taskDateLi = pendingTaskDateLi;
                } else if ('#'+parent.id === codes['2']){
                    condition = !completedTask[0];
                    taskDateLi = completedTaskDateLi;
                }
                //如果还没有任务就先创建第一个任务
                createTaskDiv(parent, taskDetail, condition, taskDateLi)
                
            }
            function appendToAll (params) {
                var parent = $('#all')[0];
                var taskDetail = document.createElement('li');
                taskDetail.id = _data[params]['id'];
                taskDetail.innerHTML = _data[params]['title'];
                $(taskDetail).addClass('all')
                var allTaskDateLi = $('.'+defaults.oneDayTask, $('#all')[0]);
                var allTask = $('.all');
                var condition = !allTask[0];
                console.log(condition)
                taskDateLi = allTaskDateLi;
                createTaskDiv(parent, taskDetail, condition, taskDateLi)

            }
            function createTaskDiv (parent, taskDetail, condition) {
                if (condition) {
                    var newDayTask = document.createElement('div');
                    parent.appendChild(newDayTask);
                    //create p->date
                    newDayTask.innerHTML = '<p>' + _data[params]['date'] + '</p>';
                    $(newDayTask).addClass(defaults.oneDayTask);
                    $(newDayTask).addClass(_data[params]['className']);
                    newDayTask.appendChild(document.createElement('ol'))
                    newDayTask.getElementsByTagName('ol')[0].appendChild(taskDetail)
                } else {
                    for (var length = taskDateLi.length, i = length - 1; i >= 0; i--) {
                        var dateText = new RegExp(_data[params]['date']);
                        //if date exsit, add task to this div
                        if (dateText.test(taskDateLi[i].innerHTML)) {
                            taskDateLi[i].getElementsByTagName('ol')[0].appendChild(taskDetail);
                            break;
                        }
                        //if date doesnt exsit, create
                        else if(i==0) {
                                var newDayTask = document.createElement('div');
                                parent.appendChild(newDayTask);
                                newDayTask.innerHTML = '<p>' + _data[params]['date'] + '</p>';
                                $(newDayTask).addClass(defaults.oneDayTask);
                                newDayTask.appendChild(document.createElement('ol'));
                                newDayTask.getElementsByTagName('ol')[0].appendChild(taskDetail);
                        }
                    }
                }
            }
        },
        
        //show task detail
        showTaskDetail: function () {
            //如果data为空
            $('#'+defaults.taskName)[0].value = '';
            $('#'+defaults.datepicker)[0].value = '';
            $('#'+defaults.taskDescription)[0].value = '';
            //get which category choosed
            var choosedClass = $('.active', $('#'+defaults.cateL1Li)[0])[0].className.split(' ')[0];
            var _data = data;
            for (var params in _data){
                if (_data[params]['className'] === choosedClass) {
                    $('#'+defaults.taskName)[0].className = _data[params]['id'];
                    $('#'+defaults.taskName)[0].value = _data[params]['title'];
                    $('#'+defaults.datepicker)[0].value = _data[params]['date'];
                    $('#'+defaults.taskDescription)[0].value = _data[params]['description'];
                    $('#'+defaults.taskName)[0].disabled = 'disabled';
                    $('#'+defaults.datepicker)[0].disabled = 'disabled';
                    $('#'+defaults.taskDescription)[0].disabled = 'disabled';
                    break;
                }
            }
            
        },

        // delegate click show task
        clickTask: function () {
            $.delegate('section', 'li', 'click', showClickTask);
            function showClickTask (target, e) {
                if ($('.active-task')[0]) {
                    $('.active-task').removeClass('active-task')
                }
                $(target).addClass('active-task')
                var id = target.id;
                data = JSON.parse(storage.getItem("todoData"));
                $('#'+defaults.taskName)[0].value = data[id]['title'];
                $('#'+defaults.datepicker)[0].value = data[id]['date'];
                $('#'+defaults.taskDescription)[0].value = data[id]['description'];
                $('#'+defaults.taskName)[0].className = id;
            }
        }
    }//init  ends
    
    return init;
})