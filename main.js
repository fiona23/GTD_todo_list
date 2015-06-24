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
        $.on('#' + defaults.addCategory, "click", operateCategory.addCategory)
        //hide right click while click anywhere
        $.on('body', 'click', function () {
            $('#'+defaults.rightBtn)[0].style.display = 'none';
        })
        //点击添加子目录
        $.on('#'+defaults.addCateL2, 'click', function () {
            $('#'+defaults.addCateL2Overlay)[0].style.display = 'block';
        })
        //点击删除子目录
        $.on('#'+defaults.delCateL2, 'click', operateCategory.deleteCategoryLevel2)
        //右键点击显示Menu
        $.on('#'+defaults.cateL1Li, 'mousedown', operateCategory.showRightmenu)
        //save sub category
        $.on('#'+defaults.addCateL2Sub, 'click', operateCategory.addCategoryLevel2)
        
        

        //add task
        $.on('#'+defaults.addTask, 'click', function (e) {
            //show sure and cancle btn
            $('#'+defaults.sureCancle)[0].style.display = 'block';
            operateTask.changeInputState(e);
            //save task
            $.on('#'+defaults.sure, 'click', operateTask.addTask);
            
        })
        //cancle edit/add task
        $.on('#'+defaults.cancle, 'click', operateTask.cancleEditTask)
        //edit task
        $.on('#'+defaults.editTask, 'click', operateTask.editTask)
        $.on('#'+defaults.taskComplete, 'click' ,function () {
            var sure = confirm("确定已经完成吗")
            if (sure == true) {
            operateTask.taskComplete();
            }
        })
        $.on('#'+defaults.pendingBtn, 'click', operateTask.chooseCode)
        $.on('#'+defaults.completedBtn, 'click', operateTask.chooseCode)
        $.on('#'+defaults.allBtn, 'click', operateTask.chooseCode);
        $.on($('.cancle', $('#'+defaults.addCateL2Overlay)[0])[0], 'click', function () {
             $('#'+defaults.addCateL2Overlay)[0].style.display = 'none'
        })
        $.on($('.cancle', $('#'+defaults.cateOverlay)[0])[0], 'click', function () {
            $('#'+defaults.cateOverlay)[0].style.display = 'none'
        })
        $.delegate('#'+defaults.cateL1Li, 'p', 'click', operateCategory.deleteCategory);

    }
    allbind();
})