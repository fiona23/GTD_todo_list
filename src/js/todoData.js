define([], function () {
    var storage = window.localStorage;
    var data = {
        '000':{
                id: '000', 
                title: '使用说明', 
                date: '2015/6/27', 
                description: '欢迎使用fiona的todo应用\n左侧可以添加主目录，单击右键添加和删除子目录\n也可以点击主目录旁边的加号添加子目录', 
                className: 'default', 
                code: '1'}
    }
    if (!storage.getItem("todoData") || storage.getItem("todoData").length === 2) {
        storage.setItem("todoData", JSON.stringify(data));
    }
    data = JSON.parse(storage.getItem('todoData'))
    return data;
})