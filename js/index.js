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
            for (let j = 0; j < 200; j++) {
                // 行
                let obj = Object.create(null)
                obj.x = i * this.columnWidth + this.lineWidth
                obj.y = j * this.rowHeight + this.lineWidth

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
        let {ctx,lineWidth,columnWidth,rowHeight} = this
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
                ctx.fillText(createCellPos2(i-1),x-columnWidth, lineWidth+rowHeight); //如果缩放比是1，要居中的话，x应该除2

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

        ctx.stroke();  // 显示路径

    }

}
// 全局控制器类

class ControlSheet {
    constructor() {
        this.sheets = [] //存放文档实例对象
        this.activeSheet = 0 //默认展示第一个文档
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
        sheet1.init(this.activeSheet + 1)
        this.sheets.push(sheet1)
        this.activeSheet++

        document.getElementById("dataCanvas1").addEventListener("click", e => {
            console.log("dataCanvas1", e)
            // e.layerX
            // e.layerY
            // 33 是暂定的第一列宽
            //根据xy计算 是哪个容器
            let ex = 0 , ey = 0
            if(e.offsetX< 33 + sheet1.lineWidth){
                // console.log(0)
            }else{
                // 减去第一列宽 然后 除宽度 向上求整
                ex = Math.ceil( (e.offsetX - (33 + sheet1.lineWidth)) / (sheet1.columnWidth+sheet1.lineWidth) ) 

            }

            // 除高度 向下取整
            ey = Math.floor( e.offsetY / (sheet1.rowHeight+sheet1.lineWidth) ) 

            // console.log(ex,ey)
            // console.log(sheet1.cells[ex][ey])
            // sheet1.cells[ex][ey]
            
            // offsetX
            // offsetY
            
        })
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