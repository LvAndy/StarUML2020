//view到model是多对一的关系 两方都有对应的api，所以可能开发架构的核心类是以view为中心这个样子的
//具体是指先获取到对应的diagram这个视图，然后遍历每个view看对应model的name是否正确

//修改名称
function modifyClassName(newName){
  var diagram=app.diagrams.getCurrentDiagram()
  var views=diagram.ownedViews
  for(i=0;i<views.length;i++){
    var view=views[i]
    if(view.model.name==="Class1"){
      var model=view.model
      app.engine.setProperty(model, 'name',newName);
    }
  }
}

function moveView(){
  var diagram=app.diagrams.getCurrentDiagram()
  var views=diagram.ownedViews
  for(i=0;i<views.length;i++){
    var view=views[i]
    if(view.model.name==="Class1"){
      //moveViews接口中Editor类不明 无法使用，只能直接设定属性值
      var width=view.width
      var height=view.height
      app.engine.setProperty(view,"left",view.left-10)
      app.engine.setProperty(view,"top",view.top-10)
      app.engine.setProperty(view,"width",width)
      app.engine.setProperty(view,"height",height)

    }
  }
}

//移动视图
function moveView(x,y){
  var diagram=app.diagrams.getCurrentDiagram()
  var views=diagram.ownedViews
  for(i=0;i<views.length;i++){
    var view=views[i]
    if(view.model.name==="Class1"){
      //moveViews接口中Editor类不明 无法使用，只能直接设定属性值
      var width=view.width
      var height=view.height
      app.engine.setProperty(view,"left",x)
      app.engine.setProperty(view,"top",y)
      app.engine.setProperty(view,"width",width)
      app.engine.setProperty(view,"height",height)


    }
  }
}

//调整视图大小
function resizeView(){
  var diagram=app.diagrams.getCurrentDiagram()
  var views=diagram.ownedViews
  for(i=0;i<views.length;i++){
    var view=views[i]
    if(view.model.name==="Class1"){
      //resizeNode接口中Editor类不明 无法使用，只能直接设定属性值
      app.engine.setProperty(view,"width",view.width+10)
      app.engine.setProperty(view,"height",view.height+10)

    }
  }
}

//设置属性/接口名称
function modifyClassModelAttribute(){
  var diagram=app.diagrams.getCurrentDiagram()
  var views=diagram.ownedViews
  for(i=0;i<views.length;i++){
    var view=views[i]
    if(view.model.name==="Class1"){
      var model=view.model
      var children=model.getChildren()
      children[0].name="age"
      children[1].name="getAge"
      //需要以下操作后才能生效，原因不明。。。
      moveView(view.left-10,view.top)
      moveView(view.left+10,view.top)
    }
  }
}

function createModel () {
  var diagram1=app.diagrams.getCurrentDiagram()
  var options1 = {
    id: "UMLClass",
    parent: diagram1._parent,
    diagram: diagram1,
    x1: 100,
    y1: 100,
    x2: 200,
    y2: 200,
    modelInitializer: function (elem){
      elem.name="Gundam"
    }
  }
  var classView1 = app.factory.createModelAndView(options1)
}

//目前默认全部修改的是“Class1”这个类，所有四个函数验证可用
function handleShowMessage(){
  // modifyClassName('Student')
  // moveView()
  // resizeView()
  // modifyClassModelAttribute()
  connectServer()
}

//图内选择一个class元素就是同时选择了view和model
//选择一个列表里的class就只是选择了model
function postSelectedView(){
  var xhr=new XMLHttpRequest();
  xhr.open('POST','http://localhost:80/api/postSelectedClass',true);
  xhr.setRequestHeader('Content-type','application/json');
  xhr.withCredentials=true;
  var resViews=[];
  var selectedViews = app.selections.getSelectedViews();
  for(i=0;i<selectedViews.length;i++){
    var selectedView=selectedViews[i];
    var obj=new Object();
    obj.diagramName=selectedView.getDiagram().name;
    obj.modelName=selectedView.model.name;
    obj.left=selectedView.left;
    obj.top=selectedView.top;
    obj.width=selectedView.width;
    obj.height=selectedView.height;
    resViews.push(obj);
  }
  var json=JSON.stringify(resViews);
  xhr.send(json);
}

function init () {
  app.commands.register('helloworld:show-message', handleShowMessage)
  //创建类事件
  app.factory.on('elementCreated',function(model,view){
    console.log(view.model.name)
    console.log(view.left)
    console.log(view.top)
    console.log(view.width)
    console.log(view.height)
  })
  //修改类名称或者点击创建/删除属性或接口按钮事件
  app.repository.on('updated',function(updatedElems){
    var flag=false
    for(i=0;i<updatedElems.length;i++){
      console.log()
      if(updatedElems[i].getDisplayClassName()==='Class'){
        name=updatedElems[i].name
        console.log(name)
        flag=true
        break
      }
    }
    //更新的element数组里没有类型为Class的元素，返回
    if(!flag){
      return
    }
    var diagram=app.diagrams.getCurrentDiagram()
    var views=diagram.ownedViews
    for(i=0;i<views.length;i++){
      var view=views[i]
      if(view.model.name===name){
        var childArray=view.model.getChildren()
        for(j=0;j<childArray.length;j++){
          console.log(childArray[j].getDisplayClassName())
          console.log(childArray[j].name)
        }
        console.log(view.model.name)
        console.log(view.left)
        console.log(view.top)
        console.log(view.width)
        console.log(view.height)
      }
    }
    console.log("this is end point")

  })
  //编辑属性或接口名称事件
  app.repository.on('operationExecuted',function(operation){
    
    if(operation.name=='change properties'||operation.name=='change operation'){
      console.log(app.selections.getSelectedModels()[0]._parent.name)
      console.log(operation.ops[0].arg.n)
      console.log(operation.ops[0].arg.o)
    }
    if(operation.name=='move views'){
      console.log(operation)
    }
    if(operation.name=='resize node'){
      
    }
  })


//   app.repository.on('updated',function(updatedElems){
//     for(i=0;i<updatedElems.length;i++){
//       console.log(updatedElems[i])
//     }
//     console.log("this is end point")
//   })
  


}

var socket

function connectServer(){
  var socket_ip="121.4.81.114"
		
  socket= new WebSocket('ws://'+socket_ip+':8092')

  socket.onopen = function(event)
  {
    console.log("连接服务成功！")
    sendMsg()
  }
  // 监听消息
  socket.onmessage = function(event)
  {
    console.log('Client received a message',event)
    console.log(event.data)
  }

  // 监听Socket的关闭
  socket.onclose = function(event)
  {
    console.log('连接已经断开')
  }

  socket.onerror = function(event) {
    alert('无法连接到:' + socket_ip);
  }
}

function sendMsg(){
  socket.send("你好！"); 
}

exports.init = init

