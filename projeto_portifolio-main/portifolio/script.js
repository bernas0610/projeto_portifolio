const form = document.getElementById("formulario");

    form.addEventListener("submit", function(event) {
      event.preventDefault();

      // Limpa mensagens
      document.getElementById("erro-nome").textContent = "";
      document.getElementById("erro-email").textContent = "";
      document.getElementById("erro-mensagem").textContent = "";

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensagem = document.getElementById("mensagem").value.trim();

      let valido = true;

      if (nome === "") {
        document.getElementById("erro-nome").textContent = "Digite seu nome.";
        valido = false;
      }
      if (email === "") {
        document.getElementById("erro-email").textContent = "Digite seu e-mail.";
        valido = false;
      }
      if (mensagem === "") {
        document.getElementById("erro-mensagem").textContent = "Digite sua mensagem.";
        valido = false;
      }

      if (!valido) return;

      // Substitua pelo seu número WhatsApp (ex: 5581999998888)
      const telefone = "5581999998888";

      const texto = `*Nova mensagem do portfólio!*%0A%0A👤 *Nome:* ${nome}%0A📧 *E-mail:* ${email}%0A💬 *Mensagem:* ${mensagem}`;

      const url = `https://wa.me/${telefone}?text=${texto}`;

      window.open(url, "_blank");
    });