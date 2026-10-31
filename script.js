const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const themeButton = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const setTheme = (theme, persist = false) => {
  document.documentElement.dataset.theme = theme;
  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  themeButton?.setAttribute("aria-label", nextLabel);
  themeButton?.setAttribute("title", nextLabel);
  themeMeta?.setAttribute("content", theme === "dark" ? "#090d14" : "#f7f9f5");
  if (persist) localStorage.setItem("portfolio-theme", theme);
};

setTheme(document.documentElement.dataset.theme || "dark");
themeButton?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme, true);
});

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const counters = document.querySelectorAll("[data-count]");
const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 850;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    counter.textContent = String(Math.floor(progress * target));
    if (progress < 1) requestAnimationFrame(tick);
    else counter.textContent = String(target);
  };
  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  counters.forEach((counter) => counterObserver.observe(counter));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".intro, .stats, .service-card, .project-row, .skills-top, .contact").forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
} else {
  counters.forEach((counter) => { counter.textContent = counter.dataset.count; });
}
