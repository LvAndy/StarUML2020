function handleShowMessage () {
  var selectedViews = app.selections.getSelectedViews();
  console.log(selectedViews[0].left);
  console.log(selectedViews[0].right);
  console.log(selectedViews[0].width);
  console.log(selectedViews[0].height);
  app.engine.setProperty(selectedViews[0], 'height',60);
}

获取位置以及设置位置属性