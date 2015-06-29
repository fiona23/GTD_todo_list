require.config({
    
    baseUrl: "js",
　　　　paths: {
　　　　　　'util': 'util',
            'init': 'init',
            'defaults': 'defaults',
            'operateCategory': 'operateCategory',
            'operateTask': 'operateTask',
            'categoryData': 'categoryData',
            'todoData': 'todoData'
　　　　}
    
});

//require(['util', 'init'], function ($, init) {
require(['util', 'init', 'operateCategory','operateTask','defaults'], function ($, init, operateCategory, operateTask, defaults) {
    init.showCategory();
    //初始默认任务的第一个
    init.showTaskList();
    init.showTaskDetail();
    init.clickTask();
    
    //all event Listener
    function allbind () {
        //add category
        $.on('#' + defaults.addCategory, "click", operateCategory.addCategory);
        //删除category
        $.delegate('#'+defaults.cateL1Li, 'p', 'click', operateCategory.deleteCategory);
        //hide right click while click anywhere
        $.on('body', 'click', function () {
            $('#'+defaults.rightBtn)[0].style.display = 'none';
        })
        //右键点击添加子目录
        $.on('#'+defaults.addCateL2, 'click', function () {
            $('#'+defaults.addCateL2Overlay)[0].style.display = 'block';
            init.setOverlayCss($('.black')[1])
        })
        //点击加号添加子目录
        $.delegate('#'+defaults.cateL1Li, 'i', 'click', function () {
            $('#'+defaults.addCateL2Overlay)[0].style.display = 'block';
            init.setOverlayCss($('.black')[1])
            operateCategory.addCategoryLevel2;
        });

        //点击删除子目录
        $.on('#'+defaults.delCateL2, 'click', operateCategory.deleteCategoryLevel2)
        //右键点击显示Menu
        $.on('#'+defaults.cateL1Li, 'mousedown', operateCategory.showRightmenu)
        //保存子目录
        $.on('#'+defaults.addCateL2Sub, 'click', operateCategory.addCategoryLevel2)

        //add task
        $.on('#'+defaults.addTask, 'click', function (e) {
            if($.device.init()){
                $.device.slideRight($('section')[0], $('article')[0])
            }
            operateTask.addTask(e)
        })

        //cancle edit/add task
        $.on('#'+defaults.cancle, 'click', operateTask.cancleEditTask)
        //edit task
        $.on('#'+defaults.editTask, 'click', operateTask.editTask)
        //完成任务
        $.on('#'+defaults.taskComplete, 'click' ,function () {
            var sure = confirm("确定已经完成吗")
            if (sure == true) {
            operateTask.taskComplete();
            }
        })
        //选择【所有】 【未完成】 【已完成】
        $.on('#'+defaults.pendingBtn, 'click', operateTask.chooseCode)
        $.on('#'+defaults.completedBtn, 'click', operateTask.chooseCode)
        $.on('#'+defaults.allBtn, 'click', operateTask.chooseCode);
        //取消添加category
        $.on($('.cancle', $('#'+defaults.cateOverlay)[0])[0], 'click', function () {
            //提交的绑定事件删除
            $.un('#'+defaults.addCateSub, "click");
            $('#'+defaults.cateOverlay)[0].style.display = 'none'
        })
        $.on($('.cancle', $('#'+defaults.addCateL2Overlay)[0])[0], 'click', function () {
            $('#'+defaults.addCateL2Overlay)[0].style.display = 'none'
        })

        //移动端滑动
        function bindSlide (now, pre, next) {
            var touchPos = {};
                $.on(now, 'touchstart', function (e) {
                    var touches = e.changedTouches[0];
                    touchPos.x = touches.clientX;
                })
                $.on(now, 'touchmove', function (e) {
                    init.slide(e, now, pre, next, touchPos)
                })

                $.on(now, 'touchend', function (e) {
                    touchPos.endx = e.changedTouches[0].clientX;
                    var moveDis = touchPos.endx - touchPos.x;
                    if (moveDis < -60) {
                        $.device.slideRight(now, next);
                    } else if (moveDis > 60){
                        $.device.slideLeft(now, pre);
                    } else if (0<moveDis<60 || -60<moveDis<0) {
                        $.device.noSlide(now, pre, next)
                    }
                    $.transition($('.list')[0], '-webkit-transform', '0.6s')
                    $.transition($('.category')[0], '-webkit-transform', '0.6s')
                    $.transition($('.detail')[0], '-webkit-transform', '0.6s')
                })
        }

        if ($.device.init()) {
            bindSlide($('.list')[0], $('.category')[0], $('.detail')[0])
            bindSlide($('.category')[0], null, $('.list')[0])
            bindSlide($('.detail')[0], $('.list')[0], null)
        }
        

    }
    allbind();
})