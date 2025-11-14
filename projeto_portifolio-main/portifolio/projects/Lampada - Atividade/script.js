
var lamp = document.getElementById("lamp"); // acesso à lâmpada
var acesa = 0

lamp.addEventListener("click", function() {
    if (acesa == 0) {
        acesa = 1
        lamp.src = "assets/lamp_on.png"
        lamp.alt="Lâmpada acesa"
        document.body.style.background = "radial-gradient(circle, white 8%, yellow 100%)"
    } else {
        acesa = 0
        lamp.src = "assets/lamp_off.png"
        lamp.alt="Lâmpada apagada"
        document.body.style.background = "radial-gradient(circle, white 8%, black 100%)"
    }
})