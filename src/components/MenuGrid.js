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

  // 2️⃣ Prepare toolbar container with placeholders
  const toolbar = document.createElement("div");
  toolbar.className = "container mx-auto px-6 py-4";
toolbar.innerHTML = `
  <div class="bg-brand-500/10 backdrop-blur-md shadow-md p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
    <!-- CategoryNav will render its mainNav+subNav here -->
    <div id="navContainer" class="flex-1"></div>

    <!-- Sort dropdown -->
    <select id="sortSelect"
            class="px-4 py-2 rounded-full border border-white/30 bg-white/50
                   focus:outline-none focus:ring-2 focus:ring-brand-500 transition">
      <option value="">Sort</option>
      <option value="name">Name: A → Z</option>
      <option value="price">Price: Low → High</option>
    </select>
  </div>
`;
  container.append(toolbar);

  // 3️⃣ Grid container
  const grid = document.createElement("div");
  grid.id = "menuGrid";
  grid.className =
    "container mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3";
  container.append(grid);

  // 4️⃣ Local state
  let allItems = [];
  let currentCat = "ALL";
  let currentSub = "";
  let currentSort = "";

  // 5️⃣ Sort handler
  toolbar
    .querySelector("#sortSelect")
    .addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderItems();
    });

  // 6️⃣ Category & subcategory listeners
  toolbar.addEventListener("categoryChange", (e) => {
    currentCat = e.detail.toUpperCase();
    currentSub = "";
    renderItems();
  });
  toolbar.addEventListener("subcategoryChange", (e) => {
    currentSub = e.detail;
    renderItems();
  });

  // 7️⃣ Firestore subscription & dynamic nav build
  const q = query(
    collection(db, "menuItems"),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, (snap) => {
    allItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const cats = Array.from(new Set(allItems.map((i) => i.category)));

    // Render nav into #navContainer
    CategoryNav(
      toolbar.querySelector("#navContainer"),
      ["All", ...cats]
    );

    // Now *pull* the Sort element into that first row (mainNav)
    const navContainer = toolbar.querySelector("#navContainer");
    const mainNav = navContainer.querySelector("div"); // first child is mainNav
    if (mainNav) {
      // 1) switch to space-between, center alignment
      mainNav.classList.replace("justify-center", "justify-between");
      mainNav.classList.add("items-center");

      // 2) wrap existing <button> siblings into a left-side flex group
      const buttons = Array.from(mainNav.querySelectorAll("button"));
      const leftGroup = document.createElement("div");
      // stretch and center the buttons
      leftGroup.className = "w-full flex flex-wrap justify-center items-center gap-4";
      buttons.forEach((b) => leftGroup.appendChild(b));

      // 3) clear mainNav, then re-append [leftGroup, sort]
      mainNav.innerHTML = "";
      mainNav.appendChild(leftGroup);

      const sortEl = toolbar.querySelector("#sortSelect");
     sortEl.classList.remove("mt-4");
  mainNav.classList.add("relative");
sortEl.classList.add("absolute", "right-4", "top-1/2", "-translate-y-1/2");
      mainNav.appendChild(sortEl);
    }

    renderItems();
  });

  // 8️⃣ Render & animate
  function renderItems() {
    grid.innerHTML = "";
    const fmt = new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    });

    // a) main category filter
    let items = allItems.filter(
      (i) => currentCat === "ALL" || i.category.toUpperCase() === currentCat
    );

    // b) subcategory filter
    if (currentSub) {
      items = Array.isArray(currentSub)
        ? items.filter((i) => currentSub.includes(i.subcategory))
        : items.filter((i) => i.subcategory === currentSub);
    }

    // c) sorting
    if (currentSort === "name") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === "price") {
      items.sort((a, b) => a.price - b.price);
    }

    // d) build cards
    items.forEach((item) => {
      const { name, desc, imageUrl, category, price, priceWithChai } = item;
      const card = document.createElement("div");
      card.className =
        "group relative bg-brand-500/5 rounded-2xl shadow-lg overflow-hidden flex flex-col transition transform hover:shadow-2xl hover:-translate-y-1 hover:scale-105";
      card.innerHTML = `
        <div class="relative h-56 overflow-hidden">
          <img src="${imageUrl}" alt="${name}"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-6 flex flex-col justify-between flex-grow text-center font-sans text-black">
          <div>
            <span class="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              ${category}
            </span>
            <h3 class="text-3xl uppercase font-heading mb-2 text-[#C19462]">${name}</h3>
            <p class="text-base mb-4">${desc}</p>
          </div>
          <div>
            <p class="text-xl font-semibold mb-1">${fmt.format(
              price
            )}</p>
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
      grid.append(card);
    });

    gsap.fromTo(
      grid.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  }

  // 9️⃣ Scroll-to-Top button
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
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;
      const pct = maxScroll > 0 ? Math.round((scrollY / maxScroll) * 100) : 0;
      btn.querySelector("#scrollPercent").textContent = `${pct}%`;

      if (scrollY > 300) {
        btn.classList.replace("opacity-0", "opacity-100");
        btn.classList.replace(
          "pointer-events-none",
          "pointer-events-auto"
        );
      } else {
        btn.classList.replace("opacity-100", "opacity-0");
        btn.classList.replace(
          "pointer-events-auto",
          "pointer-events-none"
        );
      }
    });
  })();
}
