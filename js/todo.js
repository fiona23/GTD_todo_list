(function  () {
    //本地存储
    var storage = window.localStorage;
    var data = {}
    var nowDate = new Date();
    console.log(nowDate)
    if (storage.getItem("todoData")) {
        data = JSON.parse(storage.getItem("todoData"));
    };
    //DOM选择器
    var defaults = {
        cateL1Li: 'category-level1-list',
        cateL2: 'category-level2',
        addCategory: 'add-category',
        addCateSub: 'add-category-submit',
        addCateName: 'add-category-name',
        cateOverlay: 'add-category-overlay',
        addTask: 'add-task',
        taskName: 'task-name',
        datepicker: 'datepicker',
        taskDescription: 'task-description',
        sureCancle: 'sure-cancle',
        sure: 'sure',
        cancle: 'cancle',
        oneDayTask: 'one-day-task',
        editTask: 'edit',
        taskComplete: 'complete',
        pending: 'pending',
        completed: 'completed'
    }
    //分别代表未完成和完成
    var codes = {
            "1" : "#pending",
            "2" : "#completed"
        };
    //show all local storage
    var init =  {
        //show category
        showNewCategory: function  () {
            for (var i = 0, length = storage.length; i < length; i++) {
                if (storage.key(i).substring(0,8) === "category"){
                    var categoryName = document.createElement('li');
                    categoryName.innerHTML = storage.getItem(storage.key(i))
                    $('#'+defaults.cateL1Li).appendChild(categoryName)
                }
            }
        },
        
        //show tasklist
        showTaskList: function () {
            //clear task
            $(codes['1']).innerHTML = '';
            $(codes['2']).innerHTML = ''
            for (var params in data){
            //append child by code
            var parent = $(codes[data[params]['code']]);
            //console.log(parent)
            //taskDetail is each task
            var taskDetail = document.createElement('li');
            taskDetail.id = data[params]['id'];
            taskDetail.innerHTML = data[params]['title'];
            if (data[params]['code'] === '1') {
                addClass(taskDetail, defaults.pending)
            }
            else if (data[params]['code'] === '2'){
                addClass(taskDetail, defaults.completed)
            }
            //get all task list by date
            var pendingTaskDateLi = getByClass(defaults.oneDayTask, $(codes['1']));
            var completedTaskDateLi = getByClass(defaults.oneDayTask, $(codes['2']));
            console.log(pendingTaskDateLi)
            //判断pending 和 completed是否都存在
            var pendingTask = getByClass(defaults.pending);
            var completedTask = getByClass(defaults.completed);
            var condition;
            if ('#'+parent.id === codes['1']) {
                condition = !pendingTask[0];
                taskDateLi = pendingTaskDateLi;
            } else if ('#'+parent.id === codes['2']){
                condition = !completedTask[0];
                taskDateLi = completedTaskDateLi;
            }
            //如果还没有任务就先创建第一个任务
            if (condition) {
                var newDayTask = document.createElement('div');
                parent.appendChild(newDayTask);
                //create p->date
                newDayTask.innerHTML = '<p>' + data[params]['date'] + '</p>';
                addClass(newDayTask, defaults.oneDayTask);
                newDayTask.appendChild(document.createElement('ol'))
                newDayTask.getElementsByTagName('ol')[0].appendChild(taskDetail)
            }
            else {
                for (var length = taskDateLi.length, i = length - 1; i >= 0; i--) {
                    var dateText = new RegExp(data[params]['date']);
                    //if date exsit, add task to this div
                    if (dateText.test(taskDateLi[i].innerHTML)) {
                        taskDateLi[i].getElementsByTagName('ol')[0].appendChild(taskDetail);
                        console.log(taskDateLi[i])
                        break;
                    }
                    //if date dosent exsit, create
                    else if(i==0) {
                            var newDayTask = document.createElement('div');
                            parent.appendChild(newDayTask);
                            newDayTask.innerHTML = '<p>' + data[params]['date'] + '</p>';
                            addClass(newDayTask, defaults.oneDayTask);
                            newDayTask.appendChild(document.createElement('ol'));
                            newDayTask.getElementsByTagName('ol')[0].appendChild(taskDetail);
                        }
                    }
                }
            }
        },
        
        //show task detail
        showTaskDetail: function () {
            //init show the newlist task
            if (data[Object.keys(data)[0]]) {
                $('#'+defaults.taskName).value = data[Object.keys(data)[0]]['title'];
                $('#'+defaults.datepicker).value = data[Object.keys(data)[0]]['date'];
                $('#'+defaults.taskDescription).value = data[Object.keys(data)[0]]['description'];
            };
        },

        // delegate click show task
        clickTask: function () {
            $.delegate('section', 'li', 'click', showClickTask);
            function showClickTask (target, e) {
                var id = target.id;
                $('#'+defaults.taskName).value = data[id]['title'];
                $('#'+defaults.datepicker).value = data[id]['date'];
                $('#'+defaults.taskDescription).value = data[id]['description'];
                //take id as task title's className
                $('#'+defaults.taskName).className = id;
            }
        }
    }//init function ends
    init.showTaskList();
    init.showTaskDetail();
    init.clickTask();
    init.showNewCategory();
    //添加和删除分类
    var operateCategory = {
        addCategory: function () {
            //显示浮层
            $('#' + defaults.cateOverlay).style.display = "block";
            //存储一个cateNum来区分命名所有的category
            if (!storage.getItem("cateNum")) {
                storage.setItem("cateNum", 0)
            }
            //点击确认以后提交
            $.on('#'+defaults.addCateSub, "click", function () {
                storage.setItem('cateNum',parseInt(storage.getItem("cateNum"))+1)
                //传入新添加的目录key值
                showNewCategory('category' + storage.getItem("cateNum"));
                $('#' + defaults.cateOverlay).style.display = 'none';
            })
            function showNewCategory(key) {
                storage.setItem(key,$('#' + defaults.addCateName).value);
                //新建目录dom
                var newCategory = document.createElement('li');
                newCategory.innerHTML = storage.getItem(key);
                //将key值作为每个目录的id
                newCategory.id = key;
                $('#' + defaults.cateL1Li).appendChild(newCategory)
            }
        }
        // deleCategory: function () {
            
        // }
    }
    $.on('#' + defaults.addCategory, "click", operateCategory.addCategory)
    var allTask = getByClass(defaults.cateL2);
    //add taskClick method to all task
    each(allTask, taskClick);
    function taskClick (ele) {
        $.on(ele, 'click', function () {
            //remove all objects' 'active' class
            for (var i = allTask.length - 1; i >= 0; i--) {
                removeClass(allTask[i], 'active')
            };
            addClass(ele, 'active')
        })
    }

    var operateTask = {
        addTask: function () {
            var title = $('#' + defaults.taskName).value;
            var date = $('#' + defaults.datepicker).value;
            var description = $('#' + defaults.taskDescription).value;
            if (title && date && description) {
                //以时间毫秒数给每个task加一个id
                var id = new Date().getTime();
                var tempData = {
                    id : id,
                    code: "1",
                    title: title,
                    date: date,
                    description: description
                }
                data[id] = tempData;
                //storage each task info
                storage.setItem("todoData", JSON.stringify(data));
                function createElement (params) {
                    //append new task to parent
                    var parent = $(codes[params.code])
                }
                init.showTaskList();
            }
            //信息填写不全
            else {
                return false

            }
        },
        editTask: function () {
            $('#'+defaults.sureCancle).style.display = 'block';
            changeInputState();
            $.on('#'+defaults.sure, 'click', function () {
                //update local storage
                var id = $('#' + defaults.taskName).id
                var title = $('#' + defaults.taskName).value;
                var date = $('#' + defaults.datepicker).value;
                var description = $('#' + defaults.taskDescription).value;
                console.log(title)
                data[id]['title'] = title;
                data[id]['date'] = date;
                data[id]['description'] = description;
                storage.setItem("todoData", JSON.stringify(data));
                init.showTaskList();
            })

        },
        taskComplete: function () {
            var id = $('#' + defaults.taskName).className
            data[id]['code'] = '2';
            //update local storage
            storage.setItem("todoData", JSON.stringify(data));
            init.showTaskList();
        }
    }

    //add task
    $.on('#'+defaults.addTask, 'click', function () {
        //show sure and cancle btn
        $('#'+defaults.sureCancle).style.display = 'block';
        changeInputState();
        //save task
        $.on('#'+defaults.sure, 'click', operateTask.addTask)
    })

    //edit task
    $.on('#'+defaults.editTask, 'click', operateTask.editTask)
    $.on('#'+defaults.taskComplete, 'click' ,operateTask.taskComplete)

    function changeInputState(e) {
        var e = event || window.event;
        var target = e.srcElement? e.srcElement : e.target;
        var title = $('#' + defaults.taskName);
        var date = $('#' + defaults.datepicker);
        var description = $('#' + defaults.taskDescription);
        var form = [title, date, description];
        //while click add task, make input abled
        each(form, formOperate)
        function formOperate (ele) {
            //if click add task
            if (target.id === defaults.addTask) {
                //reset value
                ele.value = '';
                ele.removeAttribute('disabled')
            }
            //if click edit task
            else if (target.id === defaults.editTask){
                ele.removeAttribute('disabled')
            }
            //if click complete task
            /*else if (target.id === defaults.taskComplete){
                ele.disabled = 'disabled'
            }*/
        }
    }

})()

