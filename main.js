//view到model是多对一的关系 两方都有对应的api，所以可能开发架构的核心类是以view为中心这个样子的
//具体是指先获取到对应的diagram这个视图，然后遍历每个view看对应model的name是否正确

//全局锁
var createClass = 1, update = 1, op = 1//修改名称
var del = 1

function modifyClassName(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === msg.old) {
      var model = view.model
      app.engine.setProperty(model, 'name', msg.new);
      break;
    }
  }
}

function modifyVis(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === msg.className) {
      var attributes = view.model.attributes
      var operations = view.model.operations
      modifyAttrVis(attributes, msg)
      modifyOperVis(operations, msg)
    }
  }
}

function modifyAttrVis(attributes, msg) {
  for (i = 0; i < attributes.length; i++) {
    if (attributes[i].name === msg.name) {
      app.engine.setProperty(attributes[i], 'visibility', msg.new);
    }
  }
}

function modifyOperVis(operations, msg) {
  console.log(operations)
  for (i = 0; i < operations.length; i++) {
    if (operations[i].name === msg.name) {
      app.engine.setProperty(operations[i], 'visibility', msg.new);
    }
  }
}

function modifyAttr(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === msg.className) {
      var attributes = view.model.attributes
      for (i = 0; i < attributes.length; i++) {
        if (attributes[i].name === msg.old) {
          app.engine.setProperty(attributes[i], 'name', msg.new);
        }
      }
    }
  }
}



function modifyOper(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === msg.className) {
      var operations = view.model.operations
      for (i = 0; i < operations.length; i++) {
        if (operations[i].name === msg.old) {
          console.log(msg.new)
          app.engine.setProperty(operations[i], 'name', msg.new);
        }
      }
    }
  }
}

function moveView1() {
  console.log('start')
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name == 'Class1') {
      //moveViews接口中Editor类不明 无法使用，只能直接设定属性值
      var width = view.width
      var height = view.height
      app.engine.setProperty(view, 'left', view.left - 10)
      app.engine.setProperty(view, 'top', view.top - 10)
      app.engine.setProperty(view, 'width', width)
      app.engine.setProperty(view, 'height', height)

    }
  }
}

//创建链接,注意head才是目标，tail才是出发点
function createAssociation(headName, tailName, name) {
  console.log(name)
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  var headClassView, tailClassView
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === headName) {
      headClassView = view
    } else if (view.model.name === tailName) {
      tailClassView = view
    }
  }
  var options3 = {
    id: 'UMLAssociation',
    parent: diagram._parent,
    diagram: diagram,
    tailView: tailClassView,
    headView: headClassView,
    //headEndStyle:1, //这个属性是决定是否有箭头的关键属性 但是设置操作无效
    tailModel: tailClassView.model,
    headModel: headClassView.model
  }
  var associationView = app.factory.createModelAndView(options3)
  associationView.model.name = name
  //associationView.headEndStyle=1  //这个属性是决定是否有箭头的关键属性 但是设置操作无效
  console.log(associationView.headEndStyle)
  moveView('Class1', tailClassView.left - 10, tailClassView.top)
  moveView('Class1', tailClassView.left + 10, tailClassView.top)
}

//移动视图
function moveView(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name == msg.className) {
      //moveViews接口中Editor类不明 无法使用，只能直接设定属性值
      var width = view.width
      var height = view.height
      app.engine.setProperty(view, 'left', view.left + msg.newLeft)
      app.engine.setProperty(view, 'top', view.top + msg.newTop)
      app.engine.setProperty(view, 'width', width)
      app.engine.setProperty(view, 'height', height)
    }
  }
}

//调整视图大小
function resizeView(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === msg.className) {
      //resizeNode接口中Editor类不明 无法使用，只能直接设定属性值
      app.engine.setProperty(view, 'width', msg.newWidth)
      app.engine.setProperty(view, 'height', msg.newHeight)

    }
  }
}

//设置属性/接口名称
function modifyClassModelAttribute() {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    if (view.model.name === 'Class1') {
      var model = view.model
      var children = model.getChildren()
      children[0].name = 'age'
      children[1].name = 'getAge'
      //需要以下操作后才能生效，原因不明。。。
      moveView('Class1', view.left - 10, view.top)
      moveView('Class1', view.left + 10, view.top)
    }
  }
}

function createModel(msg) {
  var diagram1 = app.diagrams.getCurrentDiagram()
  var options1 = {
    id: 'UMLClass',
    parent: diagram1._parent,
    diagram: diagram1,
    x1: msg.left,
    y1: msg.top,
    x2: msg.left + msg.width,
    y2: msg.top,
    modelInitializer: function (elem) {
      elem.name = msg.name
    }
  }
  var classView1 = app.factory.createModelAndView(options1)
}

function createInterface(msg) {
  var diagram1 = app.diagrams.getCurrentDiagram()
  var options1 = {
    id: 'UMLInterface',
    parent: diagram1._parent,
    diagram: diagram1,
    x1: msg.left,
    y1: msg.top,
    x2: msg.left + msg.width,
    y2: msg.top,
    modelInitializer: function (elem) {
      elem.name = msg.name
    }
  }
  var classView1 = app.factory.createModelAndView(options1)
}

function createAttribute(name, model) {
  var attr = app.factory.createModel({ id: "UMLAttribute", parent: model, field: "attributes" })
  attr.name = name
}

function createOperation(name, model) {
  var oper = app.factory.createModel({ id: "UMLOperation", parent: model, field: "operations" })
  oper.name = name
}

function updateModel(msg) {
  var diagram = app.diagrams.getCurrentDiagram()
  var views = diagram.ownedViews
  for (i = 0; i < views.length; i++) {
    var view = views[i]
    var model = view.model
    if (model.name == msg.name) {
      if (msg.attributes.length > model.attributes.length) {
        createAttribute(msg.attributes[msg.attributes.length - 1], model)
      } else if (msg.attributes.length < model.attributes.length) {
        for (i = 0; i < model.attributes.length; i++) {
          if (model.attributes[i].name != msg.attributes[i]) {
            var deleteAttr = [model.attributes[i]]
            app.engine.deleteElements(deleteAttr, [])
          }
        }
      } else if (msg.operations.length > model.operations.length) {
        createOperation(msg.operations[msg.operations.length - 1], model)
      } else if (msg.operations.length < model.operations.length) {
        for (i = 0; i < model.operations.length; i++) {
          if (model.operations[i].name != msg.operations[i]) {
            var deleteOper = [model.operations[i]]
            app.engine.deleteElements(deleteOper, [])
          }
        }
      }
    }
  }
}

function deleteModel(msg) {
  modelList = app.repository.findAll(function (target) {
    if (target.getDisplayClassName() === 'Class' || target.getDisplayClassName() === 'Interface') {
      var check = msg.objlist.find((obj) => obj.name === target.name && obj.deleteFromModel === true)
      if (check) {
        return true
      }
    }
    else if (target.getDisplayClassName() === 'Association') {
      var check = msg.asscolist.find((obj) => obj.headName === target.end2.reference.name && obj.tailName === target.end1.reference.name && obj.deleteFromModel === true)
      if (check) {
        return true
      }
    }
    return false
  })
  viewList = app.repository.findAll(function (target) {
    if (target.getDisplayClassName() === 'UMLClassView' || target.getDisplayClassName() === 'UMLInterfaceView') {
      var check = msg.objlist.find((obj) => obj.name === target.model.name)
      if (check) {
        return true
      }
    }
    else if (target.getDisplayClassName() === 'UMLAssociationView') {
      console.log(target)
      var check = msg.asscolist.find((obj) => obj.headName === target.head.model.name && obj.tailName === target.tail.model.name)
      if (check) {
        return true
      }
    }
    return false
  })
  app.engine.deleteElements(modelList, viewList)
  console.log(modelList, viewList)
}

//目前默认全部修改的是“Class1”这个类，所有四个函数验证可用
function handleShowMessage() {
  // modifyClassName('Student')
  // moveView('Class1',312,288)
  // resizeView()
  // modifyClassModelAttribute()
  // createAssociation('Class2','Class1','add')
}

//图内选择一个class元素就是同时选择了view和model
//选择一个列表里的class就只是选择了model
function postSelectedView() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:80/api/postSelectedClass', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.withCredentials = true;
  var resViews = [];
  var selectedViews = app.selections.getSelectedViews();
  for (i = 0; i < selectedViews.length; i++) {
    var selectedView = selectedViews[i];
    var obj = new Object();
    obj.diagramName = selectedView.getDiagram().name;
    obj.modelName = selectedView.model.name;
    obj.left = selectedView.left;
    obj.top = selectedView.top;
    obj.width = selectedView.width;
    obj.height = selectedView.height;
    resViews.push(obj);
  }
  var json = JSON.stringify(resViews);
  xhr.send(json);
}

function init() {
  app.commands.register('helloworld:show-message', handleShowMessage)
  connectServer()
  //登录
  app.dialogs.showInputDialog("输入用户名，组号，密码").then(function ({buttonId, returnValue}) {
    if (buttonId === 'ok'&&returnValue!='') {
      console.log(returnValue)
      sendMsg('login '+returnValue)
    } else {
      console.log("User canceled")
    }
  })
  //创建类事件
  app.factory.on('elementCreated', function (model, view) {
    console.log(model)
    if (view == null) {
      return
    }
    if (createClass == 0) {
      createClass = 1
      return
    }
    var obj = new Object()
    obj.name = view.model.name
    obj.left = view.left
    obj.top = view.top
    obj.width = view.width
    obj.height = view.height
    if (view.getDisplayClassName() === 'UMLClassView') {
      obj.event = 'UMLClassCreated'
      var json = JSON.stringify(obj)
      sendMsg(json)
    } else if (view.getDisplayClassName() === 'UMLInterfaceView') {
      obj.event = 'UMLInterfaceCreated'
      var json = JSON.stringify(obj)
      sendMsg(json)
    }
  })
  //点击创建/删除属性或接口按钮事件,修改类名称时也会触发，但是综合考虑不在这里做处理
  app.repository.on('updated', function (updatedElems) {
    if (update == 0) {
      update = 1
      return
    }
    var flag = false, obj = new Object(), name
    for (i = 0; i < updatedElems.length; i++) {
      if (updatedElems[i].getDisplayClassName() === 'Class' || updatedElems[i].getDisplayClassName() === 'Interface') {
        name = updatedElems[i].name
        flag = true
        break
      }
    }
    //更新的element数组里没有类型为Class的元素，返回
    if (!flag) {
      return
    }
    var diagram = app.diagrams.getCurrentDiagram()
    var views = diagram.ownedViews
    for (i = 0; i < views.length; i++) {
      var view = views[i]
      if (view.model.name === name) {
        console.log(name)
        var attributes = [], operations = []
        for (j = 0; j < view.model.attributes.length; j++) {
          attributes.push(view.model.attributes[j].name)
        }
        for (j = 0; j < view.model.operations.length; j++) {
          operations.push(view.model.operations[j].name)
        }
        obj.event = 'emendAttrOrOper'
        obj.name = name
        obj.attributes = attributes
        obj.operations = operations
        var json = JSON.stringify(obj)
        sendMsg(json)
        console.log(json)
      }
    }
  })
  //修改类名称或者编辑属性或接口名称事件
  app.repository.on('operationExecuted', function (operation) {
    if (op === 0) {
	  console.log('cycle')
      op = 1
      return
    }
    var obj = new Object()
    var parentName = app.selections.getSelectedModels()[0]._parent.name
    var currName = app.selections.getSelectedModels()[0].name
    console.log(operation)
	console.log(parentName+' '+currName)
    if (operation.ops[0].arg.f === 'visibility'&&operation.name!='Create Association') {
      obj.event = 'changeVis'
      obj.className = parentName
      obj.name = currName
      obj.old = operation.ops[0].arg.o
      obj.new = operation.ops[0].arg.n
      console.log(obj)
    }
    else if (operation.name == 'change properties') {
      if (parentName == 'Model') {
        obj.event = 'modifyClassName'
      } else {
        console.log(app.selections.getSelectedModels()[0])
        obj.event = 'modifyAttr'
        obj.className = parentName
      }
      obj.old = operation.ops[0].arg.o
      obj.new = operation.ops[0].arg.n
    }
    else if (operation.name == 'change operation') {
      obj.event = 'modifyOper'
      obj.className = parentName
      obj.field = operation.ops[0].arg.f
      obj.old = operation.ops[0].arg.o
      obj.new = operation.ops[0].arg.n
    }
    else if (operation.name == 'move views') {
      obj.event = 'moveView'
      obj.className = currName
      obj.newLeft = operation.ops[0].arg.n - operation.ops[0].arg.o
      obj.newTop = operation.ops[1].arg.n - operation.ops[1].arg.o
    }
    else if (operation.name == 'resize node') {
      obj.event = 'resizeNode'
      obj.className = currName
      obj.newWidth = operation.ops[0].arg.n
      obj.newHeight = operation.ops[1].arg.n
    }
    else if(operation.name == 'Create Association'){
      obj.event='createAssociation'
      var elems=operation.ops[0]._elem
      var head1=elems.end1.reference.name
      var head2=elems.end2.reference.name
      var name=elems.name
      obj.head1=head1
      obj.head2=head2
      obj.name=name
    }
    if (operation.name != 'add model' && operation.name != 'Create Class') {
      var json = JSON.stringify(obj)
      sendMsg(json)
      console.log(json)
    }
  })

  // 删除类/接口事件
  app.repository.on('beforeExecuteOperation', function (operation) {
    if (del === 0) {
      del = 1
      return
    }
    if (operation.name === 'delete elements') {
      var objlist = []
      var asscolist = []
      for (el of operation.ops) {
        if (el.op === 'R') {
          if (el.arg._type === 'UMLClassView' || el.arg._type === 'UMLInterfaceView') {
            var obj = new Object()
            obj.name = app.repository.get(el.arg.model.$ref).name
            obj.deleteFromModel = false
            objlist.push(obj)
          }
          else if (el.arg._type === 'UMLAssociationView') {
            var obj = new Object()
            obj.headName = app.repository.get(el.arg.head.$ref).model.name
            obj.tailName = app.repository.get(el.arg.tail.$ref).model.name
            obj.deleteFromModel = false
            asscolist.push(obj)
          }
        }
      }
      for (el of operation.ops) {
        if (el.op === 'R') {
          if (el.arg._type === 'UMLClass' || el.arg._type === 'UMLInterface') {
            var tar = objlist.find((obj) => obj.name === el.arg.name)
            if (tar) {
              tar.deleteFromModel = true
            }
            else {
              var obj = new Object()
              obj.name = el.arg.name
              obj.deleteFromModel = true
              objlist.push(obj)
            }
          }
          else if (el.arg._type === 'UMLAssociation') {
            var tar = asscolist.find((assco) => assco.headName === app.repository.get(el.arg.end2.reference.$ref).name && assco.tailName === app.repository.get(el.arg.end1.reference.$ref).name)
            if (tar) {
              tar.deleteFromModel = true
            }
            else {
              var obj = new Object()
              obj.headName = app.repository.get(el.arg.end2.reference.$ref).name
              obj.tailName = app.repository.get(el.arg.end1.reference.$ref).name
              obj.deleteFromModel = true
              asscolist.push(obj)
            }
          }
        }
      }
      var message = new Object()
      message.event = 'deleteElements'
      message.objlist = objlist
      message.asscolist = asscolist
      var json = JSON.stringify(message)
	  
      sendMsg(json)
    }
  })

}

var socket

function connectServer() {
  var socket_ip = '121.4.81.114'
  //var socket_ip='127.0.0.1'

  socket = new WebSocket('ws://' + socket_ip + ':8092')

  socket.onopen = function (event) {
    // console.log("开始连接")
    // sendMsg("login 123 321 321")
    //依次为login 用户名 组号 密码
  }
  // 监听消息
  socket.onmessage = function (event) {
    console.log('Client received a message', event)
    var msg = JSON.parse(event.data.substr(5))
    console.log(msg)
    if (msg.event === 'UMLClassCreated') {
      createClass = 0
      createModel(msg)
    } else if (msg.event === 'UMLInterfaceCreated') {
      createClass = 0
      createInterface(msg)
    }
    else if (msg.event === 'deleteElements') {
      del = 0
      deleteModel(msg)
    }
    else if (msg.event === 'emendAttrOrOper') {
      update = 0
      updateModel(msg)
    } else if(msg.event.length!=undefined&&msg.event.length>0) {
      op = 0
      if (msg.event === 'modifyClassName') {
        modifyClassName(msg)
      } else if (msg.event === 'modifyAttr') {
        modifyAttr(msg)
      } else if (msg.event === 'modifyOper') {
        modifyOper(msg)
      } else if (msg.event === 'changeVis') {
        modifyVis(msg)
      } else if (msg.event === 'moveView') {
        moveView(msg)
      } else if (msg.event === 'resizeNode') {
        resizeView(msg)
      }else if(msg.event==='createAssociation'){
        console.log('11')
        createAssociation(msg.head2,msg.head1,msg.name)
      }
    }
  }

  //监听Socket的关闭
  socket.onclose = function (event) {
    console.log('连接已经断开')
  }

  socket.onerror = function (event) {
    alert('无法连接到:' + socket_ip);
  }
}

function sendMsg(msg) {
  socket.send(msg);
}

exports.init = init
