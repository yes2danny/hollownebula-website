// Subtle scroll polish — no dependencies.

const nav = document.querySelector(".nav");
const reveals = document.querySelectorAll(".reveal");

function onScroll() {
  if (nav) {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
}

function onReveal(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (reveals.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(onReveal, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}
