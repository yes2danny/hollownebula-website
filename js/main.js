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

/* ── Gentle tank tilt toward cursor (both the reef and the terrarium) ── */
function addTilt(visual, tank, baseTiltX) {
  if (!visual || !tank || !window.matchMedia("(hover: hover)").matches) return;

  visual.addEventListener("mousemove", (e) => {
    const rect = visual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tank.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4 + baseTiltX}deg) scale(1.02)`;
  });

  visual.addEventListener("mouseleave", () => {
    tank.style.transform = `perspective(800px) rotateX(${baseTiltX}deg)`;
  });
}

addTilt(document.querySelector(".game-card__visual"), document.getElementById("reef-tank"), 2);
addTilt(document.querySelector(".teaser__visual"), document.getElementById("next-tank"), 2);

/* ── Dust motes drifting in the heat-lamp light ── */
function initMotes(container, count = 16) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const mote = document.createElement("span");
    mote.className = "mote";
    const size = 1.5 + Math.random() * 2;
    mote.style.width = `${size}px`;
    mote.style.height = `${size}px`;
    mote.style.left = `${48 + Math.random() * 44}%`; // bias toward the lit right side
    mote.style.bottom = `${18 + Math.random() * 50}%`;
    mote.style.setProperty("--mdrift", `${-10 + Math.random() * 20}px`);
    mote.style.animationDuration = `${6 + Math.random() * 7}s`;
    mote.style.animationDelay = `${Math.random() * 8}s`;
    container.appendChild(mote);
  }
}

initMotes(document.querySelector(".motes"));

/* ── "Decode the codename" — scramble the redacted teaser title on hover/focus ── */
function initDecode(el) {
  if (!el) return;

  const reveal = el.dataset.decode || "";
  const placeholder = el.textContent;
  const glyphs = "█▓▒░#%&/\\<>*+=ΛΞ§";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;
  let frame = 0;

  const stop = () => {
    if (timer) { clearInterval(timer); timer = null; }
  };

  const run = () => {
    if (reduce) { el.textContent = reveal; return; }
    stop();
    frame = 0;
    timer = setInterval(() => {
      let out = "";
      for (let i = 0; i < reveal.length; i++) {
        if (i < frame) out += reveal[i];
        else if (reveal[i] === " ") out += " ";
        else out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
      frame += 1 / 3; // lock in roughly one character every 3 ticks
      if (frame >= reveal.length) { el.textContent = reveal; stop(); }
    }, 45);
  };

  const reset = () => {
    stop();
    el.textContent = placeholder;
  };

  el.addEventListener("mouseenter", run);
  el.addEventListener("focus", run);
  el.addEventListener("mouseleave", reset);
  el.addEventListener("blur", reset);
}

initDecode(document.querySelector(".redacted"));
