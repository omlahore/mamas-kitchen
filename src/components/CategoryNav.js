// src/components/CategoryNav.js

export function CategoryNav(container, categories = []) {
  // clear out any old buttons
  container.innerHTML = "";

  // nav wrapper
  const nav = document.createElement("div");
  nav.className = "flex flex-wrap justify-center gap-4";

  categories.forEach((name, i) => {
    // skip blanks
    if (!name || !name.trim()) return;

    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;

    // active = teal bg + white text; inactive = semi-opaque white bg + dark text
    btn.className = [
      "px-6 py-3 text-lg font-semibold rounded-full transition",
      i === 0
        ? "bg-brand-500 text-white"
        : "bg-white/70 text-neutral-900 hover:bg-white/90"
    ].join(" ");

    btn.addEventListener("click", () => {
      nav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-white/70", "text-neutral-900", "hover:bg-white/90");
          b.classList.add("bg-brand-500", "text-white");
        } else {
          b.classList.remove("bg-brand-500", "text-white");
          b.classList.add("bg-white/70", "text-neutral-900", "hover:bg-white/90");
        }
      });

      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });

    nav.appendChild(btn);
  });

  container.appendChild(nav);
}
