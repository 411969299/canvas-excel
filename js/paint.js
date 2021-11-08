// column 列  row 行
let defaultStyle = {
    rowHeight:23, //行高
    columnWidth:80  //列宽
}
let headword = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let currrentShow = 0  //当前显示第一个文档
// 定义文档,容器属于文档
let sheets =[
    {
        rowHeight:23, //行高
        columnWidth:80,  //列宽
        rongqis:[]
    }
] 
//定义容器
let rongqi = {
    x:0,
    y:0,
    // width:0, 直接查找父辈属性，暂时没必要加
    // height:0,
    name:"",
    isMerge:false, //是否被合并
    mergeName:"",//如果被合并，指向的容器名字
    type:"",// head | left | body
    content:"",// 内容，根据不同的type 内容不一样
    contentType:""//文字 图片等 暂时都是文字
} 
// 左上角坐标，所属的列宽和行高，名字A3 B4 等，
// 是否被合并，合并指向的容器名字，容器类型：字母头部，数字左侧，中间正文

//定义操作，负责勾选，input输入，选中样式切换等
let caozuo ={}