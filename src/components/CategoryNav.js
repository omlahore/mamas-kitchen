// src/components/CategoryNav.js

export function CategoryNav(container, categories = []) {
  // clear any existing buttons
  container.innerHTML = "";

  // wrap
  const nav = document.createElement("div");
  nav.className = "flex gap-3 flex-wrap uppercase";

  categories.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;

    // first one (“All”) gets the active styling by default
    btn.className = i === 0
      ? "px-5 py-2 text-sm font-semibold rounded-full bg-brand-500 text-white transition-colors"
      : "px-5 py-2 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors";

    btn.addEventListener("click", () => {
      // toggle active classes
      nav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-gray-200", "text-gray-700");
          b.classList.add("bg-brand-500", "text-white");
        } else {
          b.classList.remove("bg-brand-500", "text-white");
          b.classList.add("bg-gray-200", "text-gray-700");
        }
      });

      // dispatch with bubbling so MenuGrid can catch it
      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });

    nav.appendChild(btn);
  });

  container.appendChild(nav);
}
