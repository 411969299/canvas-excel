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
// let  bbb= 0 || !!0
// console.log(bbb)


// 文档类
class CreateSheet {
    constructor() {
        this.name = ""
        this.dom = null
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
        this.rowLineArr = [{
            n: 0
        }] // 行
        this.columnLineArr = [{
            n: 0
        }, {
            n: 33
        }] //列

        this.cells = [] //存放格子对象
        this.ctx = null
    }

    init(num, cwidth, cheight) {

        this.name = "dataCanvas" + num
        this.dom = getDom(this.name)

        this.ctx = this.dom.getContext('2d')

        // width="7800" height="16000"
        for (let i = 0; i < 40; i++) {
            // 列
            this.cells[i] = []

            if (i >= 2) {
                // 从第三条线 开始算，基于前一个的值增加
                // 改变某一条线之后，数组后面的每一根线 全改
                this.columnLineArr.push({
                    n: this.columnLineArr[this.columnLineArr.length - 1].n + this.columnWidth + this.lineWidth
                })
            }
            for (let j = 0; j < 200; j++) {
                // 行
                let obj = Object.create(null)
                obj.x = {
                    n: 0
                }
                obj.y = {
                    n: 0
                }

                if (j >= 1) {
                    // 从第二条线 开始算，基于前一个的值增加
                    let rlen = this.rowLineArr.length - 1
                    this.rowLineArr.push({
                        n: this.rowLineArr[rlen > 0 ? rlen : 0].n + this.rowHeight + this.lineWidth
                    })
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
                obj.mergeCs = "" //如果被合并，指向容器的数字坐标用英文逗号隔开
                // obj.contentType=""//文字 图片等 暂时都是文字

                obj.col = i //哪一列
                obj.row = j //哪一行
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
            rowHeight,
            columnLineArr,
            rowLineArr
        } = this
        ctx.clearRect(0, 0, 7800, 16000);
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

        ctx.moveTo(0, 0);
        ctx.lineTo(0, 16000);

        //  // 缩放2倍
        x += correction + (33 + lineWidth) * 2
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 16000);


        for (let i = 2; i < columnLineArr.length; i++) {
            // 列

            // x += correction + (columnWidth + lineWidth) * 2 // 缩放2倍
            let n = correction + columnLineArr[i].n * 2
            ctx.moveTo(n, 0);
            ctx.lineTo(n, 16000);

            ctx.fillStyle = "#000"
            ctx.font = "28px  Microsoft YaHei UI";
            ctx.textAlign = "center";
            // let textx =  i * (columnWidth + lineWidth) * 2 // 
            let ln = correction + columnLineArr[i - 1].n * 2
            ctx.fillText(createCellPos2(i - 1), (n - ln) / 2 + ln, lineWidth + rowHeight); //如果缩放比是1，要居中的话，x应该除2

        }


        for (let j = 1; j < rowLineArr.length; j++) {
            // 行 从第二行开始
            let y = correction + rowLineArr[j].n * 2
            let ln;
            if (j + 1 < rowLineArr.length) {
                ln = correction + rowLineArr[j + 1].n * 2
            } else {
                break;
            }

            ctx.moveTo(0, y);
            ctx.lineTo(7800, y);


            ctx.fillStyle = "#e6e6e6"
            ctx.fillRect(lineWidth, y, 33 * 2, ln - y);

            ctx.fillStyle = "#000"
            ctx.font = "24px  Microsoft YaHei UI";
            ctx.textAlign = "center";

            if (j + 1 < rowLineArr.length) {
                // let texty = correction + (j + 1) * (rowHeight + lineWidth) * 2 // 在下一格 画本格的字
                ctx.fillText(j, lineWidth + 33, (ln - y) / 2 + y + 12); //如果缩放比是1，要居中的话，x应该除2,求出中点，再加字号的一半
            }

        }

        ctx.stroke(); // 显示路径

    }
    getBoxFromXY(x, y) {
        //通过坐标 获取当前属于哪个盒子
        let {
            rowLineArr,
            columnLineArr,
            cells
        } = this
        // rowLineArr  行 columnLineArr  列

        let i = 0,
            j = 0,
            width = 0,
            height = 0,
            temp = true
        // console.log(x,y)
        while (x > columnLineArr[i].n && i + 1 < columnLineArr.length && temp) {

            if (x < columnLineArr[i + 1].n) {
                width = columnLineArr[i + 1].n - columnLineArr[i].n
                temp = !temp
            } else {
                i++
            }

        }

        temp = true
        while (y > rowLineArr[j].n && j + 1 < rowLineArr.length && temp) {
            if (y < rowLineArr[j + 1].n) {
                height = rowLineArr[j + 1].n - rowLineArr[j].n
                temp = !temp
            } else {
                j++
            }
        }
        cells[i][j].width = width
        cells[i][j].height = height
        // console.log(i,j)
        return cells[i][j]

        // this.rowLineArr = [0] // 行
        // this.columnLineArr = [0, 33] //列
    }
    isNearbyLine(x, y) {
        // 通过坐标判断是否在线段附近 误差 正负3px
        let {
            rowLineArr,
            columnLineArr,
            rowHeight
        } = this
        let ae = 3
        // console.log(x, y)
        // 常规线性搜索
        // let i=0,j=0
        // for(;i<columnLineArr.length;i++){
        //     if(x<columnLineArr[i].n+2 && x>columnLineArr[i].n-2){
        //         break;
        //     }
        // }
        // for(;j<columnLineArr.length;j++){
        //     if(y<rowLineArr[j].n+2 && y>rowLineArr[j].n-2){
        //         break;
        //     }
        // }

        //二分法搜索  坐标如果实时的在不断更新的时候，这里可能会出问题，方案：1先判断坐标，2随时打算迭代
        function search(arr, coo, s, e) {
            // let len = arr.length
            //单数时候

            s = s || 0
            e = e || arr.length - 1
            let m = Math.floor((e - s) / 2) + s

            // console.log(s,e,m)

            let mid = arr[m].n

            if (coo > mid + ae) {

                if (coo < arr[m + 1].n - ae) {
                    //如果只是在当前的格子内就不用判断了
                    return null
                }
                return search(arr, coo, m, e)
            } else if (coo < mid - ae) {
                if (coo > arr[m - 1].n + ae) {
                    //如果只是在当前的格子内就不用判断了
                    return null
                }
                return search(arr, coo, s, m)
            } else {
                return m
            }

        }
        if (y < rowHeight || x < 33) {



            let xline = search(columnLineArr, x)
            if (xline) {
                return {
                    xline
                }
            }
            let yline = search(rowLineArr, y)
            if (yline) {
                return {
                    yline
                }
            }

        } else {

        }

        return null
        // console.log(i,j)
    }
    setLineArr(obj) {
        //设置线段的位置 {x|y:number,t:number}; x或者y的第几根线，t鼠标移动到具体的坐标
        // 暂时规定，不能超过前一个的坐标，可以超过后一个
        let {
            rowLineArr,
            columnLineArr
        } = this

        // function c(a, b) {
        //     a - b > 0 ? '向右' : "向左"
        // }
        if (obj.hasOwnProperty('x') && obj.x > 1) {
            // 列 columnLineArr
            // 边界
            let t = obj.t < columnLineArr[obj.x - 1].n + 5 ? columnLineArr[obj.x - 1].n + 5 : obj.t

            let c = t - columnLineArr[obj.x].n

            for (let i = obj.x; i < columnLineArr.length; i++) {
                columnLineArr[i].n += c
            }

            console.log("set columnLineArr = ", columnLineArr)


        }

        if (obj.hasOwnProperty('y') && obj.y > 1) {
            let t = obj.t < rowLineArr[obj.y - 1].n + 5 ? rowLineArr[obj.y - 1].n + 5 : obj.t

            let c = t - rowLineArr[obj.y].n

            for (let i = obj.y; i < rowLineArr.length; i++) {
                rowLineArr[i].n += c
            }


            console.log("set rowLineArr = ", rowLineArr)
        }
        this.paintGrid()


    }

}
// 全局控制器类
//globalCompositeOperation
// 鼠标双击 单击 用 时间判断 500ms
class ControlSheet {

    constructor() {
        this.sheets = [] //存放文档实例对象
        this.currentSheetIndex = 0 //当前文档坐标
        this.isMouseDown = false // 鼠标是否按下
        this.eventCache = null // 是否是拖动线条
        this.isDoubleclick = {
            num: 0,
            time: 0
        } // 是否双击
        this.selectDom = document.getElementById("SelectAndInput")
        this.inputDom = document.getElementById("wordInput")
        this.cache = {}
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
        let newSheet = new CreateSheet()
        newSheet.init(this.sheets.length)

        let obj = Object.create(null)
        obj.sheet = newSheet
        obj.isMoveLine = null

        this.sheets.push(obj)
        this.currentSheetIndex = this.sheets.length - 1 // 每次初始化后，指向最新的文档，多个文档切换后要保持同步

        let dom = document.getElementById(newSheet.name)
        // let dom = document.getElementById("canvasExcel")
        dom.addEventListener("mousedown", this.mousedownHandle.bind(this))
        dom.addEventListener("mousemove", this.mousemoveHandle.bind(this), true)
        dom.addEventListener("mouseup", this.mouseupHandle.bind(this))

        let sidom = document.getElementById("SelectAndInput")
        let canvasDom = document.getElementById("canvasExcel")
        canvasDom.addEventListener("mousedown", this.canvasExcelMousedown.bind(this))
        canvasDom.addEventListener("mouseup", this.canvasExcelMouseup.bind(this))
        // sidom.addEventListener("mousedown", this.sidom_mousedownHandle.bind(this))
        // 单击一下body 选中，单击后拖动鼠标 多选，双击一个显示input

    }

    isDouble() {
        if (this.isDoubleclick.time == 0) {

        } else {
            // console.log(Date.now(),this.isDoubleclick.time)
            if (Date.now() - this.isDoubleclick.time <= 500) {
                // 双击
                this.isDoubleclick.time = Date.now()
                return true
            }

        }
        this.isDoubleclick.time = Date.now()
        return false
    }
    canvasExcelMouseup(e){
        console.log("canvasExcelMouseup")
        if (this.isMouseDown && this.cache.boxobj) {

            this.cache.boxobj = null
        }
        this.isMouseDown = false
    }
    canvasExcelMousedown(e) {
        let t = e.target
        this.isMouseDown = true
        let currSheet = this.sheets[this.currentSheetIndex]

        console.log(e)
        if (t.nodeName == "CANVAS") {

        } else if (t.className == "selectAndInput" || t.className == "si_circle") {
            let dc = this.isDouble()
            let obj = currSheet.sheet.getBoxFromXY(e.pageX, e.pageY)
            if (dc) {
                // 双击 显示input
                
                console.log("isDouble .cache.boxobj",obj)
                this.inputDom.style.display = "block"
            } else {
                // 单击选中 显示框
                // if(this.cache.boxobj && this.cache.boxobj.name != obj.name){
                //     console.log(this.cache.boxobj)
                //     this.inputDom.style.display = "none"
                // }

            }
        }
    }
    sidom_mousedownHandle(e) {

    }
    mousedownHandle(e) {
        // console.log()

        // e.layerX
        // e.layerY
        // 33 是暂定的第一列宽
        this.isMouseDown = true

        let dc = this.isDouble()


        // 是否移动到线段上
        let currSheet = this.sheets[this.currentSheetIndex]
        if (currSheet.isMoveLine) {
            // this.eventCache
            this.eventCache = {
                ...currSheet.isMoveLine
            }

            console.log("currSheet.isMoveLine", currSheet.isMoveLine)
            return false;
        } else {
            this.eventCache = null
        }

        // console.log("isDouble = ",this.isDouble())
        let obj = currSheet.sheet.getBoxFromXY(e.offsetX, e.offsetY)
        // console.log("obj = ", obj)
        if (obj.type == "body") {
            if(this.cache.boxobj == obj){
                // 同一个box
            }else{

                // if(this.inputDom.value){
                //     obj.content = this.inputDom.value
                // }
                this.inputDom.value = ""
                // 如果前一个选择有数据，要绘制到页面上，
                this.inputDom.style.display = "none"
                this.selectDom.style.display = "none"
                this.selectDom.style.cssText = "top:" + (obj.y.n - 2) + "px;left:" + (obj.x.n - 2) + "px;width:" + obj.width + "px;height:" + obj.height + "px;display:block"
    
            }
            
            // console.log("dc = ",dc)
            // if(dc){
            //     // 双击 显示input
            //     this.inputDom.style.display = "block"
            // }else{
            //     // 单击选中 显示框
            //     if(this.cache.boxobj && this.cache.boxobj.name != obj.name){
            //         console.log(this.cache.boxobj)
            //         this.inputDom.style.display = "none"
            //     }

            // }
            this.cache.boxobj = obj
        }


        return;

        let ex = 0,
            ey = 0


        // sheet.getBoxFromXY(e.offsetX,e.offsetY)

        if (e.offsetX < 33 + sheet.lineWidth) {
            // console.log(0)
        } else {
            // 减去第一列宽 然后 除宽度 向上求整
            // ex = Math.ceil((e.offsetX - (33 + sheet.lineWidth)) / (sheet.columnWidth + sheet.lineWidth))

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
        let {
            eventCache,
            isMouseDown
        } = this
        let currSheet = this.sheets[this.currentSheetIndex]
        

        // console.log(isMouseDown,eventCache)
        if (isMouseDown) {
            // 按下鼠标后移动
            if (eventCache) {
                // eventCache 和 cache.boxobj 同时只能存在一个
                if (eventCache.hasOwnProperty('yline')) {
                    currSheet.sheet.dom.style.cursor = "s-resize"
                } else if (eventCache.hasOwnProperty('xline')) {
                    currSheet.sheet.dom.style.cursor = "w-resize"
                }
                return false
            }

            if(this.cache.boxobj){
                let obj = currSheet.sheet.getBoxFromXY(e.offsetX, e.offsetY)
                if (obj.type == "body") {
                    // 以选中的box中，最小的x和y
                    // let col = obj.col > this.cache.boxobj.col ? this.cache.boxobj.col : obj.col
                    // let row = obj.row > this.cache.boxobj.row ? this.cache.boxobj.row : obj.row
                    // console.log(currSheet.sheet.cells[col][row])
                    let col = 0 ,row = 0,xwidth = 0,yheight = 0
                    if( obj.col > this.cache.boxobj.col){
                        col = this.cache.boxobj.col
                        xwidth = obj.x.n + obj.width - this.cache.boxobj.x.n
                    }else{
                        col = obj.col
                        xwidth = this.cache.boxobj.x.n + this.cache.boxobj.width - obj.x.n
                    }

                    if( obj.row > this.cache.boxobj.row){
                        row = this.cache.boxobj.row
                        yheight = obj.y.n + obj.height - this.cache.boxobj.y.n
                    }else{
                        row = obj.row
                        yheight = this.cache.boxobj.y.n + this.cache.boxobj.height - obj.y.n
                    }

                    let target = currSheet.sheet.cells[col][row]
                    this.inputDom.value = ""
                    // 如果前一个选择有数据，要绘制到页面上，
                    this.inputDom.style.display = "none"
                    this.selectDom.style.display = "none"
                    this.selectDom.style.cssText = "top:" + (target.y.n - 2) + "px;left:" + (target.x.n - 2) + "px;width:" + xwidth + "px;height:" + yheight + "px;display:block"
        
                    
                }
                
            }

        } else {
            // 未点击
            currSheet.isMoveLine = currSheet.sheet.isNearbyLine(e.offsetX, e.offsetY)
            if (currSheet.isMoveLine) {
                // w-resize 水平调整 |s-resize 垂直调整
                if (currSheet.isMoveLine.hasOwnProperty('yline')) {
                    currSheet.sheet.dom.style.cursor = "s-resize"
                } else if (currSheet.isMoveLine.hasOwnProperty('xline')) {
                    currSheet.sheet.dom.style.cursor = "w-resize"
                }

            } else {
                // console.log("default")
                currSheet.sheet.dom.style.cursor = "default"
            }

        }
    }
    mouseupHandle(e) {
        // console.log(e)
        let {
            isMouseDown,
            eventCache
        } = this
        console.log("mouseupHandle")
        if (isMouseDown && eventCache) {
            // 按下鼠标后移动
            let currSheet = this.sheets[this.currentSheetIndex]
            // console.log("mouseupHandle this.eventCache", eventCache)
            if (eventCache.xline) {
                // 移动纵向，列
                currSheet.sheet.setLineArr({
                    x: eventCache.xline,
                    t: e.offsetX
                })

            }
            if (eventCache.yline) {
                // 移动横向 行
                currSheet.sheet.setLineArr({
                    y: eventCache.yline,
                    t: e.offsetY
                })

            }

        }
       
        this.isMouseDown = false
        this.eventCache = null
        // let currSheet = this.sheets[this.currentSheetIndex]

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