const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const cards = [...document.querySelectorAll(".project-card")];
const dotsWrap = document.querySelector(".carousel-dots");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const heroArt = document.querySelector(".hero-art");
let activeProject = 0;
let carouselTimer;
let ticking = false;

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
    if (ticking) return;
    window.requestAnimationFrame(updateScrollMotion);
    ticking = true;
  },
  { passive: true }
);

setActiveProject(0);
restartCarousel();
updateScrollMotion();
