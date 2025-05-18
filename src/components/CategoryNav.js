// src/components/CategoryNav.js
export function CategoryNav(container) {
  const cats = ["All", "Breakfast", "Lunch", "Dinner"];
  const nav  = document.createElement("div");
  nav.className = "flex gap-3 flex-wrap";

  cats.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;
    btn.className   = i === 0
      ? "px-5 py-2 text-sm font-semibold rounded-full bg-brand-500 text-white transition-colors"
      : "px-5 py-2 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors";

    btn.addEventListener("click", () => {
      // Toggle active styling
      nav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-gray-200", "text-gray-700");
          b.classList.add("bg-brand-500", "text-white");
        } else {
          b.classList.remove("bg-brand-500", "text-white");
          b.classList.add("bg-gray-200", "text-gray-700");
        }
      });

      // Emit the change
      container.dispatchEvent(new CustomEvent("categoryChange", { detail: name }));
    });

    nav.appendChild(btn);
  });

  container.appendChild(nav);
}
