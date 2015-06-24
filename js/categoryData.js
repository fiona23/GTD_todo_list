define([], function () {
    var storage = window.localStorage;
    var data = {
        '000':{id: '000', title: '使用说明', date: '2015/6/6', description: '欢迎使用fiona的todo应用', className: 'default', code: '1'}
    }
    var categoryData = {}
    if (!storage.getItem("todoData")) {
        storage.setItem("todoData", JSON.stringify(data));
    }
    if (!storage.getItem('categoryData')) {
        categoryData['category0'] = {
            id: 'category0',
            name: '默认分类',
            child: {
                'default': {id: 'default', name:'使用说明'}
            }
        }
        storage.setItem("categoryData", JSON.stringify(categoryData));
    }
    else {
        categoryData = JSON.parse(storage.getItem('categoryData'))
    }
    return categoryData;
})