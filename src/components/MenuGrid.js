// src/components/MenuGrid.js

import { gsap } from "gsap";
import { HeroCarousel } from "./HeroCarousel.js";
import { CategoryNav } from "./CategoryNav.js";
import { db } from "../firebaseConfig.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

// ➤ Helper: builds a card element
function createCardElement(item, modal) {
  const { name, desc, imageUrl, category, price, priceWithChai } = item;
  const fmt = new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
  });

  const card = document.createElement("div");
  card.className =
    "group relative bg-brand-500/5 rounded-2xl shadow-lg overflow-hidden " +
    "flex flex-col transition-transform hover:shadow-2xl hover:-translate-y-1 hover:scale-105";

  card.innerHTML = `
    <div class="relative h-56 overflow-hidden cursor-pointer">
      <img src="${imageUrl}" alt="${name}"
           class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div class="p-6 flex flex-col justify-between flex-grow text-center font-sans text-black">
      <div>
        <span class="inline-block bg-brand-100 text-brand-700 text-xs font-semibold
                     px-3 py-1 rounded-full uppercase tracking-wide mb-4">
          ${category}
        </span>
        <h3 class="text-3xl uppercase font-heading mb-2 text-[#C19462]">${name}</h3>
        <p class="text-base mb-4">${desc}</p>
      </div>
      <div>
        <p class="text-xl font-semibold mb-1">${fmt.format(price)}</p>
        ${
          priceWithChai != null
            ? `<p class="text-sm italic">${fmt.format(
                priceWithChai
              )} with chai</p>`
            : ``
        }
      </div>
    </div>
  `;

  card
    .querySelector(".relative.h-56")
    .addEventListener("click", () => {
      if (imageUrl) {
        modal.querySelector("#modalImg").src = imageUrl;
        modal.classList.remove("hidden");
      }
    });

  return card;
}

export function MenuGrid(container) {
  // ❇️ LIGHTBOX
  const modal = document.createElement("div");
  modal.id = "imageModal";
  modal.className =
    "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 hidden";
  modal.innerHTML = `
    <div class="relative">
      <button id="closeModal"
              class="absolute top-2 right-2 text-white text-3xl leading-none">&times;</button>
      <img id="modalImg"
           src=""
           alt="Dish full view"
           class="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"/>
    </div>
  `;
  document.body.append(modal);
  modal.addEventListener("click", e => {
    if (e.target.id === "imageModal" || e.target.id === "closeModal") {
      modal.classList.add("hidden");
      modal.querySelector("#modalImg").src = "";
    }
  });

  // 1️⃣ Hero + clear
  container.innerHTML = "";
  HeroCarousel(container);

  // 2️⃣ Toolbar (no sort)
  const toolbar = document.createElement("div");
  toolbar.className = "container mx-auto px-6 py-4";
  toolbar.innerHTML = `
    <div class="bg-brand-500/10 backdrop-blur-md shadow-md p-4 rounded-xl flex items-center gap-4">
      <div id="navContainer" class="flex-1"></div>
    </div>
  `;
  container.append(toolbar);

  // 3️⃣ Grid placeholder
  const grid = document.createElement("div");
  grid.id = "menuGrid";
  grid.className =
    "container mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3";
  container.append(grid);

  // 4️⃣ State
  let allItems = [];
  let categoryData = [];
  let currentCat = "ALL";
  let currentSub = "";

  // 5️⃣ Listen for nav events
  toolbar.addEventListener("categoryChange", e => {
    currentCat = e.detail.toUpperCase();
    currentSub = "";
    renderItems();
  });
  toolbar.addEventListener("subcategoryChange", e => {
    currentSub = e.detail;
    renderItems();
  });

  // 6️⃣ Firestore subs

  // Categories (ordered by `order`)
  const catQ = query(collection(db, "categories"), orderBy("order", "asc"));
  onSnapshot(catQ, snap => {
    categoryData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    CategoryNav(toolbar.querySelector("#navContainer"), categoryData);
    renderItems();
  });

  // Menu items (ordered by `createdAt`)
  const itemsQ = query(collection(db, "menuItems"), orderBy("createdAt", "desc"));
  onSnapshot(itemsQ, snap => {
    allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderItems();
  });

  // 7️⃣ Render & animate
  function renderItems() {
    grid.innerHTML = "";
    const fmt = new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    });

    // Filter by cat
    let items = allItems.filter(
      i => currentCat === "ALL" || i.category.toUpperCase() === currentCat
    );
    // Then by sub
    if (currentSub) {
      items = Array.isArray(currentSub)
        ? items.filter(i => currentSub.includes(i.subcategory))
        : items.filter(i => i.subcategory === currentSub);
    }

    // ─── “ALL” view: use admin order & show every item ─────────
    if (currentCat === "ALL") {
      const grouped = items.reduce((acc, it) => {
        const cat = it.category;
        const sub = it.subcategory;
        acc[cat] = acc[cat] || {};
        acc[cat][sub] = acc[cat][sub] || [];
        acc[cat][sub].push(it);
        return acc;
      }, {});

      categoryData.forEach(({ name: catName, subcategories = [] }) => {
        const itemsBySub = grouped[catName];
        if (!itemsBySub) return;

        // Category header
        const catHeader = document.createElement("div");
        catHeader.className = "w-full flex justify-center my-6 col-span-full";
        catHeader.innerHTML = `
          <span
            class="px-6 py-2 text-2xl font-bold rounded-full
                   bg-brand-500 text-white uppercase">
            ${catName}
          </span>
        `;
        grid.append(catHeader);

        // If the admin defined subcategories, render in that order:
        if (subcategories.length) {
          subcategories.forEach(subName => {
            const arr = itemsBySub[subName];
            if (!arr) return;
            // Sub-header
            const subHeader = document.createElement("div");
            subHeader.className = "w-full flex justify-center my-4 col-span-full";
            subHeader.innerHTML = `
              <span
                class="px-6 py-2 text-lg font-semibold rounded-full
                       bg-brand-500 text-white shadow-md">
                ${subName}
              </span>
            `;
            grid.append(subHeader);
            // Cards
            const subGrid = document.createElement("div");
            subGrid.className =
              "w-full grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-8 col-span-full";
            arr.forEach(it => subGrid.append(createCardElement(it, modal)));
            grid.append(subGrid);
          });
        }
        // Otherwise, dump all items for this category in one flat grid:
        else {
          const allForCat = Object.values(itemsBySub).flat();
          const subGrid = document.createElement("div");
          subGrid.className =
            "w-full grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-8 col-span-full";
          allForCat.forEach(it => subGrid.append(createCardElement(it, modal)));
          grid.append(subGrid);
        }
      });

      return;
    }

    // ─── Single‐category flat layout ───────────────────────────
    items.forEach(item => grid.append(createCardElement(item, modal)));
    gsap.fromTo(
      grid.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  }

  // 8️⃣ Scroll-to-top (unchanged)…
  (function addScrollToTopButton() {
    const btn = document.createElement("button");
    btn.id = "scrollToTopBtn";
    btn.className =
      "fixed bottom-4 right-4 flex items-center justify-center gap-1 " +
      "p-3 rounded-full bg-brand-500 text-white shadow-lg " +
      "opacity-0 pointer-events-none transition-opacity duration-300";
    btn.innerHTML = `
      <span class="text-xl leading-none">↑</span>
      <span id="scrollPercent" class="text-sm">0%</span>
    `;
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    document.body.appendChild(btn);
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((scrollY / max) * 100) : 0;
      btn.querySelector("#scrollPercent").textContent = `${pct}%`;
      if (scrollY > 300) {
        btn.classList.replace("opacity-0", "opacity-100");
        btn.classList.replace("pointer-events-none", "pointer-events-auto");
      } else {
        btn.classList.replace("opacity-100", "opacity-0");
        btn.classList.replace("pointer-events-none", "pointer-events-none");
      }
    });
  })();
}
