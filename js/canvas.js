let cdom = document.getElementById("myCanvas")

let ctx = cdom.getContext('2d');

let lineWidth = 1
let hang = 20000, hwidth = 50, hheight = 20

// 根据线条宽度 和 行数，宽高，计算
let canvasHeight = hang*(hheight+lineWidth)+lineWidth ,canvasWidth = hwidth+lineWidth*2

// 先绘制一个矩形，再画里面的横线
ctx.rect(0,0,canvasWidth,canvasHeight)
ctx.stroke();

for (let i = 0; i < hang; i++) {

    ctx.beginPath();
    let y = (hheight+lineWidth)*(i+1)
    ctx.moveTo(0,y);
    ctx.lineTo(hwidth+lineWidth,y);
    ctx.stroke();
    ctx.textAlign="center";
    ctx.fillText(i,20,y);

}
for (let i = 0; i < hang; i++) {

    ctx.beginPath();
    let y = (hheight+lineWidth)*(i+1)
    ctx.moveTo(y,0);
    ctx.lineTo(y,hwidth+lineWidth);
    ctx.stroke();
    ctx.textAlign="center";
    // ctx.fillText(i,y,10);

}
ctx.beginPath();
ctx.moveTo(0,21);
ctx.lineTo(16390,21);
ctx.stroke();
// setTimeout(function(){
//     cdom.setAttribute("height",500)
//     // cdom.height = cdom.height +1
// },0)
let rowDom = document.getElementById("Row")
rowDom.addEventListener('scroll',function(e){
    console.log(cdom.height)
    
})

