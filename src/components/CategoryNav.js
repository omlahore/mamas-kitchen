// src/components/CategoryNav.js

export function CategoryNav(container, categories = []) {
  // clear any old buttons
  container.innerHTML = "";

  const nav = document.createElement("div");
  nav.className = "flex flex-wrap justify-center gap-4";

  categories.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;

    // uniform base style + size
    btn.className = [
      "px-6 py-3 text-lg font-semibold rounded-full transition",
      i === 0
        // active by default on first (All)
        ? "bg-brand-500 text-white"
        : "bg-white/70 text-neutral-900 hover:bg-white/90"
    ].join(" ");

    btn.addEventListener("click", () => {
      // swap active/inactive
      nav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-white/70","text-neutral-900");
          b.classList.add("bg-brand-500","text-white");
        } else {
          b.classList.remove("bg-brand-500","text-white");
          b.classList.add("bg-white/70","text-neutral-900");
        }
      });

      // bubble up the choice
      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });

    nav.appendChild(btn);
  });

  container.appendChild(nav);
}
