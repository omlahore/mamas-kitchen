// src/components/CategoryNav.js

export function CategoryNav(container, categoryData = []) {
  // 1️⃣ Build category list & sub-map from Firestore data
  const filtered = categoryData.filter(
    c => c.name && c.name.trim() && c.name.toLowerCase() !== "chai"
  );

  // Insert "All" at the front:
  const mainCats = ["All", ...filtered.map(c => c.name.trim())];

  const subcatMap = filtered.reduce((acc, c) => {
    acc[c.name.trim().toUpperCase()] = c.subcategories || [];
    return acc;
  }, {});

  // 2️⃣ Clear container
  container.innerHTML = "";
  container.className = "w-full flex flex-col items-center gap-4";

  // 3️⃣ Main nav
  const mainNav = document.createElement("div");
  mainNav.className =
    "w-full flex flex-wrap justify-center gap-4 " +
    "bg-brand-500/10 p-4 rounded-xl";
  container.appendChild(mainNav);

  // 4️⃣ Sub nav
  const subNav = document.createElement("div");
  subNav.className =
    "w-full flex flex-wrap justify-center gap-2 " +
    "bg-brand-500/5 p-2 rounded-lg";
  container.appendChild(subNav);

  // 5️⃣ Track selection
  let selectedMain = mainCats[0];

  // 6️⃣ renderSubNav: for “All” we’ll get [] and clear the bar
  function renderSubNav(mainName) {
    subNav.innerHTML = "";
    const key = mainName.toUpperCase();
    const subs = subcatMap[key] || [];

    // collapse Desserts+Drinks if both
    const toRender =
      subs.includes("Desserts") && subs.includes("Drinks")
        ? subs.filter(s => s !== "Desserts" && s !== "Drinks").concat("Desserts & Drinks")
        : subs.slice();

    toRender.forEach((sub, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = sub;
      btn.dataset.sub = sub;
      btn.className = [
        "px-4 py-2 text-sm font-sans font-medium antialiased tracking-wide rounded-full border transition-colors duration-200",
        i === 0
          ? "bg-brand-500 text-white border-brand-500"
          : "bg-white text-neutral-900 border-brand-500 hover:bg-white/90"
      ].join(" ");
      btn.addEventListener("click", () => {
        subNav.querySelectorAll("button").forEach(b => {
          if (b === btn) {
            b.classList.replace("bg-white", "bg-brand-500");
            b.classList.replace("text-neutral-900", "text-white");
          } else {
            b.classList.replace("bg-brand-500", "bg-white");
            b.classList.replace("text-white", "text-neutral-900");
          }
        });
        const payload = sub === "Desserts & Drinks"
          ? ["Desserts", "Drinks"]
          : sub;
        container.dispatchEvent(new CustomEvent("subcategoryChange", {
          detail: payload, bubbles: true
        }));
      });
      subNav.appendChild(btn);
    });

    // no default for “All” (toRender likely empty)
    if (toRender.length) {
      const first = toRender[0];
      const payload = first === "Desserts & Drinks"
        ? ["Desserts", "Drinks"]
        : first;
      container.dispatchEvent(new CustomEvent("subcategoryChange", {
        detail: payload, bubbles: true
      }));
    }
  }

  // 7️⃣ Build main buttons (including “All”)
  mainCats.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    btn.dataset.cat = name;
    btn.className = [
      "px-6 py-3 text-lg font-sans font-medium antialiased tracking-wide rounded-full border transition-colors duration-200",
      i === 0
        ? "bg-brand-500 text-white border-brand-500"
        : "bg-white text-neutral-900 border-brand-500 hover:bg-white/90"
    ].join(" ");
    btn.addEventListener("click", () => {
      mainNav.querySelectorAll("button").forEach(b => {
        if (b === btn) {
          b.classList.replace("bg-white", "bg-brand-500");
          b.classList.replace("text-neutral-900", "text-white");
        } else {
          b.classList.replace("bg-brand-500", "bg-white");
          b.classList.replace("text-white", "text-neutral-900");
        }
      });
      selectedMain = name;
      renderSubNav(selectedMain);
      container.dispatchEvent(new CustomEvent("categoryChange", {
        detail: name,
        bubbles: true
      }));
    });
    mainNav.appendChild(btn);
  });

  // 8️⃣ Initial render of sub-nav
  if (selectedMain) {
    renderSubNav(selectedMain);
  }
}
