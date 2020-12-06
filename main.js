//view到model是多对一的关系 两方都有对应的api，所以可能开发架构的核心类是以view为中心这个样子的
//具体是指先获取到对应的diagram这个视图，然后遍历每个view看对应model的name是否正确

function modifyElement () {
  var selectedViews = app.selections.getSelectedViews();
  console.log(selectedViews[0].left);
  console.log(selectedViews[0].right);
  console.log(selectedViews[0].width);
  console.log(selectedViews[0].height);
  app.engine.setProperty(selectedViews[0], 'height',60);
}

function modifyClassModelChild(){
  var diagram=app.diagrams.getCurrentDiagram()

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

function searchClassDiagram(name){
  // Get a reference to top-level project
  var parent=app.repository.select(name)[0]._parent;
  var array=parent.ownedElements;
  for(i=0;i<array.length;i++){
    if(array[i].name===name){
      console.log(array[i]);
      break;
    }
  }
}

function handleShowMessage(){
  // postSelectedView();
  createModel()
}

//图内选择一个class元素就是同时选择了view和model，一个view可能对应多个model
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
    obj.right=selectedView.right;
    obj.width=selectedView.width;
    obj.height=selectedView.height;
    resViews.push(obj);
  }
  var json=JSON.stringify(resViews);
  xhr.send(json);
}

function postSelectedModel(){
  var xhr=new XMLHttpRequest();
  xhr.open('POST','http://localhost:80/api/postSelectedModel',true);
  xhr.setRequestHeader('Content-type','application/json');
  xhr.withCredentials=true;
  var selectedModels = app.selections.getSelectedModels();
  var modelData={'Models':selectedModels};
  var json=JSON.stringify(modelData);
  xhr.send(json);
}

function init () {
  app.commands.register('helloworld:show-message', handleShowMessage)
  //创建类事件
  app.factory.on('elementCreated',function(model,view){
    console.log(view.model.name)
    console.log(view.left)
    console.log(view.right)
    console.log(view.width)
    console.log(view.height)
  })
  //修改类名称或者点击创建/删除属性或接口事件
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
        console.log(view.right)
        console.log(view.width)
        console.log(view.height)
      }
    }
    console.log("this is end point")

  })
  //编辑属性或接口名称事件
  app.repository.on('operationExecuted',function(operation){
    console.log(operation)
    if(operation.name=='change properties'||operation.name=='change operation'){
      console.log(app.selections.getSelectedModels()[0]._parent.name)
      console.log(operation.ops[0].arg.n)
      console.log(operation.ops[0].arg.o)
    }
    if(operation.name=='move views'){

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

exports.init = init

