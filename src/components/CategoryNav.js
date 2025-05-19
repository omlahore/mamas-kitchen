// src/components/CategoryNav.js

export function CategoryNav(container, categories = []) {
  // 1️⃣ Clear any old buttons
  container.innerHTML = "";

  // 2️⃣ Make the container itself a teal‐tinted “glass” bar
  container.className =
    "w-full flex flex-wrap justify-center gap-4 " +
    "bg-brand-500/10 p-4 rounded-xl";

  // 3️⃣ Generate one button per category
  categories.forEach((name, i) => {
    if (!name || !name.trim()) return;  // skip blanks

    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;

    // 4️⃣ Active vs. inactive styles
    btn.className = [
      "px-6 py-3 text-lg font-semibold rounded-full border transition",
      i === 0
        // Active tab: solid teal bg, white text, teal border
        ? "bg-brand-500 text-white border-brand-500"
        // Inactive: white bg, dark text, teal border
        : "bg-white text-neutral-900 border-brand-500 hover:bg-white/90"
    ].join(" ");

    // 5️⃣ Click handler to swap active/inactive
    btn.addEventListener("click", () => {
      container.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-white", "text-neutral-900", "hover:bg-white/90");
          b.classList.add("bg-brand-500", "text-white", "border-brand-500");
        } else {
          b.classList.remove("bg-brand-500", "text-white");
          b.classList.add("bg-white", "text-neutral-900", "border-brand-500", "hover:bg-white/90");
        }
      });

      // bubble up so MenuGrid can filter
      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });

    container.appendChild(btn);
  });
}
