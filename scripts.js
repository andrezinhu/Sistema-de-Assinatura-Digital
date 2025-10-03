let canvas = document.getElementById("assinatura");
let ctx = canvas.getContext("2d");
let desenhando = false;

// Ajusta canvas para tela inteira
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse
canvas.addEventListener("mousedown", (event) => {
    desenhando = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});
canvas.addEventListener("mouseup", () => desenhando = false);
canvas.addEventListener("mousemove", (event) => {
    if (!desenhando) return;
    desenhar(event.offsetX, event.offsetY);
});

// Touch (mobile)
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    let touch = event.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX, touch.clientY);
    desenhando = true;
});
canvas.addEventListener("touchend", () => desenhando = false);
canvas.addEventListener("touchmove", (event) => {
    if (!desenhando) return;
    event.preventDefault();
    let touch = event.touches[0];
    desenhar(touch.clientX, touch.clientY);
});

function desenhar(x, y) {
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function limpar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function salvar() {
    let imagem = canvas.toDataURL("image/png");
    console.log(imagem); // aqui você pode mandar para o backend
    alert("Assinatura salva!");
}