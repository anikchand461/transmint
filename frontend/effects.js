/*
 * Transmint UI effects — purely decorative, no app logic.
 * Cursor spotlight on cards, magnetic primary buttons and scroll reveal.
 */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Opt in to the reveal styles only once this script is running, so content is never stuck hidden.
  document.documentElement.classList.add("js");

  // Scroll reveal: cards fade/blur in as they enter the viewport.
  const revealables = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealables.forEach((el) => observer.observe(el));
  }

  if (!finePointer || reduceMotion) return;

  // Spotlight: track the cursor inside each card via CSS custom properties.
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  // Magnetic buttons: pull slightly toward the cursor, spring back on leave.
  document.querySelectorAll(".magnetic").forEach((button) => {
    const strength = 0.12;
    button.addEventListener("pointermove", (e) => {
      if (button.disabled) return;
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength * 2;
      button.style.setProperty("--tx", `${x.toFixed(1)}px`);
      button.style.setProperty("--ty", `${y.toFixed(1)}px`);
    });
    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--tx", "0px");
      button.style.setProperty("--ty", "0px");
    });
  });
})();
