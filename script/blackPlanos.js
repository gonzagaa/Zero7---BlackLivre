/* /script/blackPlanos.js — V2 (dois modos: com_ativacao | sem_ativacao) */

(function () {
  const DATA_URL = "./script/planos.json";
  const DEFAULT_MODE = "com_ativacao";
  const VALID_MODES = ["com_ativacao", "sem_ativacao"];

  let currentMode = DEFAULT_MODE;
  let cache = null;

  const sections = Array.from(document.querySelectorAll("section.planos"));
  if (!sections.length) return;

  const allButtons = [];
  const allCards = [];
  sections.forEach(sec => {
    const btns = Array.from(sec.querySelectorAll(".botoes button"));
    const cards = Array.from(sec.querySelectorAll(".card[data-plan]"));
    allButtons.push(...btns);
    allCards.push(...cards);

    // assegura data-mode
    btns.forEach(btn => {
      if (!btn.dataset.mode) {
        const txt = (btn.textContent || "").toLowerCase();
        if (txt.includes("sem")) btn.dataset.mode = "sem_ativacao";
        else btn.dataset.mode = "com_ativacao";
      }
    });
  });

  setButtonsVisual(DEFAULT_MODE);
  updateModeTexts(DEFAULT_MODE);

  allButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      if (!VALID_MODES.includes(mode)) return;
      setMode(mode).catch(console.error);
    });
  });

  async function setMode(mode) {
    currentMode = mode;
    setButtonsVisual(mode);
    updateModeTexts(mode);
    await applyModeToCards(mode);

    try {
      if (typeof fbq === "function") fbq("trackCustom", "SelectPlanMode", { mode });
      if (typeof gtag === "function") gtag("event", "select_plan_mode", { mode });
      window.dispatchEvent(new CustomEvent("zero7:planModeChanged", { detail: { mode } }));
    } catch (_) {}
  }

  function setButtonsVisual(mode) {
    allButtons.forEach(b => {
      b.classList.toggle("selecionado", b.dataset.mode === mode);
      // acessibilidade opcional:
      b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false");
    });
  }

  // Só troca textos na primeira seção (não .bit), igual antes
  function updateModeTexts(mode) {
    const containers = document.querySelectorAll("section.planos:not(.bit) .textBotoes");
    containers.forEach(ct => {
      const ps = Array.from(ct.querySelectorAll("p"));
      ps.forEach(p => {
        const show = p.classList.contains(mode);
        p.classList.toggle("is-active", show);
        p.style.display = show ? "" : "none";
      });
    });
  }

  async function loadData() {
    if (cache) return cache;
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("Falha ao carregar planos.json");
    cache = await res.json();
    return cache;
  }

  // efeito antigo -> só no "Máximo de dias"
  function flashMaxDias(el) {
    if (!el) return;
    el.classList.remove("flash-change");
    el.offsetHeight; // reflow
    el.classList.add("flash-change");
    setTimeout(() => el.classList.remove("flash-change"), 700);
  }

  // efeito suave -> preços
  function flashPreco(el) {
    if (!el) return;
    el.classList.add("flash-base");
    el.classList.remove("flash-active");
    el.offsetHeight; // reflow
    el.classList.add("flash-active");
    setTimeout(() => el.classList.remove("flash-active"), 400);
  }

  function ensureTaxaNode(card) {
    // cria (se não existir) o <p class="js-taxa-ativacao"> … </p> como ÚLTIMO item de .topics
    let taxa = card.querySelector(".topics .js-taxa-ativacao");
    if (!taxa) {
      const topics = card.querySelector(".topics");
      if (!topics) return null;
      taxa = document.createElement("p");
      taxa.className = "js-taxa-ativacao";
      taxa.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon> Taxa de ativação: <span></span>`;
      topics.appendChild(taxa);
    }
    return taxa;
  }

  function removeTaxaNode(card) {
    const taxa = card.querySelector(".topics .js-taxa-ativacao");
    if (taxa) taxa.remove();
  }

  async function applyModeToCards(mode) {
    const db = await loadData();
    const table = db[mode];
    if (!table) return;

    allCards.forEach(card => {
      const key = (card.dataset.plan || "").toLowerCase(); // trainee, junior, bit_trainee...
      const cfg = table[key];
      if (!cfg) return;

      // MAX DIAS
      const maxEl = card.querySelector(".js-max-dias");
      if (maxEl && typeof cfg.maxDias !== "undefined") {
        const newMax = String(cfg.maxDias);
        if (maxEl.textContent !== newMax) {
          maxEl.textContent = newMax;
          flashMaxDias(maxEl);
        }
      }

      // PREÇO PARCELADO
      const parcelEl = card.querySelector(".js-price-parcel");
      if (parcelEl && cfg.parcel) {
        const newParcelVal = (() => {
          const val = String(cfg.parcel).replace(/^12x\s*/i, "");
          return `<span>12x</span> ${escapeHTML(val)}`;
        })();
        if (parcelEl.innerHTML !== newParcelVal) {
          parcelEl.innerHTML = newParcelVal;
          flashPreco(parcelEl);
        }
      }

      // PREÇO À VISTA
      const avistaEl = card.querySelector(".js-price-avista");
      if (avistaEl && cfg.avista) {
        const cleaned = String(cfg.avista).replace(/^ou\s*/i, "").replace(/\s*à vista$/i, "");
        const newAvistaVal = `<span>ou</span> ${escapeHTML(cleaned)} <span>à vista</span>`;
        if (avistaEl.innerHTML !== newAvistaVal) {
          avistaEl.innerHTML = newAvistaVal;
          flashPreco(avistaEl);
        }
      }

      // CHECKOUT
      const link = card.querySelector(".js-checkout");
      if (link && cfg.checkout) {
        const newHref = cfg.checkout;
        if (link.getAttribute("href") !== newHref) {
          link.setAttribute("href", newHref);
        }
      }

      // TAXA DE ATIVAÇÃO (só quando existir no cfg)
      if (typeof cfg.taxaAtivacao !== "undefined" && cfg.taxaAtivacao !== null && cfg.taxaAtivacao !== "") {
        const taxa = ensureTaxaNode(card);
        if (taxa) {
          const span = taxa.querySelector("span");
          const val = String(cfg.taxaAtivacao);
          if (span && span.textContent !== val) {
            span.textContent = val;
          }
        }
      } else {
        // modo sem_ativacao: remove o tópico, caso exista
        removeTaxaNode(card);
      }
    });
  }

  function escapeHTML(s) {
    return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  // inicia no modo padrão
  setMode(DEFAULT_MODE).catch(console.error);
})();
