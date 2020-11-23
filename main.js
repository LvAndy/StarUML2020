//只有view（视图）指向model（模型）的引用，没有反过来的 所以可能开发架构的核心类是以view为中心这个样子的
//具体是指先获取到对应的diagram这个视图，然后遍历每个view看对应model的name是否正确
//无法使用name直接搜索model的功能，因为不存在从model指向view的索引，只有反过来的

function modifyElement () {
  var selectedViews = app.selections.getSelectedViews();
  console.log(selectedViews[0].left);
  console.log(selectedViews[0].right);
  console.log(selectedViews[0].width);
  console.log(selectedViews[0].height);
  app.engine.setProperty(selectedViews[0], 'height',60);
}

function createModel () {
  console.log(app.factory.getModelIds());
  // Get a reference to top-level project
  var project = app.repository.select("@Project")[0]
  // Create a UMLModel element as a child of project
  var model1 = app.factory.createModel({ id: "UMLModel", parent: project })
  // Create a UMLClass element as a child of the model
  var class1 = app.factory.createModel({ id: "UMLClass", parent: model1 })
  // Create a UMLAttribute element and add to the field 'attributes' of the class
  var attr1 = app.factory.createModel({ id: "UMLAttribute", parent: class1, field: "attributes" })
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
  postSelectedView();
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
}

exports.init = init