define(['util', 'defaults', 'categoryData', 'todoData'], function ($, defaults, categoryData, data) {
        var storage = window.localStorage;
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
                    cateLi.innerHTML = '<div class="category-name">'
                    + '<i class="fa fa-folder-open"></i>'+categoryData[params]['name']
                    + '(<span class="taskNumDivi"></span>)'
                    + '<i data-category= "' + categoryData[params]['id'] + '" class="fa fa-plus"></i></div>';
                }
                else {
                    //<div>category名称 + x</div>
                    cateLi.innerHTML = '<div class="category-name" '
                    +'data-category='+ categoryData[params]['id'] +'>'
                    +'<i class="fa fa-folder-open"></i>'
                    + categoryData[params]['name']
                    + '(<span class="taskNumDivi"></span>)'
                    + '<i data-category= "' + categoryData[params]['id'] + '" class="fa fa-plus"></i>'
                    + '<p class="'+defaults.delCateBtn+'"></p></div>';
                }
                cateLi.className = defaults.cateL1 + " " + categoryData[params]['id'];
                $('.category-name', cateLi).addClass(categoryData[params]['id'])
                $('#'+defaults.cateL1Li).append(cateLi)
                var ol = document.createElement('ol');
                ol.className = defaults.cateL2Li;
                cateLi.appendChild(ol);
                //显示子类
                if (categoryData[params]['child']) {
                    for (var childParams in categoryData[params]['child']){
                        var newCateL2 = document.createElement('li');
                        newCateL2.className = categoryData[params]['child'][childParams]['id'] + ' '
                        + defaults.cateL2 + ' ' + categoryData[params]['id'];
                        newCateL2.innerHTML = '<i class="fa fa-file-o"></i>'+categoryData[params]['child'][childParams]['name'];
                        newCateL2.setAttribute('data-category', categoryData[params]['id'])
                        ol.appendChild(newCateL2);
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
                        if ($.device.init()) {
                            $.device.slideRight($('aside')[0], $('section')[0]);
                        }

                    })
                }
        },
        
        //show tasklist
        showTaskList: function (choosedClass) {
            //clear task
            $(codes['1'])[0].innerHTML = '';
            $(codes['2'])[0].innerHTML = '';
            $('#all')[0].innerHTML = '';
            var choosedClass = $('.active', $('#'+defaults.cateL1Li)[0])[0].className.split(' ')[0];
            var _data = JSON.parse(storage.getItem('todoData'));
            var exsit = 0;
            for (var params in _data){
                //get which category choosed
                if (_data[params]['className'] === choosedClass) {
                    appendToCP(params)
                    appendToAll(params)
                    exsit = 1;
                }
            }
            if(!exsit) {
                $('#all')[0].innerHTML = '<p class="notask-note">暂时还没有任务哦，点击下方添加任务</p>';
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
                createTaskDiv(parent, taskDetail, condition, taskDateLi);
            }
            function appendToAll (params) {
                var parent = $('#all')[0];
                var taskDetail = document.createElement('li');
                taskDetail.id = _data[params]['id'];
                taskDetail.innerHTML = _data[params]['title']
                + '<span class="delete-task" data-id='+ _data[params]['id'] +'><span>';
                $(taskDetail).addClass('all');
                if (_data[params]['code'] === '1') {
                    $(taskDetail).addClass('all-pending');
                } else {
                    $(taskDetail).addClass('all-completed');
                }
                var allTaskDateLi = $('.'+defaults.oneDayTask, $('#all')[0]);
                var allTask = $('.all');
                var condition = !allTask[0];
                taskDateLi = allTaskDateLi;
                createTaskDiv(parent, taskDetail, condition, taskDateLi)
            }
            function createTaskDiv (parent, taskDetail, condition) {
                if (condition) {
                    var newDayTask = document.createElement('div');
                    parent.appendChild(newDayTask);
                    //create p->date
                    newDayTask.innerHTML = '<p>'
                    +  _data[params]['date'] + '</p>';
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
            var _data = JSON.parse(storage.getItem('todoData'));
            for (var params in _data){
                if (_data[params]['className'] === choosedClass) {
                    $('#task-name-show')[0].innerHTML = _data[params]['title'];
                    $('#date-show')[0].innerHTML = _data[params]['date'];
                    var description = _data[params]['description'];
                    $('#description-show')[0].innerHTML = '<pre>' + description + '</pre>';
                    $('#'+defaults.taskName)[0].style.display = 'none';
                    $('#'+defaults.datepicker)[0].style.display = 'none';
                    $('#'+defaults.taskDescription)[0].style.display = 'none';
                    $('#'+defaults.taskName)[0].setAttribute('data-id', _data[params]['id']);
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
                $('#task-name-show')[0].innerHTML = data[id]['title'];
                $('#date-show')[0].innerHTML = data[id]['date'];
                $('#description-show')[0].innerHTML = '<pre>' + data[id]['description'] + '</pre>';
                $('#'+defaults.taskName)[0].setAttribute('data-id', id);
                if ($.device.init()) {
                    $.device.slideRight($('section')[0], $('article')[0]);
                }
            }
        },

        setOverlayCss: function (ele) {
            var bodyWidth = parseInt(document.documentElement.clientWidth);
            var bodyHeight = parseInt(document.documentElement.clientHeight);
            var eleWidth = parseInt(window.getComputedStyle(ele, null).getPropertyValue('width'));
            var eleHeight = parseInt(window.getComputedStyle(ele, null).getPropertyValue('height'));
            ele.style.left = (bodyWidth-eleWidth)/2 + 'px'
            ele.style.top = (bodyHeight-eleHeight)/2 + 'px';
        },

        slide: function (e, now, pre, next, touchPos) {
            var innerwWidth = window.innerWidth
            var touch = e.changedTouches[0];
            var moveDis = touch.clientX - touchPos.x
            //跟随手指移动
            $.translate(now, moveDis+'px', 0, 0);
            $.transition(now, '-webkit-transform', '0s')
            if (moveDis > 0) {
                if (pre) {
                    $.transition(pre, '-webkit-transform', '0s')
                    $.translate(pre, parseInt(-innerWidth + moveDis) +'px', 0, 0)
                }
            } else if (moveDis < 0) {
                if (next) {
                    $.transition(next, '-webkit-transform', '0s')
                    $.translate(next, parseInt(innerWidth + moveDis) +'px', 0, 0)
                };
            }
        }
    }//init  ends
    
    return init;
})