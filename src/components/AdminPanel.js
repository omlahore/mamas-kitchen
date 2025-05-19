// src/components/AdminPanel.js
import { auth, db }              from "../firebaseConfig.js";
import { signOut }               from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
}                                from "firebase/firestore";
import { uploadDishImage }       from "../services/imageService.js";

export function AdminPanel(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex justify-between items-center mb-10">
        <h2 class="text-4xl font-bold text-brand-700">Admin Dashboard</h2>
        <button
          id="logoutBtn"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <!-- Main Grid: Form | List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Panel -->
        <div class="bg-neutral-100 p-8 rounded-xl shadow-lg">
          <h3 class="text-2xl font-semibold mb-6 text-brand-700">Add New Dish</h3>
          <form id="dishForm" class="space-y-5">
            <div>
              <label for="name" class="block mb-1 font-medium">Dish Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. OG Paratha"
                class="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
                required
              >
            </div>

            <div>
              <label for="desc" class="block mb-1 font-medium">Description</label>
              <input
                type="text"
                id="desc"
                name="desc"
                placeholder="Short description"
                class="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
                required
              >
            </div>

            <div>
              <label for="price" class="block mb-1 font-medium">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="e.g. 99"
                class="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
                required
              >
            </div>

            <div>
              <label for="category" class="block mb-1 font-medium">Category</label>
              <select
                id="category"
                name="category"
                class="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
            </div>

            <div>
              <label for="imageFile" class="block mb-1 font-medium">Image</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                class="w-full text-sm text-neutral-500 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-brand-50 file:text-brand-700
                       hover:file:bg-brand-100"
              />
            </div>

            <button
              type="submit"
              class="w-full mt-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition"
            >
              Add Dish
            </button>
          </form>
        </div>

        <!-- List Panel -->
        <div class="lg:col-span-2">
          <div id="dishesList" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"></div>
        </div>
      </div>
    </section>
  `;

  // Logout
  container.querySelector("#logoutBtn").onclick = () => signOut(auth);

  // Firestore collection reference
  const colRef = collection(db, "menuItems");

  // Real-time listener
  onSnapshot(colRef, snapshot => {
    const listEl = container.querySelector("#dishesList");
    listEl.innerHTML = "";

    snapshot.docs.forEach(docSnap => {
      const { name, desc, price, imageUrl } = docSnap.data();

      const card = document.createElement("div");
      card.className = `
        bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition
        flex flex-col
      `;
      card.innerHTML = `
        <div class="h-48 bg-neutral-200">
          <img
            src="${imageUrl}"
            alt="${name}"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <h4 class="text-lg font-bold text-brand-700 mb-2">${name}</h4>
          <p class="text-neutral-600 flex-1">${desc}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xl font-semibold text-brand-700">₹${price}</span>
            <div class="space-x-2">
              <button
                data-id="${docSnap.id}"
                class="editBtn px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition"
              >
                Edit
              </button>
              <button
                data-id="${docSnap.id}"
                class="delBtn px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `;

      // Edit handler
      card.querySelector(".editBtn").onclick = async () => {
        const newPrice = prompt("New price:", price);
        if (newPrice !== null) {
          await updateDoc(doc(db, "menuItems", docSnap.id), {
            price: Number(newPrice)
          });
        }
      };

      // Delete handler
      card.querySelector(".delBtn").onclick = () =>
        deleteDoc(doc(db, "menuItems", docSnap.id));

      listEl.append(card);
    });
  });

  // Form submission
  container.querySelector("#dishForm").onsubmit = async e => {
    e.preventDefault();
    const name     = e.target.name.value.trim();
    const desc     = e.target.desc.value.trim();
    const price    = Number(e.target.price.value);
    const category = e.target.category.value;
    const file     = e.target.imageFile.files[0];

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadDishImage(file);
      }
      await addDoc(colRef, {
        name,
        desc,
        price,
        category,
        imageUrl,
        createdAt: Date.now(),
      });
      e.target.reset();
    } catch (err) {
      console.error("Failed to add dish:", err);
      alert("Error: " + err.message);
    }
  };
}
