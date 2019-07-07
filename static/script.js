const canvas = document.getElementById("canvas");
const clear = document.getElementById("clear-btn");
const submit = document.getElementById('subtmit-btn');
const ctx = canvas.getContext("2d");
// let dataURL = canvas.toDataURL();
// console.log("dataURL: ", dataURL);

let position = { x: 0, y: 0 };

function setPosition(e) {
    position.x = e.offsetX;
    position.y = e.offsetY;
}

function draw(e) {
    if (e.buttons !==1) return;
    ctx.beginPath();

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.moveTo(position.x, position.y);
    setPosition(e);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
}

function clearCanvas() {
    canvas.width = canvas.width;
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mouseup", setPosition);
clear.addEventListener("click", clearCanvas);
submit.addEventListener("click", function () {
    $('input[name="signature"]').val(canvas.toDataURL('image/jpeg', 0.1));
});
