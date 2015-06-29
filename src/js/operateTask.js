define(['util', 'init','defaults', 'todoData'], function ($, init, defaults, data) {
    var storage = window.localStorage;
    
    return operateTask = (function () {
        function testDate (date) {
            //正则检查格式 不包含闰年检测 闰年检测用if语句完成
            if(/2\d{3}\/((0?[13578]|1[012])\/(0?[1-9]|[12][0-9]|3[01])|(0?[469]|11)\/(0?[1-9]|[12][0-9]|3[01])|0?2\/(0?[1-9]|[12][0-9]))$/.test(date)){
                console.log('a')
                var dateInputArr = date.split("/")//整理输入的时间为数组
                var inputYear = parseInt(dateInputArr[0]),//取得输入的年份
                    inputMonth = parseInt(dateInputArr[1])-1,//-1是为了符合Date类型格式
                    inputDay = parseInt(dateInputArr[2]);
                if ((inputYear%4 != 0 || inputYear%400 != 0) && inputMonth ==1 && inputDay == 29) {
                    return false
                } else {
                    return true
                }
            }
            else {
                return false
            }
        }
        function changeInputState (e) {
            e = e || window.event;

            var target = e.srcElement? e.srcElement : e.target;
            var title = $('#' + defaults.taskName);
            var date = $('#' + defaults.datepicker);
            var description = $('#' + defaults.taskDescription);
            var form = [title, date, description];
            //while click add task, make input abled
            $.each(form, formOperate)
            function formOperate (ele) {
                //if click add task
                if (target.id === defaults.addTask) {
                    //reset value
                    ele[0].value = '';
                    ele[0].removeAttribute('disabled');
                    ele[0].style.display = 'block';
                    $('#task-name-show')[0].style.display = 'none'
                    $('#date-show')[0].style.display = 'none'
                    $('#description-show')[0].style.display = 'none'
                }
                //if click edit task
                else if (target.id === defaults.editTask){
                    ele[0].removeAttribute('disabled');
                    ele[0].style.display = 'block';
                    $('#task-name-show')[0].style.display = 'none'
                    $('#date-show')[0].style.display = 'none'
                    $('#description-show')[0].style.display = 'none'
                } else if (target.id === 'cancle' || 'sure') {
                    ele[0].setAttribute('disabled', 'disabled');
                    ele[0].style.display = 'none';
                    $('#task-name-show')[0].style.display = 'block'
                    $('#date-show')[0].style.display = 'block'
                    $('#description-show')[0].style.display = 'block'
                }
            }
        }

        function changeBtn (state) {
            var display, _display;
            if (state === 'edit') {
                display = 'inline-block';
                _display = 'none';
            } else if (state === 'save'){
                _display = 'inline-block';
                display = 'none';
            }
            $('#sure')[0].style.display = display;
            $('#cancle')[0].style.display = display;
            $('#complete')[0].style.display = _display;
            $('#edit')[0].style.display = _display;
        }
        return{
            addTask: function (e) {
                changeBtn('edit');
                changeInputState(e);
                $.on('#'+defaults.sure, 'click', function (ele) {
                    console.log('a')
                    var title = $('#' + defaults.taskName)[0].value;
                    var date = $('#' + defaults.datepicker)[0].value;
                    var description = $('#' + defaults.taskDescription)[0].value;
                    //判断左侧哪个子目录处于active状态
                    var activeCate = $('.active')[0]
                    var className = activeCate.className.split(' ')[0]

                    if (title && date && description) {
                        if (testDate(date)) {
                            //以时间毫秒数给每个task加一个id
                            var id = new Date().getTime();
                            var tempData = {
                                id : id,
                                code: "1",
                                title: title,
                                date: date,
                                description: description,
                                className: className
                            }
                            data[id] = tempData;
                            //storage each task info
                            storage.setItem("todoData", JSON.stringify(data));
                            console.log(JSON.parse(storage.getItem("todoData")))
                            init.showTaskList();
                            changeBtn('save');
                            changeInputState(ele);
                            $.un('#'+defaults.sure, 'click')
                        }
                        else {
                            alert('日期格式错误，请按照YYYY/MM/DD格式填写')
                        }
                    }
                    //信息填写不全
                    else {
                        alert('信息填写不全')
                    }
                })
                
            },
            editTask: function (e) {
                changeInputState(e);
                changeBtn('edit');
                var id = $('#' + defaults.taskName)[0].getAttribute('data-id');
                $('#' + defaults.taskName)[0].value = data[id]['title'];
                $('#' + defaults.datepicker)[0].value = data[id]['date'];
                $('#' + defaults.taskDescription)[0].value = data[id]['description'];
                $.on('#'+defaults.sure, 'click', function (ele) {
                    //update local storage
                    var title = $('#' + defaults.taskName)[0].value;
                    var date = $('#' + defaults.datepicker)[0].value;
                    var description = $('#' + defaults.taskDescription)[0].value;
                    if (testDate(date)) {
                        data[id]['title'] = title;
                        data[id]['date'] = date;
                        data[id]['description'] = description;
                        storage.setItem("todoData", JSON.stringify(data));
                        changeInputState(ele);
                        init.showTaskList();
                        init.showTaskDetail();
                        changeBtn('save');
                        $.un('#'+defaults.sure, 'click')
                    }
                    else {
                        alert('日期格式错误，请按照YYYY/MM/DD格式填写')
                    }
                    
                })
            },
            taskComplete: function () {
                var id = $('#' + defaults.taskName)[0].getAttribute('data-id')
                if (data[id]['code'] === '1') {
                    data[id]['code'] = '2';
                    //update local storage
                    storage.setItem("todoData", JSON.stringify(data));
                    init.showTaskList();
                } else {
                    alert('这个任务已经完成啦，不用再次完成~')
                }
            },
            cancleEditTask: function (e) {
                changeBtn('save');
                changeInputState(e);
                //reset the task befor edit
                var id = $('#' + defaults.taskName).className
                $('#'+defaults.taskName)[0].value = data[id]['title'];
                $('#'+defaults.datepicker)[0].value = data[id]['date'];
                $('#'+defaults.taskDescription)[0].value = data[id]['description'];
            },
            chooseCode: function (event) {
                var e = event || window.event;
                target = e.srcElement? e.srcElement : e.target;
                for (var i = $('.codes', $('#codes-line')[0]).length - 1; i >= 0; i--) {
                    $('.codes', $('#codes-line')[0]).eq(i).removeClass('active')
                };
                $(target).addClass('active');
                var pending = new RegExp(defaults.pending)
                var completed = new RegExp(defaults.completed)
                if (pending.test(target.id)) {
                    $('#pending')[0].style.display = 'block';
                    $('#completed')[0].style.display = 'none';
                    $('#all')[0].style.display = 'none'
                }
                else if (completed.test(target.id)) {
                    $('#completed')[0].style.display = 'block';
                    $('#pending')[0].style.display = 'none';
                    $('#all')[0].style.display = 'none'
                } else if (/all/.test(target.id)){
                    //show all task
                    $('#'+defaults.pending)[0].style.display = 'none';
                    $('#'+defaults.completed)[0].style.display = 'none';
                    $('#all')[0].style.display = 'block'
                } else {
                    //show all task
                    $('#'+defaults.pending)[0].style.display = 'none';
                    $('#'+defaults.completed)[0].style.display = 'none';
                    $('#all')[0].style.display = 'block'
                }
            },
        }
    })()

})