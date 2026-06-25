// Subtle scroll polish + aquarium life — no dependencies.

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

/* ── Respect reduced-motion for the logo video ── */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const logoVideos = document.querySelectorAll(".logo__video");

function applyMotionPreference() {
  logoVideos.forEach((video) => {
    if (reduceMotion.matches) {
      video.removeAttribute("autoplay");
      video.removeAttribute("loop");
      video.pause();
    } else {
      video.setAttribute("loop", "");
      const play = video.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    }
  });
}

applyMotionPreference();
if (reduceMotion.addEventListener) {
  reduceMotion.addEventListener("change", applyMotionPreference);
}

/* ── Rising bubbles ── */
function initBubbles(container, count = 14) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("span");
    bubble.className = "bubble";
    const size = 4 + Math.random() * 7;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${8 + Math.random() * 84}%`;
    bubble.style.setProperty("--drift", `${-12 + Math.random() * 24}px`);
    bubble.style.animationDuration = `${3.5 + Math.random() * 5}s`;
    bubble.style.animationDelay = `${Math.random() * 6}s`;
    container.appendChild(bubble);
  }
}

initBubbles(document.querySelector(".bubbles"));

/* ── Gentle tank tilt toward cursor ── */
const tank = document.getElementById("reef-tank");
const visual = document.querySelector(".game-card__visual");

if (tank && visual && window.matchMedia("(hover: hover)").matches) {
  visual.addEventListener("mousemove", (e) => {
    const rect = visual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tank.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4 + 2}deg) scale(1.02)`;
  });

  visual.addEventListener("mouseleave", () => {
    tank.style.transform = "perspective(800px) rotateX(2deg)";
  });
}
