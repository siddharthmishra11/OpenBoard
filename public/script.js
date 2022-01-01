let canvasBoard = document.querySelector("canvas");
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let rect = document.querySelector("#rectangle");
let line = document.querySelector("#line");
let option = document.querySelectorAll(".size-box");
let body = document.querySelector("body");
let toolbar = document.querySelector(".toolbar");
let tool = canvasBoard.getContext("2d");
let l = canvasBoard.getBoundingClientRect().left;
let t = canvasBoard.getBoundingClientRect().top;
let red = document.querySelector(".red");
let green = document.querySelector(".green");
let blue = document.querySelector(".blue");
let orange = document.querySelector(".orange");
let yellow = document.querySelector(".yellow");
let indigo = document.querySelector(".indigo");
let violet = document.querySelector(".violet");
let gray = document.querySelector(".gray");
let black = document.querySelector(".black");
let curr_col = document.querySelector(".curr-col");
let menu = document.querySelector(".menubtn");
let stickyNotes = document.querySelector("#sticky-notes");
let stickyImages = document.querySelector("#image");
let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");
let fill = document.querySelector("#fill");
let download = document.querySelector("#download");
let color_container = document.querySelector(".color-container");
let drawMode = false;
let ix,iy,fx,fy;
let prev = 0;
let invisible = false;
let width = [];
let curr = "rect";
let undoRedoArray = [];
let tracker = 0;
canvasBoard.height = window.innerHeight;
canvasBoard.width = window.innerWidth;
tool.strokeStyle = "red"
for(let i=0;i<4;i++)
  {
      width[i] = 2;
  }
undoRedoArray.push(canvasBoard.toDataURL());

menu.addEventListener("click",function(){
    if(invisible){
        toolbar.style.display = "flex";
        color_container.style.display = "flex";
        toolbar.classList.add("toolAnimation");
        color_container.classList.add("toolAnimation");
    }
    else{
        toolbar.style.display = "none";
        color_container.style.display = "none";
        toolbar.classList.remove("toolAnimation");
        color_container.classList.remove("toolAnimation");
    }
    invisible = !invisible;
})

red.addEventListener("click",function(){
    tool.strokeStyle = "red";
    curr_col.style.backgroundColor = "red";
})

orange.addEventListener("click",function(){
    tool.strokeStyle = "orange";
    curr_col.style.backgroundColor = "orange";
})

green.addEventListener("click",function(){
    tool.strokeStyle = "green";
    curr_col.style.backgroundColor = "green";
})

yellow.addEventListener("click",function(){
    tool.strokeStyle = "yellow";
    curr_col.style.backgroundColor = "yellow";
})

blue.addEventListener("click",function(){
    tool.strokeStyle = "blue";
    curr_col.style.backgroundColor = "blue";
})

indigo.addEventListener("click",function(){
    tool.strokeStyle = "indigo";
    curr_col.style.backgroundColor = "indigo";
})

violet.addEventListener("click",function(){
    tool.strokeStyle = "violet";
    curr_col.style.backgroundColor = "violet";
})

gray.addEventListener("click",function(){
    tool.strokeStyle = "gray";
    curr_col.style.backgroundColor = "gray";
})

black.addEventListener("click",function(){
    tool.strokeStyle = "black";
    curr_col.style.backgroundColor = "black";
})

pencil.addEventListener("click",function(e){
    if(option[0].style.display=="flex")
       option[0].style.display = "none";
    else{
        option[prev].style.display = "none";
        option[0].style.display = "flex";
    }
    tool.lineWidth = width[0];
    prev = 0;
    curr = "pencil";
})

eraser.addEventListener("click",function(){
    if(option[1].style.display=="flex")
       option[1].style.display = "none";
    else{
        option[prev].style.display = "none";
        option[1].style.display = "flex";
    }
    tool.strokeStyle = "white";
    tool.lineWidth = width[1];
    prev = 1;
    curr = "pencil";
})

rect.addEventListener("click",function(){
    if(option[2].style.display=="flex")
       option[2].style.display = "none";
    else{
        option[prev].style.display = "none";
        option[2].style.display = "flex";
    }
    tool.lineWidth = width[2];
    prev = 2;
    curr = "rect"
})

line.addEventListener("click",function(){
    if(option[3].style.display=="flex")
       option[3].style.display = "none";
    else{
        option[prev].style.display = "none";
        option[3].style.display = "flex";
    }
    tool.lineWidth = width[3];
    prev = 3;
    curr = "line"
})

fill.addEventListener("click",()=>{
       curr = "fill"
})

canvasBoard.addEventListener("mousedown",function(e){
    drawMode = true;
    ix = e.clientX-l;
    iy = e.clientY-t;
});


canvasBoard.addEventListener("mouseup",function(e){
    fx = e.clientX-l;
    fy = e.clientY-t;
    if(curr=="rect"){
        let data = {
            ix: ix,
            iy: iy,
            fx: fx,
            fy: fy,
            color: tool.strokeStyle,
            width: tool.lineWidth
        }
        
        socket.emit("drawRect",data);
        //drawRect(data);
    }
    else if(curr=="line"||curr=="pencil"){
        let data = {
            ix: ix,
            iy: iy,
            fx: fx,
            fy: fy,
            color: tool.strokeStyle,
            width: tool.lineWidth
        }
        //drawLine(data);
        socket.emit("drawLine",data);
        let img = canvasBoard.toDataURL();
         let data_ = {
                  img: img,
                }
        socket.emit("trackerUpdate",data_);
    }
    else if(curr=="fill")
    {
        
        const x = Math.round(fx);
        const y = Math.round(fy);
        let R = hexToR(tool.strokeStyle);
        let G = hexToG(tool.strokeStyle);
        let B = hexToB(tool.strokeStyle);
        function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)};
        function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)};
        function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)};
        function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h};
        const color = {r:R, g: G, b: B,a: 255};
        let data = {
            color: color,
            x: x,
            y: y
        };
        socket.emit("drawfill",data);
        //drawfill(data);
    }
    drawMode = false;
});


canvasBoard.addEventListener("mousemove",function(e){
    fx = e.clientX-l;
    fy = e.clientY-t;
    if(curr=="pencil" && drawMode){
        let data = {
            ix: ix,
            iy: iy,
            fx: fx,
            fy: fy,
            color: tool.strokeStyle,
            width: tool.lineWidth
        }
        socket.emit("mouseMove",data);
        //mouseMove(data);
        ix = fx;
        iy = fy;
    }
})


stickyNotes.addEventListener("click",()=>{
    let sticky_note = document.createElement("div");
sticky_note.classList.add("sticky-notes-container");
sticky_note.innerHTML += `<div class = "sticky-notes-head">
        <span class="material-icons-outlined close">
            cancel
            </span>
        <span class="material-icons-outlined cut">
            remove_circle_outline
            </span>
        <span class="material-icons-outlined minimize">
                close_fullscreen
                </span>
    </div>
    <div class = "sticky-notes-content">
        <textarea name="sticky-notes" id="sticky-notes-text"></textarea>
    </div>`;
document.querySelector("body").appendChild(sticky_note);
dragElement(sticky_note);
curr = "sticky-notes";
let cut = sticky_note.querySelector(".cut");
let minimize = sticky_note.querySelector(".minimize");
let cross = sticky_note.querySelector(".close");
let isMinimize = false;
let iscut = false;


cross.addEventListener("click",()=>{
    cross.parentElement.parentElement.remove();
});

cut.addEventListener("click",()=>{
    if(!iscut)
    {
        sticky_note.querySelector(".sticky-notes-content").style.display = "none";
        iscut = true;
    }
});

minimize.addEventListener("click",()=>{
    if(iscut||isMinimize)
    {
        if(iscut)
        {sticky_note.querySelector(".sticky-notes-content").style.display = "flex";
         }
        if(isMinimize)
        {sticky_note.querySelector(".sticky-notes-content").style.height = "100%";
        }
        iscut = false;
        isMinimize = false;
    }
    else{
        sticky_note.querySelector(".sticky-notes-content").style.height = "50%";
        isMinimize = true;
    }
})


})
stickyImages.addEventListener("click",()=>{
let input = document.createElement("input");
input.setAttribute("type","file");
input.setAttribute("value",".png,.jpg,.jpeg");
input.click();


input.addEventListener("change",()=>{
    let url = URL.createObjectURL(input.files[0]);
    let sticky_note = document.createElement("div");
    sticky_note.classList.add("sticky-notes-container");
    sticky_note.innerHTML += `<div class = "sticky-notes-head">
        <span class="material-icons-outlined close">
            cancel
            </span>
        <span class="material-icons-outlined cut">
            remove_circle_outline
            </span>
        <span class="material-icons-outlined minimize">
                close_fullscreen
                </span>
    </div>
    <div class = "sticky-notes-content">
        <img src = "${url}"></img>
    </div>`;


document.querySelector("body").appendChild(sticky_note);
dragElement(sticky_note);
curr = "sticky-notes";
let cut = sticky_note.querySelector(".cut");
let minimize = sticky_note.querySelector(".minimize");
let cross = sticky_note.querySelector(".close");
let isMinimize = false;
let iscut = false;


cross.addEventListener("click",()=>{
    cross.parentElement.parentElement.remove();
});

cut.addEventListener("click",()=>{
    if(!iscut)
    {
        sticky_note.querySelector(".sticky-notes-content").style.display = "none";
        iscut = true;
    }
});


minimize.addEventListener("click",()=>{
    if(iscut||isMinimize)
    {
        if(iscut)
        {sticky_note.querySelector(".sticky-notes-content").style.display = "flex";
         }
        if(isMinimize)
        {sticky_note.querySelector(".sticky-notes-content").style.height = "100%";
        }
        iscut = false;
        isMinimize = false;
    }
    else{
        sticky_note.querySelector(".sticky-notes-content").style.height = "50%";
        isMinimize = true;
    }
})
})
})
function dragElement(elmnt) {


var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
if (document.getElementById(elmnt.id + "header")) {
// if present, the header is where you move the DIV from:
document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
} else {
// otherwise, move the DIV from anywhere inside the DIV:
elmnt.onmousedown = dragMouseDown;
}

function dragMouseDown(e) {
e = e || window.event;
// get the mouse cursor position at startup:
pos3 = e.clientX;
pos4 = e.clientY;
// call a function whenever the cursor moves:
document.onmousemove = elementDrag;
document.onmouseup = closeDragElement;
}

function elementDrag(e) {
e = e || window.event;
e.preventDefault();
// calculate the new cursor position:
pos1 = pos3 - e.clientX;
pos2 = pos4 - e.clientY;
pos3 = e.clientX;
pos4 = e.clientY;
// set the element's new position:
elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement() {
// stop moving when mouse button is released:
document.onmouseup = null;
document.onmousemove = null;
}
}
let ranger = document.querySelectorAll("input[type = 'range']");
for(let i=0;i<4;i++)
{
ranger[i].addEventListener("change",()=>{
     width[i] =  ranger[i].value;
     tool.lineWidth = width[i];
      
})
}

download.addEventListener("click",()=>{
 let url = canvasBoard.toDataURL();
 let a = document.createElement("a");
 a.href = url;
 a.download = "WhiteBoard.jpg";
 a.click();
})

undo.addEventListener("click",()=>{
 if(tracker>0)
 {
    let data = {
        b: 0
    }
    socket.emit("undoRedo",data);
     //undoRedo(data);
 } 
   
});

redo.addEventListener("click",()=>{
 if(tracker<undoRedoArray.length-1)
 {
     let data = {
         b: 1
     }
     socket.emit("undoRedo",data);
     //undoRedo(data);
 }
})


function getColorAtPixel(imageData, x, y) {
const {width, data} = imageData;
return {
r: data[4 * (width * y + x) + 0],
g: data[4 * (width * y + x) + 1],
b: data[4 * (width * y + x) + 2],
a: data[4 * (width * y + x) + 3]
}
}

function setColorAtPixel(imageData, color, x, y) {
const {width, data} = imageData
data[4 * (width * y + x) + 0] = color.r & 0xff;
data[4 * (width * y + x) + 1] = color.g & 0xff;
data[4 * (width * y + x) + 2] = color.b & 0xff;
data[4 * (width * y + x) + 3] = color.a & 0xff;
}

function colorMatch(a, b) {
return a.r === b.r && a.g === b.g && a.b === a.b && a.a === b.a;
}


function floodFill(imageData, newColor, x, y) {
const {width, height, data} = imageData
const stack = []
const baseColor = getColorAtPixel(imageData, x, y);
let operator = {x, y}
// Check if base color and new color are the same
if (colorMatch(baseColor, newColor)) {
return;
}

// Add the clicked location to stack
stack.push({x: operator.x, y: operator.y});
while (stack.length) {
operator = stack.pop();
let contiguousDown = true // Vertical is assumed to be true
let contiguousUp = true // Vertical is assumed to be true
let contiguousLeft = false
let contiguousRight = false
// Move to top most contiguousDown pixel
while (contiguousUp && operator.y >= 0) {
  operator.y--;
  contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
}
// Move downward
while (contiguousDown && operator.y < height) {
  setColorAtPixel(imageData, newColor, operator.x, operator.y);

  // Check left
  if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
    if (!contiguousLeft) {
      contiguousLeft = true;
      stack.push({x: operator.x - 1, y: operator.y});
    }
  } else {
    contiguousLeft = false;
  }

  // Check right
  if (operator.x + 1 < width && colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
    if (!contiguousRight) {
      stack.push({x: operator.x + 1, y: operator.y});
      contiguousRight = true;
    }
  } else {
    contiguousRight = false;
  }

  operator.y++;
  contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
}
}
}

function drawLine(data)
{
   let prevColor = tool.strokeStyle;
   let prevWidth = tool.lineWidth;
   tool.strokeStyle = data.color;
   tool.lineWidth = data.width;
   tool.beginPath();
   tool.moveTo(data.ix,data.iy);
   tool.lineTo(data.fx,data.fy);
   tool.stroke();
   tool.strokeStyle = prevColor;
   tool.lineWidth = prevWidth;
}


function drawRect(data)
{
    let width  = data.fx - data.ix;
    let height = data.fy - data.iy;
    let prevColor = tool.strokeStyle;
    let prevWidth = tool.lineWidth;
    tool.strokeStyle = data.color;
    tool.lineWidth = data.width;
    tool.strokeRect(data.ix,data.iy,width,height);
    let img = canvasBoard.toDataURL();
    let data_ = {
        img: img,
    }
    tool.strokeStyle = prevColor;
    tool.lineWidth = prevWidth;
    socket.emit("trackerUpdate",data_);
}


function drawfill(data)
    {   
         let imageData = tool.getImageData(0, 0, canvasBoard.width, canvasBoard.height);
         floodFill(imageData,data.color, data.x, data.y);
         tool.clearRect(0,0,canvasBoard.width,canvasBoard.height);
         tool.putImageData(imageData, 0, 0);
         let img = canvasBoard.toDataURL();
         let data_ = {
             img: img,
         }
         socket.emit("trackerUpdate",data_);
    }

function mouseMove(data)
    {
        let prevColor = tool.strokeStyle;
        let prevWidth = tool.lineWidth;
        tool.strokeStyle = data.color;
        tool.lineWidth = data.width;
        tool.beginPath();
        tool.moveTo(data.fx,data.fy);
        tool.lineTo(data.ix,data.iy);
        tool.stroke();
        tool.strokeStyle = prevColor;
        tool.lineWidth = prevWidth;
    }
function undoRedo(data)
    { 

        if(data.b==1)
        {
            tracker++;
        }
        else{
            tracker--;
        }
        let newImg = new Image();
        newImg.src = undoRedoArray[tracker];
        newImg.onload = (e)=>{
           tool.clearRect(0,0,canvasBoard.width,canvasBoard.height);
           tool.drawImage(newImg,0,0,canvasBoard.width,canvasBoard.height);
        }
    }
function trackerUpdate(data)
{
    while(tracker!=undoRedoArray.length-1)
    {
        undoRedoArray.pop();
    }
    undoRedoArray.push(data.img);
    tracker++;
}
socket.on("drawRect",(data)=>{
    drawRect(data);
})
//drawLine
socket.on("drawLine",(data)=>{
    drawLine(data);
})
//drawfill
socket.on("drawfill",(data)=>{
     drawfill(data);
})
//trackerUpdate
socket.on("trackerUpdate",(data)=>{
     trackerUpdate(data);
})
//mouseMove
socket.on("mouseMove",(data)=>{
     mouseMove(data);
})
//undoRedo
socket.on("undoRedo",(data)=>{
     undoRedo(data);
})