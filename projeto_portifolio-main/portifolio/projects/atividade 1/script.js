// Carro branco
const carroBranco = document.getElementById("white");
const btnBranco = document.getElementById("branco");

// carro vermelho
const carroVermelho = document.getElementById("red");
const btnVermelho = document.getElementById("vermelho");

const result = document.getElementById("result");
const body = document.body;

// botão
const btnAcelerar = document.getElementById("acelerar");
const btnDesacelerar = document.getElementById("desacelerar");
const btnResetar = document.getElementById("resetar");


let carroSelecionado = null;
let posicaoAtual = 60; 
// --- correção horizontal / alinhamento ---
// posição inicial (valores numéricos em px)
const startLeftWhite = parseInt(window.getComputedStyle(carroBranco).left) || 60;
const startLeftRed = parseInt(window.getComputedStyle(carroVermelho).left) || 60;
let currentLeftWhite = startLeftWhite;
let currentLeftRed = startLeftRed;
// Ajustes finos: acelerar lateral mais rápido para alinhar à pista, retorno mais rápido
const HORIZONTAL_STEP_ACCEL = 8; // quanto se desloca lateralmente por aceleração (px)
// diminuir o passo de retorno para suavizar o movimento de volta
const HORIZONTAL_STEP_RETURN = 3; // quanto volta por desaceleração (px) - mais suave
const HORIZONTAL_MAX_OFFSET = 20; // limite máximo do deslocamento lateral a partir do início (reduzido)
// escala para ilusão diotica (menor = encolhe mais)
const SCALE_MIN = 0.6; // valor de compatibilidade (não usado diretamente)
const SCALE_CENTER = 0.25; // escala quando o carro estiver exatamente na linha da pista (parecer mais longe)
// centro da pista (linha) — calculado como ponto médio entre os carros iniciais
const TRACK_CENTER = Math.round((startLeftWhite + startLeftRed) / 2);


function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }


function mostrarControles() {
  btnAcelerar.style.display = "block";
  btnDesacelerar.style.display = "block";
  btnResetar.style.display = "block";
}

// Seleção
function selecionarCarro(cor) {
  carroSelecionado = cor;
  mostrarControles();

  if (cor === "branco") {
    result.textContent = "Branco";
    body.style.backgroundColor = "white";
    body.style.color = "black";
  } else if (cor === "vermelho") {
    result.textContent = "Vermelho";
    body.style.backgroundColor = "darkred";
    body.style.color = "white";
  }
}

// reset
function resetarTudo() {
  carroSelecionado = null;
  posicaoAtual = 60;
  carroBranco.style.top = "60px";
  carroVermelho.style.top = "60px";
  // restaurar alinhamento horizontal
  currentLeftWhite = startLeftWhite;
  currentLeftRed = startLeftRed;
  carroBranco.style.left = currentLeftWhite + "px";
  carroVermelho.style.left = currentLeftRed + "px";
  // restaurar escala
  carroBranco.style.transform = "scale(1)";
  carroVermelho.style.transform = "scale(1)";
  result.textContent = "?";
  body.style.backgroundColor = "black";
  body.style.color = "white";
  btnAcelerar.style.display = "none";
  btnDesacelerar.style.display = "none";
  btnResetar.style.display = "none";
}

// Acelerar
function acelerar() {
  if (!carroSelecionado) {
    alert("Selecione primeiro um dos carros.");
    return;
  }
  if (posicaoAtual > 0) posicaoAtual -= 10;
  if (carroSelecionado === "branco") {
    carroBranco.style.top = posicaoAtual + "px";
    // mover em direção à TRACK_CENTER (linha da pista)
    if (currentLeftWhite !== TRACK_CENTER) {
      const dir = Math.sign(TRACK_CENTER - currentLeftWhite); // +1 se precisa ir para a direita
      let next = currentLeftWhite + dir * HORIZONTAL_STEP_ACCEL;
      // não ultrapassar o track center
      if (dir > 0) next = Math.min(next, TRACK_CENTER);
      else next = Math.max(next, TRACK_CENTER);
      // também limitar pelo offset máximo
      next = clamp(next, startLeftWhite - HORIZONTAL_MAX_OFFSET, startLeftWhite + HORIZONTAL_MAX_OFFSET);
      // snap se estiver perto do centro
      if (Math.abs(TRACK_CENTER - next) <= HORIZONTAL_STEP_ACCEL) next = TRACK_CENTER;
      currentLeftWhite = next;
      carroBranco.style.left = currentLeftWhite + "px";
    }
  // aplicar escala com base no progresso em direção à TRACK_CENTER
  const denomW = Math.abs(TRACK_CENTER - startLeftWhite) || 1;
  const ratioWhite = clamp(Math.abs(currentLeftWhite - startLeftWhite) / denomW, 0, 1);
  // interpolar até SCALE_CENTER quando chegar ao centro
  let scaleWhite = 1 - ratioWhite * (1 - SCALE_CENTER);
  if (currentLeftWhite === TRACK_CENTER) scaleWhite = SCALE_CENTER;
  carroBranco.style.transition = "left 180ms linear, top 120ms linear, transform 220ms ease";
    carroBranco.style.transform = `scale(${scaleWhite})`;
  } else {
    carroVermelho.style.top = posicaoAtual + "px";
    // mover em direção à TRACK_CENTER (linha da pista)
    if (currentLeftRed !== TRACK_CENTER) {
      const dir = Math.sign(TRACK_CENTER - currentLeftRed); // geralmente será +1 (direita) if center right of red
      let next = currentLeftRed + dir * HORIZONTAL_STEP_ACCEL;
      if (dir > 0) next = Math.min(next, TRACK_CENTER);
      else next = Math.max(next, TRACK_CENTER);
      next = clamp(next, startLeftRed - HORIZONTAL_MAX_OFFSET, startLeftRed + HORIZONTAL_MAX_OFFSET);
      // snap se estiver perto do centro
      if (Math.abs(TRACK_CENTER - next) <= HORIZONTAL_STEP_ACCEL) next = TRACK_CENTER;
      currentLeftRed = next;
      carroVermelho.style.left = currentLeftRed + "px";
    }
  // aplicar escala com base no progresso em direção à TRACK_CENTER
  const denomR = Math.abs(TRACK_CENTER - startLeftRed) || 1;
  const ratioRed = clamp(Math.abs(currentLeftRed - startLeftRed) / denomR, 0, 1);
  // interpolar até SCALE_CENTER quando chegar ao centro
  let scaleRed = 1 - ratioRed * (1 - SCALE_CENTER);
  if (currentLeftRed === TRACK_CENTER) scaleRed = SCALE_CENTER;
  carroVermelho.style.transition = "left 180ms linear, top 120ms linear, transform 220ms ease";
    carroVermelho.style.transform = `scale(${scaleRed})`;
  }
}

// desacelerar
function desacelerar() {
  if (!carroSelecionado) {
    alert("Selecione primeiro um dos carros.");
    return;
  }
  if (posicaoAtual < 60) posicaoAtual += 10;
  if (carroSelecionado === "branco") {
    carroBranco.style.top = posicaoAtual + "px";
    // ao desacelerar, retornar gradualmente para a posição inicial horizontal
    if (currentLeftWhite > startLeftWhite) {
      // mover em direção à posição inicial
      const dirBack = Math.sign(startLeftWhite - currentLeftWhite);
  let next = currentLeftWhite + dirBack * HORIZONTAL_STEP_RETURN;
  if (dirBack > 0) next = Math.min(next, startLeftWhite);
  else next = Math.max(next, startLeftWhite);
  next = clamp(next, startLeftWhite - HORIZONTAL_MAX_OFFSET, startLeftWhite + HORIZONTAL_MAX_OFFSET);
    // snap para a posição inicial quando muito próximo (limiar reduzido)
    if (Math.abs(startLeftWhite - next) <= HORIZONTAL_STEP_RETURN) next = startLeftWhite;
  currentLeftWhite = next;
  carroBranco.style.left = currentLeftWhite + "px";
      // ajustar escala enquanto retorna
  const denomWB = Math.abs(TRACK_CENTER - startLeftWhite) || 1;
  const ratioWhite = clamp(Math.abs(currentLeftWhite - startLeftWhite) / denomWB, 0, 1);
  let scaleWhite = 1 - ratioWhite * (1 - SCALE_CENTER);
  if (currentLeftWhite === TRACK_CENTER) scaleWhite = SCALE_CENTER;
    carroBranco.style.transition = "left 220ms linear, top 140ms linear, transform 300ms ease";
    carroBranco.style.transform = `scale(${scaleWhite})`;
    }
  } else {
    carroVermelho.style.top = posicaoAtual + "px";
    // voltar para a posição inicial quando desacelera
    if (currentLeftRed < startLeftRed) {
      // mover em direção à posição inicial
      const dirBackR = Math.sign(startLeftRed - currentLeftRed);
  let nextR = currentLeftRed + dirBackR * HORIZONTAL_STEP_RETURN;
  if (dirBackR > 0) nextR = Math.min(nextR, startLeftRed);
  else nextR = Math.max(nextR, startLeftRed);
  nextR = clamp(nextR, startLeftRed - HORIZONTAL_MAX_OFFSET, startLeftRed + HORIZONTAL_MAX_OFFSET);
    // snap para a posição inicial quando muito próximo (limiar reduzido)
    if (Math.abs(startLeftRed - nextR) <= HORIZONTAL_STEP_RETURN) nextR = startLeftRed;
  currentLeftRed = nextR;
  carroVermelho.style.left = currentLeftRed + "px";
      // ajustar escala enquanto retorna
  const denomRB = Math.abs(TRACK_CENTER - startLeftRed) || 1;
  const ratioRed = clamp(Math.abs(currentLeftRed - startLeftRed) / denomRB, 0, 1);
  let scaleRed = 1 - ratioRed * (1 - SCALE_CENTER);
  if (currentLeftRed === TRACK_CENTER) scaleRed = SCALE_CENTER;
    carroVermelho.style.transition = "left 220ms linear, top 140ms linear, transform 300ms ease";
    carroVermelho.style.transform = `scale(${scaleRed})`;
    }
  }
}


btnBranco.addEventListener("click", () => selecionarCarro("branco"));
btnVermelho.addEventListener("click", () => selecionarCarro("vermelho"));
btnAcelerar.addEventListener("click", acelerar);
btnDesacelerar.addEventListener("click", desacelerar);
btnResetar.addEventListener("click", resetarTudo);


carroBranco.addEventListener("click", () => selecionarCarro("branco"));
carroVermelho.addEventListener("click", () => selecionarCarro("vermelho"));


document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") acelerar();
  if (event.key === "ArrowDown") desacelerar();
});
