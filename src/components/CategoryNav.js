// src/components/CategoryNav.js

export function CategoryNav(container, categories = []) {
  // 1️⃣ Clear out any old buttons
  container.innerHTML = "";

  // 2️⃣ Nav wrapper
  const nav = document.createElement("div");
  nav.className = "flex flex-wrap justify-center gap-4";

  // 3️⃣ Build each button
  categories.forEach((name, i) => {
    // skip blanks
    if (!name || !name.trim()) return;

    const btn = document.createElement("button");
    btn.type        = "button";
    btn.textContent = name;
    btn.dataset.cat = name;

    // same backgrounds as before, but always white text
    btn.className = [
      "px-6 py-3 text-lg font-semibold rounded-full transition",
      i === 0
        ? "bg-brand-500 text-white"        // first = “All” active
        : "bg-white/70 text-white hover:bg-white/90"
    ].join(" ");

    btn.addEventListener("click", () => {
      // toggle classes
      nav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.remove("bg-white/70", "hover:bg-white/90");
          b.classList.add("bg-brand-500", "text-white");
        } else {
          b.classList.remove("bg-brand-500", "text-white");
          b.classList.add("bg-white/70", "text-white", "hover:bg-white/90");
        }
      });

      // bubble up the event
      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });

    nav.appendChild(btn);
  });

  // 4️⃣ Append to container
  container.appendChild(nav);
}
