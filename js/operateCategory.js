define(['util', 'init','defaults', 'categoryData'], function ($, init, defaults,categoryData) {
    var data = {};
    var storage = window.localStorage;
    return operateCategory = {
        addCategory: function () {
            var tempData = {}
            //显示浮层
            $('#' + defaults.cateOverlay)[0].style.display = "block";
            //存储一个cateNum来区分命名所有的category
            if (!storage.getItem("cateNum")) {
                storage.setItem("cateNum", 0)
            }
            //点击确认以后提交
            $.on('#'+defaults.addCateSub, "click", function () {
                if ($('#'+defaults.addCateName)) {
                    storage.setItem('cateNum',parseInt(storage.getItem("cateNum"))+1)
                    var id = 'category' + storage.getItem("cateNum");
                    tempData.id = 'category' + storage.getItem("cateNum");
                    tempData.name = $('#' + defaults.addCateName)[0].value;
                    categoryData[id] = tempData;
                    //save data
                    storage.setItem("categoryData", JSON.stringify(categoryData));
                    $('#' + defaults.cateOverlay)[0].style.display = 'none';
                    $('#'+defaults.addCateName)[0].value = ''
                    init.showCategory()
                    //移除绑定事件
                    $.un('#'+defaults.addCateSub, "click");

                }
                else {
                    //没有输入
                }
            })
        },
        deleteCategory: function (target, e) {
            var sure = confirm('删除目录，该目录下的所有任务也会被删除，确定吗');
            if (sure) {
                var needDelete = target.parentNode.parentNode;
                var id = needDelete.className.split(' ')[1];
                var dataId = categoryData[id]['child'];
                for (var params in dataId){
                    var needDelteTask = params;
                    break;
                }
                for (var task in data){
                    if (data[task]['className'] == needDelteTask) {
                        delete data[task]
                    }
                }
                delete categoryData[id];
                storage.setItem("categoryData", JSON.stringify(categoryData));
                storage.setItem("todoData", JSON.stringify(data));
                console.log(init)
                init.showCategory();
                init.showTaskList();
                init.showTaskDetail();
            }
        },
        addCategoryLevel2: function () {
            //如果有输入子类名称
            if ($('#'+defaults.addCateL2Name)[0].value) {
                //将被点击的目录类名分割成数组
                var clsAttr = target.className.split(' ');
                for (var i = clsAttr.length - 1; i >= 0; i--) {
                    if (/^category[0-9]+$/.test(clsAttr[i])) {
                        var id = new Date().getTime();
                        console.log(clsAttr[i])
                        if (!categoryData[clsAttr[i]].child) {
                            categoryData[clsAttr[i]].child = {}
                        };
                        categoryData[clsAttr[i]].child[id] = {
                            id: id,
                            name: $('#'+defaults.addCateL2Name)[0].value
                        }
                        storage.setItem("categoryData", JSON.stringify(categoryData))
                        break;
                    }
                }
                $('#'+defaults.addCateL2Overlay)[0].style.display = 'none';
                $('#'+defaults.addCateL2Name)[0].value = ''
                init.showCategory();
            }
            else {
                //没有输入子类名称
            }
        },
        deleteCategoryLevel2: function () {
            var sure = confirm('删除目录，该目录下的所有任务也会被删除，确定吗');
            if (sure) {
                console.log(target)
                var needDeletetask = target.className.split(' ')[0];
                var needDeleteParent = target.className.split(' ')[2]
                delete categoryData[needDeleteParent]['child'][needDeletetask]
                for (var task in data){
                    if (data[task]['className'] == needDeletetask) {
                        delete data[task]
                    }
                }
                storage.setItem("categoryData", JSON.stringify(categoryData));
                storage.setItem("todoData", JSON.stringify(data));
                init.showCategory();
                init.showTaskList();
                init.showTaskDetail();
            }
        },
        showRightmenu: function (event) {
            var e = event || window.event;
            target = e.srcElement? e.srcElement : e.target;
            if (e.pageX || e.pageY) {
                posy = e.pageY
                posx = e.pageX
            } else {
                //IE没有pagex y 兼容
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            if (e.button === 2) {
                //右键菜单
                $('#'+defaults.rightBtn)[0].style.display = 'block';
                $('#'+defaults.rightBtn)[0].style.left = posx + 2 + 'px';
                $('#'+defaults.rightBtn)[0].style.top = posy - 59 + 'px';
            }
            //不是按下的右键
            else {
                return false
            }
        }
    }
})