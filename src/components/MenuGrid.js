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

export function MenuGrid(container) {
  // 1️⃣ Clear & mount the hero
  container.innerHTML = "";
  HeroCarousel(container);

  // 2️⃣ Glass-blur toolbar (search + dynamic tabs)
  const toolbar = document.createElement("div");
  toolbar.className = "sticky top-0 z-20 bg-white/10 backdrop-blur-md shadow-md";
  toolbar.innerHTML = `
    <div class="container mx-auto px-6 py-6 flex flex-col items-center gap-6">
      <div class="relative w-full max-w-xl">
        <input id="searchInput"
               type="text"
               placeholder="Search dishes..."
               class="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm
                      placeholder-gray-500 rounded-full border border-white/30
                      focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
        <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
             width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <div id="navContainer" class="w-full flex flex-wrap justify-center gap-4"></div>
    </div>
  `;
  container.append(toolbar);

  // 3️⃣ Grid container
  const grid = document.createElement("div");
  grid.id = "menuGrid";
  grid.className = "container mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3";
  container.append(grid);

  // 4️⃣ Local state
  let allItems      = [];
  let currentCat    = "ALL";
  let currentSearch = "";

  // 5️⃣ Search handler
  const searchEl = toolbar.querySelector("#searchInput");
  searchEl.addEventListener("input", e => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderItems();
  });

  // 6️⃣ Category-change listener
  toolbar.addEventListener("categoryChange", e => {
    currentCat = e.detail.toUpperCase();
    renderItems();
  });

  // 7️⃣ Firestore subscription & dynamic nav build
  const q = query(collection(db, "menuItems"), orderBy("createdAt", "desc"));
  onSnapshot(q, snap => {
    allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // build unique category list
    const cats = Array.from(new Set(allItems.map(i => i.category)));
    CategoryNav(toolbar.querySelector("#navContainer"), ["All", ...cats]);

    renderItems();
  });

  // 8️⃣ Render & animate
  function renderItems() {
    grid.innerHTML = "";

    // prepare currency formatter for AED
    const fmt = new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0
    });

    // apply filters
    let items = allItems.filter(item =>
      currentCat === "ALL" || item.category.toUpperCase() === currentCat
    );
    if (currentSearch) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(currentSearch) ||
        item.desc.toLowerCase().includes(currentSearch)
      );
    }

    // build cards
    items.forEach(item => {
      const {
        name,
        desc,
        imageUrl,
        category,
        price,
        priceWithChai // optional field
      } = item;

      const card = document.createElement("div");
      card.className = [
        "group relative bg-white rounded-2xl shadow-lg overflow-hidden",
        "transition transform hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
      ].join(" ");

      card.innerHTML = `
        <div class="relative h-56 overflow-hidden">
          <img src="${imageUrl}" alt="${name}"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-6 text-center font-sans">
          <span class="inline-block bg-brand-100 text-brand-700 text-xs font-semibold
                       px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            ${category}
          </span>
          <h3 class="text-3xl uppercase font-bold text-neutral-900 mb-2">
            ${name}
          </h3>
          <p class="text-neutral-700 text-base">
            ${desc}
          </p>
          <!-- main price in AED -->
          <p class="mt-4 text-xl font-semibold text-neutral-900">
            ${fmt.format(price)}
          </p>
          <!-- optional “with chai” price -->
          ${
            priceWithChai != null
              ? `<p class="mt-1 text-sm italic text-neutral-700">
                   ${fmt.format(priceWithChai)} with chai
                 </p>`
              : ``
          }
        </div>
      `;
      grid.append(card);
    });

    // fade in / stagger
    gsap.fromTo(
      grid.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  }
}
