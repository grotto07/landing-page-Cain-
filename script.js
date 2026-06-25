const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const cards = [...document.querySelectorAll(".project-card")];
const dotsWrap = document.querySelector(".carousel-dots");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const heroArt = document.querySelector(".hero-art");
const interactiveLogos = [...document.querySelectorAll(".interactive-logo")];
let activeProject = 0;
let carouselTimer;
let ticking = false;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

cards.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ver projeto ${index + 1}`);
  dot.addEventListener("click", () => {
    setActiveProject(index);
    restartCarousel();
  });
  dotsWrap.appendChild(dot);
});

const dots = [...dotsWrap.querySelectorAll("button")];

function setActiveProject(index) {
  activeProject = (index + cards.length) % cards.length;
  cards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === activeProject);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeProject);
  });
}

function restartCarousel() {
  window.clearInterval(carouselTimer);
  if (reduceMotion) return;
  carouselTimer = window.setInterval(() => setActiveProject(activeProject + 1), 4200);
}

nextBtn.addEventListener("click", () => {
  setActiveProject(activeProject + 1);
  restartCarousel();
});

prevBtn.addEventListener("click", () => {
  setActiveProject(activeProject - 1);
  restartCarousel();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

if (canHover && !reduceMotion) {
  interactiveLogos.forEach((logo) => {
    logo.addEventListener("pointermove", (event) => {
      const rect = logo.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      logo.style.setProperty("--mx", x.toFixed(3));
      logo.style.setProperty("--my", y.toFixed(3));
    });

    logo.addEventListener("pointerleave", () => {
      logo.style.setProperty("--mx", "0");
      logo.style.setProperty("--my", "0");
    });
  });
}

function updateScrollMotion() {
  const depth = Math.min(window.scrollY / 520, 1);
  heroArt?.style.setProperty("--hero-shift", `${depth * 24}px`);
  heroArt?.style.setProperty("--hero-tilt", `${depth * -3}deg`);
  heroArt?.style.setProperty("--wave-shift", `${depth * 18}px`);
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (reduceMotion) return;
    if (ticking) return;
    window.requestAnimationFrame(updateScrollMotion);
    ticking = true;
  },
  { passive: true }
);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearInterval(carouselTimer);
    return;
  }
  restartCarousel();
});

setActiveProject(0);
restartCarousel();
updateScrollMotion();
