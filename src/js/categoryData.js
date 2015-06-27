define([], function () {
    var storage = window.localStorage;
    var categoryData = {}
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