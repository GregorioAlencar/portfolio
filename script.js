document.addEventListener("DOMContentLoaded", () => {

  // ==== IDADE ====
  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  const dataNascimento = "1995-06-27";
  const idade = calcularIdade(dataNascimento);

  const idadeEl = document.getElementById("idade");
  if (idadeEl) idadeEl.textContent = idade;

  const yearEl = document.getElementById("getFullYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ==== CARROSSEL ====
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prev = carousel.querySelector(".arrow.left");
    const next = carousel.querySelector(".arrow.right");

    if (!track || !prev || !next) return;

    const originalImgs = Array.from(track.children);
    if (originalImgs.length === 0) return;

    const imgWidth = originalImgs[0].offsetWidth;
    const visible = Math.max(1, Math.floor(100 / 34));

    let index = visible;
    let startX = 0;
    let dragging = false;
    let autoplayInterval;
    const autoplayDelay = 3000;

    // ==== CLONAGEM LOOP ====
    originalImgs.slice(-visible).forEach((img) => {
      track.insertBefore(img.cloneNode(true), track.firstChild);
    });

    originalImgs.slice(0, visible).forEach((img) => {
      track.appendChild(img.cloneNode(true));
    });

    const allImgs = track.children;

    // ==== MOVIMENTO ====
    function move(animate = true) {
      track.style.transition = animate ? "transform .35s ease" : "none";
      track.style.transform = `translateX(${-index * imgWidth}px)`;
    }

    move(false);

    function checkLoop() {
      track.addEventListener("transitionend", () => {
        if (index >= allImgs.length - visible) {
          index = visible;
          move(false);
        }
        if (index <= 0) {
          index = allImgs.length - visible * 2;
          move(false);
        }
      }, { once: true });
    }

    // ==== SETAS ====
    next.addEventListener("click", () => {
      index++;
      move();
      checkLoop();
    });

    prev.addEventListener("click", () => {
      index--;
      move();
      checkLoop();
    });

    // ==== DRAG MOUSE ====
    track.addEventListener("mousedown", (e) => {
      stopAutoplay();
      dragging = true;
      startX = e.clientX;
      track.style.transition = "none";
    });

    window.addEventListener("mouseup", (e) => {
      if (!dragging) return;
      dragging = false;
      startAutoplay();
      const diff = e.clientX - startX;
      if (diff < -50) index++;
      if (diff > 50) index--;
      move();
      checkLoop();
    });

    // ==== TOUCH ====
    track.addEventListener("touchstart", (e) => {
      stopAutoplay();
      dragging = true;
      startX = e.touches[0].clientX;
      track.style.transition = "none";
    });

    track.addEventListener("touchend", (e) => {
      if (!dragging) return;
      dragging = false;
      startAutoplay();
      const diff = e.changedTouches[0].clientX - startX;
      if (diff < -50) index++;
      if (diff > 50) index--;
      move();
      checkLoop();
    });

    // ==== AUTOPLAY ====
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        index++;
        move();
        checkLoop();
      }, autoplayDelay);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    startAutoplay();
  });

});
