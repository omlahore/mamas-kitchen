// src/components/AdminPanel.js

import { auth, db }                   from "../firebaseConfig.js";
import { signOut }                    from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove
}                                      from "firebase/firestore";
import { uploadDishImage }            from "../services/imageService.js";

export function AdminPanel(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-6 py-10 space-y-10">

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-4xl font-bold text-brand-700">Admin Dashboard</h2>
        <button id="logoutBtn"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
          Logout
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- CATEGORY MANAGER (new) -->
        <div class="bg-neutral-100 p-8 rounded-xl shadow-lg lg:col-span-1">
          <h3 class="text-2xl font-semibold mb-6 text-brand-700">Manage Categories</h3>
          <div id="categoryManager" class="space-y-4"></div>
        </div>

        <!-- DISH FORM -->
        <div class="bg-neutral-100 p-8 rounded-xl shadow-lg lg:col-span-1">
          <h3 class="text-2xl font-semibold mb-6 text-brand-700">Add / Edit Dish</h3>
          <form id="dishForm" class="space-y-5">

            <!-- editing tracker -->
            <input type="hidden" id="docId" name="docId" value="" />

            <!-- Name, Desc, Price etc. -->
            <div>
              <label for="name" class="block mb-1 font-medium">Dish Name</label>
              <input type="text" id="name" name="name" placeholder="e.g. OG Paratha"
                     class="w-full border rounded-lg px-4 py-2 focus:ring-brand-300" required>
            </div>
            <div>
              <label for="desc" class="block mb-1 font-medium">Description</label>
              <input type="text" id="desc" name="desc" placeholder="Short description"
                     class="w-full border rounded-lg px-4 py-2 focus:ring-brand-300" required>
            </div>
            <div>
              <label for="price" class="block mb-1 font-medium">Price (₹)</label>
              <input type="number" id="price" name="price" placeholder="e.g. 99"
                     class="w-full border rounded-lg px-4 py-2 focus:ring-brand-300" required>
            </div>

            <!-- Category & Subcategory -->
            <div>
              <label for="category" class="block mb-1 font-medium">Category</label>
              <select id="category" name="category"
                      class="w-full border rounded-lg px-4 py-2 focus:ring-brand-300"></select>
            </div>
            <div id="subcategoryContainer" class="hidden">
              <label for="subcategory" class="block mb-1 font-medium">Subcategory</label>
              <select id="subcategory" name="subcategory"
                      class="w-full border rounded-lg px-4 py-2 focus:ring-brand-300"></select>
            </div>

            <!-- Image Upload -->
            <div>
              <label for="imageFile" class="block mb-1 font-medium">Image</label>
              <input type="file" id="imageFile" name="imageFile" accept="image/*"
                     class="file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700"/>
            </div>

            <!-- Chai Option -->
            <div class="flex items-center space-x-2">
              <input type="checkbox" id="withChai" name="withChai"
                     class="h-4 w-4 text-green-600 border-gray-300 rounded"/>
              <label for="withChai" class="font-medium">With Chai?</label>
            </div>
            <div id="chaiPriceContainer" class="mt-4 hidden">
              <label for="chaiPrice" class="block mb-1 font-medium">Chai Price (₹)</label>
              <input type="number" id="chaiPrice" name="chaiPrice" placeholder="e.g. 20"
                     class="w-full border rounded-lg px-4 py-2 focus:ring-green-300"/>
            </div>

            <!-- Submit -->
            <button type="submit"
                    class="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
              <span id="formAction">Add Dish</span>
            </button>
          </form>
        </div>

        <!-- DISH LIST -->
        <div class="lg:col-span-2">
          <div id="dishesList"
               class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"></div>
        </div>
      </div>
    </section>
  `;

  // ——— LOGIC BELOW ———

  // 1️⃣ Handle logout
  container.querySelector("#logoutBtn").onclick = () => signOut(auth);

  // 2️⃣ Show/hide Chai price
  const withChaiEl = container.querySelector("#withChai");
  const chaiPriceContainer = container.querySelector("#chaiPriceContainer");
  withChaiEl.addEventListener("change", () => {
    chaiPriceContainer.classList.toggle("hidden", !withChaiEl.checked);
  });

  // 3️⃣ Firestore refs & state
  const catCol = collection(db, "categories");
  const dishCol = collection(db, "menuItems");
  let categories = [];

  // 4️⃣ Subscribe to categories → render manager & form selects
  onSnapshot(catCol, snap => {
    categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderCategoryManager();
    populateDishFormCategories();
  });

  // 5️⃣ Render the category manager UI
  function renderCategoryManager() {
    const mgr = container.querySelector("#categoryManager");
    mgr.innerHTML = "";

    // — Add New Category —
    const addCatDiv = document.createElement("div");
    addCatDiv.className = "flex gap-2";
    addCatDiv.innerHTML = `
      <input id="newCatName" type="text" placeholder="New category"
             class="flex-1 border rounded-lg px-2 py-1"/>
      <button id="addCatBtn"
              class="px-4 bg-blue-600 text-white rounded-lg">Add</button>
    `;
    mgr.append(addCatDiv);

    addCatDiv.querySelector("#addCatBtn").onclick = async () => {
      const name = addCatDiv.querySelector("#newCatName").value.trim();
      if (!name) return alert("Enter a category name");
      await addDoc(catCol, { name, subcategories: [] });
      addCatDiv.querySelector("#newCatName").value = "";
    };

    // — List existing —
    categories.forEach(cat => {
      const catDiv = document.createElement("div");
      catDiv.className = "border p-2 rounded-lg";

      // header with delete
      const header = document.createElement("div");
      header.className = "flex justify-between items-center mb-2";
      header.innerHTML = `<strong>${cat.name}</strong>
        <button class="text-red-600">Delete</button>`;
      header.querySelector("button").onclick = () =>
        deleteDoc(doc(db, "categories", cat.id));
      catDiv.append(header);

      // subcategory list + add
      const sublist = document.createElement("div");
      sublist.className = "flex flex-wrap gap-2 mb-2";
      cat.subcategories.forEach(sub => {
        const pill = document.createElement("span");
        pill.className =
          "px-2 py-1 bg-brand-100 rounded-full flex items-center gap-1";
        pill.innerHTML = `${sub} <button data-sub="${sub}">&times;</button>`;
        pill.querySelector("button").onclick = () =>
          updateDoc(doc(db, "categories", cat.id), {
            subcategories: arrayRemove(sub)
          });
        sublist.append(pill);
      });
      catDiv.append(sublist);

      // add-sub UI
      const addSubDiv = document.createElement("div");
      addSubDiv.className = "flex gap-2";
      addSubDiv.innerHTML = `
        <input type="text" placeholder="New subcategory"
               class="flex-1 border rounded-lg px-2 py-1"/>
        <button class="px-3 bg-green-600 text-white rounded-lg">+ Sub</button>
      `;
      addSubDiv.querySelector("button").onclick = async () => {
        const val = addSubDiv.querySelector("input").value.trim();
        if (!val) return;
        await updateDoc(doc(db, "categories", cat.id), {
          subcategories: arrayUnion(val)
        });
        addSubDiv.querySelector("input").value = "";
      };
      catDiv.append(addSubDiv);

      mgr.append(catDiv);
    });
  }

  // 6️⃣ Populate the Dish form’s category & subcategory selects
  function populateDishFormCategories() {
    const catSel = container.querySelector("#category");
    const subCont = container.querySelector("#subcategoryContainer");
    const subSel = container.querySelector("#subcategory");

    // clear and fill category dropdown
    catSel.innerHTML = `<option value="">Select Category</option>`;
    categories.forEach(c =>
      catSel.insertAdjacentHTML(
        "beforeend",
        `<option value="${c.name}">${c.name}</option>`
      )
    );

    // when category changes, show/hide subcategory
    catSel.onchange = () => {
      const sel = catSel.value;
      const catObj = categories.find(c => c.name === sel);
      if (catObj && catObj.subcategories.length) {
        subSel.innerHTML = `<option value="">Select Subcategory</option>`;
        catObj.subcategories.forEach(s =>
          subSel.insertAdjacentHTML(
            "beforeend",
            `<option value="${s}">${s}</option>`
          )
        );
        subCont.classList.remove("hidden");
      } else {
        subCont.classList.add("hidden");
        subSel.innerHTML = "";
      }
    };
  }

  // 7️⃣ Dish-list subscription (unchanged)
  onSnapshot(dishCol, snapshot => {
    const listEl = container.querySelector("#dishesList");
    listEl.innerHTML = "";
    snapshot.docs.forEach(docSnap => {
      const {
        name, desc, price, category, subcategory,
        imageUrl = "", withChai, chaiPrice
      } = docSnap.data();

      const card = document.createElement("div");
      card.className = `
        bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition
        flex flex-col
      `;
      card.innerHTML = `
        <div class="h-48 bg-neutral-200">
          <img src="${imageUrl}" alt="${name}" class="h-full w-full object-cover"/>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <h4 class="text-lg font-bold text-brand-700 mb-2">${name}</h4>
          <p class="text-neutral-600 flex-1">${desc}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xl font-semibold text-brand-700">₹${price}</span>
            ${withChai
              ? `<span class="text-green-600 font-medium">+ ₹${chaiPrice} Chai</span>`
              : ``
            }
          </div>
          <p class="mt-1 text-sm text-gray-500">
            ${category}${subcategory ? " → " + subcategory : ""}
          </p>
          <div class="mt-4 flex items-center justify-end space-x-2">
            <button data-id="${docSnap.id}"
                    class="editBtn px-3 py-1 bg-yellow-400 text-white rounded-lg">Edit</button>
            <button data-id="${docSnap.id}"
                    class="delBtn px-3 py-1 bg-red-400 text-white rounded-lg">Delete</button>
          </div>
        </div>
      `;

      // Edit prefill (now includes subcategory)
      card.querySelector(".editBtn").onclick = () => {
        const data = docSnap.data();
        const form = container.querySelector("#dishForm");
        form.name.value       = data.name;
        form.desc.value       = data.desc;
        form.price.value      = data.price;
        form.category.value   = data.category;
        form.docId.value      = docSnap.id;
        form.withChai.checked = !!data.withChai;
        if (data.withChai) {
          chaiPriceContainer.classList.remove("hidden");
          form.chaiPrice.value = data.chaiPrice;
        } else {
          chaiPriceContainer.classList.add("hidden");
          form.chaiPrice.value = "";
        }
        // trigger subcategory population
        populateDishFormCategories();
        form.category.onchange();
        form.subcategory.value = data.subcategory || "";
        form.imageFile.value = ""; // clear file input
        document.querySelector("#formAction").textContent = "Save Changes";
        form.scrollIntoView({ behavior: "smooth" });
      };

      // Delete dish
      card.querySelector(".delBtn").onclick = () =>
        deleteDoc(doc(db, "menuItems", docSnap.id));

      listEl.append(card);
    });
  });

  // 8️⃣ Dish Form submit (add/update with subcategory)
  container.querySelector("#dishForm").onsubmit = async (e) => {
    e.preventDefault();
    const form    = e.target;
    const docId   = form.docId.value;
    const name    = form.name.value.trim();
    const desc    = form.desc.value.trim();
    const price   = Number(form.price.value);
    const category= form.category.value;
    const subcat  = form.subcategory ? form.subcategory.value : "";
    const file    = form.imageFile.files[0];
    const withChai= form.withChai.checked;
    const chaiPr  = withChai ? Number(form.chaiPrice.value) : null;

    if (withChai && (!chaiPr || chaiPr <= 0)) {
      return alert("Please enter a valid Chai price.");
    }

    try {
      let imageUrl = "";
      if (file) imageUrl = await uploadDishImage(file);

      const payload = {
        name, desc, price,
        category, subcategory: subcat,
        imageUrl, withChai, chaiPrice: chaiPr,
        ...( !docId && { createdAt: Date.now() } )
      };

      if (docId) {
        await updateDoc(doc(db, "menuItems", docId), payload);
        alert("Dish updated!");
      } else {
        await addDoc(dishCol, payload);
        alert("Dish added!");
      }

      form.reset();
      form.docId.value = "";
      container.querySelector("#formAction").textContent = "Add Dish";
      chaiPriceContainer.classList.add("hidden");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };
}
