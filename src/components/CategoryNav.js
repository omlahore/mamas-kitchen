// src/components/CategoryNav.js

export function CategoryNav(container, categories = []) {
  // 1️⃣ Clear out any old buttons
  container.innerHTML = "";

  // 2️⃣ Create the nav wrapper
  const nav = document.createElement("div");
  nav.className = "flex flex-wrap justify-center gap-4";

  // 3️⃣ Build one button per category
  categories.forEach((name, i) => {
    // Skip any empty/blank category
    if (!name || !name.trim()) return;

    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;

    // Base sizing + padding + transition
    btn.className = [
      "px-6 py-3 text-lg font-semibold rounded-full transition",
      i === 0
        ? "bg-brand-500 text-white"          // First (“All”) active by default
        : "bg-white/70 text-neutral-900 hover:bg-white/90"
    ].join(" ");

    btn.addEventListener("click", () => {
      // Toggle active/inactive classes
      nav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-white/70", "text-neutral-900");
          b.classList.add("bg-brand-500", "text-white");
        } else {
          b.classList.remove("bg-brand-500", "text-white");
          b.classList.add("bg-white/70", "text-neutral-900");
        }
      });

      // Bubble the change up to MenuGrid
      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });

    nav.appendChild(btn);
  });

  // 4️⃣ Append the nav into the container
  container.appendChild(nav);
}
