/* =========================================================
   Você Não Está Sozinha — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header com sombra ao rolar ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Animação de reveal (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Toast (aviso rápido) ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => (toast.hidden = true), 300);
    }, 3200);
  }

  /* ---------- Modal de pânico ---------- */
  const panicBtn = document.getElementById('panicBtn');
  const modal = document.getElementById('panicModal');
  const modalClose = document.getElementById('modalClose');
  const modalTip = document.getElementById('modalTip');

  const dicas = [
    'Dica: mantenha o celular sempre carregado e com o 190 na discagem rápida.',
    'Dica: combine uma palavra-código com alguém de confiança para pedir socorro.',
    'Dica: em local público, procure seguranças, comerciantes ou outras mulheres.',
    'Dica: guarde prints e mensagens — eles podem servir como prova na denúncia.'
  ];

  function openModal() {
    modalTip.textContent = dicas[Math.floor(Math.random() * dicas.length)];
    modal.hidden = false;
    modalClose.focus();
  }
  function closeModal() { modal.hidden = true; panicBtn.focus(); }

  panicBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* ---------- Compartilhar localização ---------- */
  const shareLocation = document.getElementById('shareLocation');
  shareLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Seu dispositivo não suporta localização.');
      return;
    }
    showToast('Obtendo sua localização...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const texto = `Preciso de ajuda. Esta é a minha localização: ${url}`;
        if (navigator.share) {
          navigator.share({ title: 'Minha localização', text: texto, url });
        } else {
          navigator.clipboard.writeText(texto)
            .then(() => showToast('Localização copiada! Cole para enviar a alguém de confiança.'))
            .catch(() => window.open(url, '_blank'));
        }
      },
      () => showToast('Não foi possível obter a localização. Verifique as permissões.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  /* ---------- Pontos Seguros (dados de exemplo) ---------- */
  const pontos = [
    { tag: 'Delegacia', nome: 'Delegacia da Mulher (DEAM)', addr: 'Atendimento especializado 24h', dist: '1,2 km', map: 'delegacia da mulher perto de mim' },
    { tag: 'Saúde',     nome: 'Posto de Saúde / UPA',        addr: 'Atendimento médico e acolhimento', dist: '0,8 km', map: 'UPA perto de mim' },
    { tag: 'Apoio',     nome: 'Centro de Referência da Mulher', addr: 'Apoio jurídico e psicológico', dist: '2,4 km', map: 'centro de referência da mulher' },
    { tag: 'Parceiro',  nome: 'Ponto Seguro — Farmácia',     addr: 'Local acolhedor sinalizado', dist: '0,5 km', map: 'farmácia perto de mim' },
    { tag: 'Emergência',nome: 'Batalhão da Polícia Militar', addr: 'Apoio imediato', dist: '1,7 km', map: 'polícia militar perto de mim' },
    { tag: 'Apoio',     nome: 'Defensoria Pública',          addr: 'Orientação jurídica gratuita', dist: '3,1 km', map: 'defensoria pública perto de mim' }
  ];

  const pointsGrid = document.getElementById('pointsGrid');
  if (pointsGrid) {
    pontos.forEach(p => {
      const el = document.createElement('article');
      el.className = 'point reveal';
      el.innerHTML = `
        <span class="point-tag">${p.tag}</span>
        <h3>${p.nome}</h3>
        <p class="addr">${p.addr}</p>
        <span class="dist">${p.dist} de distância</span>
      `;
      el.addEventListener('click', () => {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(p.map)}`, '_blank');
      });
      pointsGrid.appendChild(el);
    });
  }

  /* ---------- Saída rápida ---------- */
  const quickExit = document.getElementById('quickExit');
  function sairRapido() {
    // replace() troca a entrada atual do histórico, dificultando o "voltar"
    window.location.replace('https://www.google.com/search?q=noticias+de+hoje');
  }
  quickExit.addEventListener('click', sairRapido);

  /* ---------- Atalhos de teclado ---------- */
  let escCount = 0, escTimer;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Fecha modal primeiro
      if (!modal.hidden) { closeModal(); return; }
      // Esc duplo = saída rápida
      escCount++;
      clearTimeout(escTimer);
      escTimer = setTimeout(() => (escCount = 0), 600);
      if (escCount >= 2) sairRapido();
    }
  });

});