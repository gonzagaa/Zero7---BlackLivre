 window.addEventListener('scroll', onScroll)

 onScroll()
 function onScroll() {
     showNavOnScroll()
 }

 function showNavOnScroll() {
     if(scrollY > 0) {
         document.querySelector("#navigation").classList.add("scroll")
     } else {
         document.querySelector("#navigation").classList.remove("scroll")
     }
 }

 function openMenu() {
     document.body.classList.add('menu-expanded')
 }

function closeMenu() {
    document.body.classList.remove('menu-expanded')
}

AOS.init(
  {
      duration: 1200
  }
);

const words = ["acessível", "seguro&nbsp;&nbsp;&nbsp;&nbsp;", "lucrativo&thinsp;"];
let index = 0;

const wordEl = document.querySelector(".reveal-word");

function animateSwitch() {
  const tl = gsap.timeline();

  // anima saída
  tl.to(wordEl, {
    duration: 0.3,
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.95,
    y: -10,
    ease: "power2.inOut",
    onComplete: () => {
      index = (index + 1) % words.length;
      wordEl.innerHTML = words[index]; // <- AQUI ESTÁ A MUDANÇA
    }
  });

  // anima entrada
  tl.to(wordEl, {
    duration: 0.6,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    y: 0,
    ease: "power2.out"
  });
}

setInterval(animateSwitch, 2000);

gsap.registerPlugin(ScrollTrigger);


// // Animação da linha de progresso
// gsap.to(".line-progress", {
//   scrollTrigger: {
//     trigger: ".timeline",
//     start: "top center",
//     end: "bottom center",
//     scrub: true,
//   },
//   height: "100%",
//   ease: "none"
// });

// // Ativa bolinhas conforme o scroll
// gsap.utils.toArray(".step").forEach(step => {
//   const circle = step.querySelector(".circle");

//   ScrollTrigger.create({
//     trigger: step,
//     start: "top center+=20",
//     onEnter: () => circle.classList.add("active"),
//     onLeaveBack: () => circle.classList.remove("active")
//   });
// });

// // Aparecer os textos se quiser manter a animação original dos conteúdos
// gsap.utils.toArray(".contentStep").forEach(content => {
//   gsap.to(content, {
//     scrollTrigger: {
//       trigger: content,
//       start: "top 80%",
//       toggleActions: "play none none reverse"
//     },
//     opacity: 1,
//     y: 0,
//     duration: 1,
//     ease: "power2.out"
//   });
// });

const larguraDaTela = window.innerWidth

if (larguraDaTela < 800) {
    var swiper3 = new Swiper(".mySwiper3", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
} else {
    var swiper3 = new Swiper(".mySwiper3", {
        slidesPerView: 4,
        spaceBetween: 10,
        loop: true,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
}

if (larguraDaTela < 800) {
  var swiper4 = new Swiper(".mySwiper4", {
      slidesPerView: 1,
      spaceBetween: 5,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
} else {
  var swiper4 = new Swiper(".mySwiper4", {
      slidesPerView: 3,
      spaceBetween: 90,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
}

if (larguraDaTela < 800) {
  var swiper11 = new Swiper(".mySwiper11", {
      slidesPerView: 1,
      spaceBetween: 5,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
} else {
  var swiper11 = new Swiper(".mySwiper11", {
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
}

const modalGeral = document.getElementById("modalDepoimentos");
const videoContainerGeral = document.getElementById("video-container-geral");
const closeBtnGeral = document.querySelector(".close-depoimento-geral");

document.querySelectorAll(".depoimento").forEach((depoimento) => {
  depoimento.addEventListener("click", () => {
    const videoUrl = depoimento.getAttribute("data-video");
    if (!videoUrl) return;

    modalGeral.style.display = "flex";
    videoContainerGeral.innerHTML = `
      <iframe src="${videoUrl}?autoplay=1&rel=0"
        title="Depoimento"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
  });
});

closeBtnGeral.addEventListener("click", () => {
  modalGeral.style.display = "none";
  videoContainerGeral.innerHTML = "";
});

window.addEventListener("click", (e) => {
  if (e.target === modalGeral) {
    modalGeral.style.display = "none";
    videoContainerGeral.innerHTML = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalGeral.style.display === "flex") {
    modalGeral.style.display = "none";
    videoContainerGeral.innerHTML = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("popupOverlay");
  const content = document.getElementById("popupContent");
  const closeBtn = document.getElementById("popupClose");

  // Mostrar o popup após 2s
  setTimeout(() => {
    overlay.classList.add("active");
    content.classList.add("active");
  }, 3000);

  // Fechar com botão X
  closeBtn.addEventListener("click", () => {
    closePopup();
  });

  // Fechar ao clicar fora do conteúdo (na overlay)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });

  // Fechar ao clicar em QUALQUER link dentro do popup (ex.: <a href="#plan">...</a>)
  content.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (anchor) {
      // fecha instantaneamente para não atrapalhar o scroll até a âncora
      closePopup({ instant: true });
      // não damos preventDefault: o navegador segue o link normalmente
    }
  });

  function closePopup(opts = {}) {
    const { instant = false } = opts;
    content.classList.remove("active");

    if (instant) {
      overlay.classList.remove("active");
      overlay.style.opacity = "";
      return;
    }

    overlay.style.opacity = "1";
    setTimeout(() => {
      overlay.classList.remove("active");
      overlay.style.opacity = "";
    }, 300); // mesmo tempo da transição no CSS
  }
});


// Data final: 24 de junho de 2025 às 00:01:00 (horário local)
const dataFinal = new Date("2025-10-31T12:00:00");

const diasEl = document.getElementById('dias');
const horasEl = document.getElementById('horas');
const minutosEl = document.getElementById('minutos');
const segundosEl = document.getElementById('segundos');
const mensagemEl = document.getElementById('mensagem');

function atualizarContagem() {
  const agora = new Date();
  const diferenca = dataFinal - agora;

  if (diferenca <= 0) {
    clearInterval(intervalo);
    diasEl.innerText = "00";
    horasEl.innerText = "00";
    minutosEl.innerText = "00";
    segundosEl.innerText = "00";
    mensagemEl.innerText = "Tempo esgotado!";
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

  diasEl.innerText = dias.toString().padStart(2, '0');
  horasEl.innerText = horas.toString().padStart(2, '0');
  minutosEl.innerText = minutos.toString().padStart(2, '0');
  segundosEl.innerText = segundos.toString().padStart(2, '0');
}

const intervalo = setInterval(atualizarContagem, 1000);
atualizarContagem(); // Inicializa já com os valores corretos

document.addEventListener("DOMContentLoaded", () => {
  const tarja = document.querySelector(".tarjaTimerNav");
  const nav = document.querySelector("#navigation");
  const header = document.querySelector("#home");

  if (!tarja || !nav || !header) return;

  // Após 3 segundos, ativa a tarja e mantém fixa
  setTimeout(() => {
    tarja.classList.add("active");
    nav.classList.add("activeTarja");
    header.classList.add("activeTarjaHome");
  }, 3000);
});