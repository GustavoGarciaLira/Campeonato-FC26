document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.accordion-button').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      const expanded = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', String(!expanded));
      item.classList.toggle('is-open', !expanded);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  const formInscricao = document.getElementById('form-inscricao');
  const telaPix = document.getElementById('tela-pix');
  const btnWhatsapp = document.getElementById('btn-whatsapp');
  const btnSubmit = document.getElementById('btn-submit');

  if (formInscricao) {
    formInscricao.addEventListener('submit', (event) => {
      event.preventDefault(); 

      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();

      const textoOriginal = btnSubmit.innerText;
      btnSubmit.innerText = 'GERANDO PIX...';

      // Envia os dados silenciosamente para o seu e-mail
      // ATENÇÃO: COLOQUE SEU E-MAIL REAL AQUI EMBAIXO NO LUGAR DO "SEU-EMAIL@gmail.com"
      fetch('https://formsubmit.co/ajax/polvocampeonatos@gmail.com', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Nome: nome,
            Email: email,
            Status: 'Aguardando o jogador enviar o comprovante no WhatsApp.'
        })
      })
      .then(response => response.json())
      .then(data => {
        formInscricao.style.display = 'none';
        telaPix.style.display = 'block';

        const numeroZap = '5511960947066';
        const mensagem = `Opa! Aqui é o ${nome} (E-mail: ${email}). Segue meu comprovante de pagamento (R$ 10,00) da inscrição do Campeonato FC26!`;
        const urlZap = `https://wa.me/${numeroZap}?text=${encodeURIComponent(mensagem)}`;
        
        // Coloca o link gerado no botão verde
        btnWhatsapp.setAttribute('href', urlZap);
      })
      .catch(error => {
        // Se a internet do usuário cair, avisa ele
        alert('Houve um erro ao gerar o pagamento. Verifique sua internet e tente novamente.');
        btnSubmit.innerText = textoOriginal;
      });
    });
  }

  // =======================================================
  // 4. Botão de Copiar Chave Pix
  // =======================================================
  const btnCopiar = document.getElementById('btn-copiar');
  const inputChave = document.getElementById('chave-pix');

  if (btnCopiar && inputChave) {
    btnCopiar.addEventListener('click', () => {
      // Seleciona o texto dentro do input
      inputChave.select();
      inputChave.setSelectionRange(0, 99999); // Para funcionar bem em celulares

      // Copia para a área de transferência
      navigator.clipboard.writeText(inputChave.value)
        .then(() => {
          // Muda o texto do botão para dar feedback visual
          const textoOriginal = btnCopiar.innerText;
          btnCopiar.innerText = 'Copiado!';
          btnCopiar.style.backgroundColor = '#28a745'; // Fica verde
          
          // Volta ao normal depois de 2 segundos
          setTimeout(() => {
            btnCopiar.innerText = textoOriginal;
            btnCopiar.style.backgroundColor = '#333';
          }, 2000);
        })
        .catch(() => {
          alert('Erro ao copiar. Selecione o texto manualmente.');
        });
    });
  }

});
