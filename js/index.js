function getDom(s) {
    return document.getElementById(s)
}

function createCellPos(n) {
    // 通过utf-16字符集来显示
    var ordA = 'A'.charCodeAt(0);
    var ordZ = 'Z'.charCodeAt(0);
    var len = ordZ - ordA + 1;
    var s = "";
    while (n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s;
}

function createCellPos2(n) {
    // 参数 n 必须为数值

    let sn = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" // 可以用任意自定义字符
    if (Object.prototype.toString.call(n) !== "[object Number]" || n < 1) {
        return null
    }
    n = parseInt(n) - 1
    let len = sn.length
    if (n < len) {
        return sn.charAt(n)
    }
    let s = ""
    while (n >= 0) {
        s = sn.charAt(n % len) + s;
        n = Math.floor(n / len) - 1;
    }
    return s;
}
// console.log(createCellPos2(26*26))
// console.log(createCellPos2(26*26+1))
// console.log(createCellPos2(27*26+1))
// console.log(createCellPos2(28))
// console.log(createCellPos2(29))
// console.log(createCellPos2(30))


// 文档类
class CreateSheet {
    constructor() {
        this.name = ""
        this.rowHeight = 23 //默认行高
        this.columnWidth = 79 //默认列宽
        this.lineWidth = 1
        this.operatedRow = {
            "0": 32,
            "3": 89
        } // 记录被操作过的行高、以后再加背景色等等
        this.operatedColumn = {
            "0": 32,
            "3": 89
        } // 记录被操作过的列宽

        // 存储线条 x，y的位置
        this.rowLineArr = [{n:0}] // 行
        this.columnLineArr = [{n:0}, {n:33}] //列

        this.cells = [] //存放格子对象
        this.ctx = null
    }

    init(num, cwidth, cheight) {

        this.name = "dataCanvas" + num
        this.ctx = getDom(this.name).getContext('2d')

        // width="7800" height="16000"
        for (let i = 0; i < 40; i++) {
            // 列
            this.cells[i] = []

            if (i >= 2) {
                // 从第三条线 开始算，基于前一个的值增加
                // 改变某一条线之后，数组后面的每一根线 全改
                this.columnLineArr.push({n:this.columnLineArr[this.columnLineArr.length - 1].n + this.columnWidth + this.lineWidth})
            }
            for (let j = 0; j < 200; j++) {
                // 行
                let obj = Object.create(null)
                obj.x = {n:0}
                obj.y = {n:0}

                if (j >= 1) {
                    // 从第二条线 开始算，基于前一个的值增加
                    let rlen = this.rowLineArr.length - 1
                    this.rowLineArr.push({n:this.rowLineArr[rlen > 0 ? rlen : 0].n + this.rowHeight + this.lineWidth})
                }
                
               

              // 使用时，手动增加this.lineWidth 或者 用Object.defineProperty 自动增加
                obj.x = this.columnLineArr[i]
                obj.y = this.rowLineArr[j] 
                

                if (i == 0 && j == 0) {
                    this.cells[i].push(obj)
                    continue;
                }

                obj.isMerge = false //是否被合并,默认false
                obj.mergeName = "" //如果被合并，指向的容器名字
                // obj.contentType=""//文字 图片等 暂时都是文字


                if (i == 0) {
                    //左侧第一列
                    obj.type = "left" // head | left | body
                    obj.name = obj.content = "" + j // 内容，根据不同的type 内容不一样
                    this.cells[i].push(obj)
                    continue;

                } else if (j == 0) {
                    //第一行
                    obj.type = "head" // head | left | body
                    obj.name = obj.content = createCellPos2(i)
                    this.cells[i].push(obj)
                    continue;
                } else {
                    obj.type = "body" // head | left | body
                    obj.name = createCellPos2(i) + j
                    obj.content = ""
                    this.cells[i].push(obj)
                    continue;
                }


            }

        }
        console.log("this.cells", this.cells)

        this.paintGrid()
    }
    // paintLine(x, y, x1, y1) {
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(x, y);
    //     this.ctx.lineTo(x1, y1);
    //     this.ctx.stroke();
    // }
    paintGrid() {
        let {
            ctx,
            lineWidth,
            columnWidth,
            rowHeight
        } = this
        ctx.lineWidth = 1
        // ctx.strokeStyle ="#d4d4d4" 
        ctx.strokeStyle = "#bbb"
        let correction = 0
        if (lineWidth % 2 != 0) {
            correction = 0.5
        }

        let x = 0
        // paintLine(x, 0, x, 16000)
        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, 16000);

        for (let i = 1; i <= 40; i++) {
            // 列

            if (i == 1) {
                //第一列特殊处理
                x += correction + (33 + lineWidth) * 2 // 缩放2倍

            } else {
                x += correction + (columnWidth + lineWidth) * 2 // 缩放2倍
                ctx.fillStyle = "#000"
                ctx.font = "28px  Microsoft YaHei UI";
                ctx.textAlign = "center";
                // let textx =  i * (columnWidth + lineWidth) * 2 // 
                ctx.fillText(createCellPos2(i - 1), x - columnWidth, lineWidth + rowHeight); //如果缩放比是1，要居中的话，x应该除2

            }
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 16000);
            // paintLine(x, 0, x, 16000)

            // createCellPos2()

        }



        for (let j = 1; j <= 200; j++) {
            // 行
            let y = correction + j * (rowHeight + lineWidth) * 2
            // paintLine(0, y, 7800, y)
            ctx.moveTo(0, y);
            ctx.lineTo(7800, y);



            if (j > 0) {
                // 从第二行开始
                ctx.fillStyle = "#e6e6e6"
                ctx.fillRect(lineWidth, y, 33 * 2, rowHeight * 2 + lineWidth);

                ctx.fillStyle = "#000"
                ctx.font = "24px  Microsoft YaHei UI";
                ctx.textAlign = "center";
                let texty = correction + (j + 1) * (rowHeight + lineWidth) * 2 // 在下一格 画本格的字
                ctx.fillText(j, lineWidth + 33, texty - 12); //如果缩放比是1，要居中的话，x应该除2
            }

        }

        ctx.stroke(); // 显示路径

    }
    getBoxFromXY(x,y){
        let {rowLineArr,columnLineArr,cells} = this
        // rowLineArr  行 columnLineArr  列
        //通过坐标 获取当前属于哪个盒子
        let temp = true,i=0,j=0
        console.log(x,y)
        while(x>columnLineArr[i].n && temp){
             if(x<columnLineArr[i+1].n){
                temp = !temp
             }else{
                i++
             }
            
        }
        
        temp = true
        while(y>rowLineArr[j].n && temp){
            if(y<rowLineArr[j+1].n){
                temp = !temp
             }else{
                j++
             }
        }
        console.log(i,j)
        return cells[i][j]
        
        // this.rowLineArr = [0] // 行
        // this.columnLineArr = [0, 33] //列
    }
    isNearbyLine(x,y){
        // 通过坐标判断是否在线段附近 误差 正负2px
        let {rowLineArr,columnLineArr} = this
        let i=0,j=0
        console.log(x,y)
        // 常规线性搜索
        for(;i<columnLineArr.length;i++){
            if(x<columnLineArr[i].n+2 && x>columnLineArr[i].n-2){
                break;
            }
        }

        //二分法搜索
        function search(arr,coo,s,e){
            let len = arr.length
            let mid = Math.floor(len/2) 
            s = 0 || s
            let start = arr[0].n, end = arr[mid].n
            if(coo>end+2){

            }else if(coo<end-2){

            }else{

            }
        }


        for(;j<columnLineArr.length;j++){
            if(y<rowLineArr[j].n+2 && y>rowLineArr[j].n-2){
                break;
            }
        }

        console.log(i,j)
    }
    setLineArr(obj){
        //设置线段的位置 {x|y:[a,b]}; x or y, from a to b
        let {rowLineArr,columnLineArr} = this

        function c(a,b){
            a - b>0?'向右':"向左"
        }
        if(obj.hasOwnProperty('x')){
            obj.x
        }
        if(obj.hasOwnProperty('y')){

        }

        
    }

}
// 全局控制器类
//globalCompositeOperation
// 鼠标双击 单击 用 时间判断 500ms
class ControlSheet {
    static isMoveLine = false
    constructor() {
        this.sheets = [] //存放文档实例对象
        this.currentSheet = 0 //当前文档，默认展示第一个文档
    }
    initSheet(s) {
        // console.log()
        // 保留十位数

        // document.getElementById("assistCanvas").addEventListener("click", e => {
        //     console.log("assistCanvas", e)
        // })

        // let cwidth = parseInt(document.body.clientWidth / 10) * 10
        // let cheight = parseInt(document.body.clientHeight / 10) * 10

        // Object.assign(document.getElementsByClassName("excel")[0].style,{width:"1500px",height:"700px"})
        // Object.assign(getDom("canvasExcel").style,{width:"1500px",height:"700px"})


        // console.log({width:cwidth+"px",height:cheight+"px"})
        // console.log(Object.create(null,{width:{value:cwidth+"px"},height:{value:cheight+"px"}}))

        // getDom("canvasExcel").style.height = cheight+"px"
        // this.getWindowSize()
        let sheet1 = new CreateSheet()
        sheet1.init(this.sheets.length)
        this.sheets.push(sheet1)

        let dom = document.getElementById(sheet1.name)
        dom.addEventListener("mousedown", this.mousedownHandle.bind(this))
        dom.addEventListener("mousemove", this.mousemoveHandle.bind(this), true)
        dom.addEventListener("mouseup", this.mouseupHandle.bind(this))
        // 
    }

    mousedownHandle(e) {
        // console.log()

        // e.layerX
        // e.layerY
        // 33 是暂定的第一列宽
        //根据xy计算 是哪个容器

        let ex = 0,
            ey = 0,
            sheet = this.sheets[this.currentSheet]

            sheet.getBoxFromXY(e.offsetX,e.offsetY)
            return;
        if (e.offsetX < 33 + sheet.lineWidth) {
            // console.log(0)
        } else {
            // 减去第一列宽 然后 除宽度 向上求整
            ex = Math.ceil((e.offsetX - (33 + sheet.lineWidth)) / (sheet.columnWidth + sheet.lineWidth))

        }

        // 除高度 向下取整
        ey = Math.floor(e.offsetY / (sheet.rowHeight + sheet.lineWidth))

        // console.log(ex,ey)
        // console.log()
        // sheet1.cells[ex][ey]
        // type = "left" // head | left | body
        let type = sheet.cells[ex][ey].type
        let dom = document.getElementById(sheet.name)
        if (type == "left") {
            // 鼠标在左侧
        } else if (type == "head") {
            // 鼠标在头部
        } else {

        }

    }
    mousemoveHandle(e) {
        if (ControlSheet.isMoveLine) {

        }
    }
    mouseupHandle(e) {
        // console.log(e)
    }
    getWindowSize() {
        //获取当前窗口的宽高

        window.addEventListener('resize', e => {
            // console.log( )
        })

    }
}


let excel = new ControlSheet()

excel.initSheet()