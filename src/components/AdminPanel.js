// src/components/AdminPanel.js
import { auth, db }     from "../firebaseConfig.js";
import { signOut }      from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
}                     from "firebase/firestore";
import { uploadDishImage } from "../services/imageService.js";

export function AdminPanel(container) {
  container.innerHTML = `
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-semibold">Admin Dashboard</h2>
      <button id="logoutBtn" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Logout
      </button>
    </div>

    <!-- Dish Form Card -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-xl font-medium mb-4">Add New Dish</h3>
      <form id="dishForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input type="text"     id="name"      placeholder="Dish Name"
               class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" required />

        <input type="text"     id="desc"      placeholder="Description"
               class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" required />

        <input type="number"   id="price"     placeholder="Price"
               class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" required />

        <select id="category"
                class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400">
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>

        <input type="file" id="imageFile"
               class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" accept="image/*" />

        <button type="submit"
                class="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Add Dish
        </button>
      </form>
    </div>

    <!-- Dishes List -->
    <div id="dishesList" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
  `;

  // Logout handler
  container.querySelector("#logoutBtn").onclick = () => signOut(auth);

  // Real-time listener for menuItems
  const colRef = collection(db, "menuItems");
  onSnapshot(colRef, snapshot => {
    const list = container.querySelector("#dishesList");
    list.innerHTML = ""; 
    snapshot.docs.forEach(docSnap => {
      const { name, desc, price, imageUrl } = docSnap.data();
      const card = document.createElement("div");
      card.className = "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden";
      card.innerHTML = `
        <div class="h-40 bg-gray-100">
          <img src="${imageUrl}" alt="${name}"
               class="h-full w-full object-cover" />
        </div>
        <div class="p-4">
          <h4 class="text-lg font-semibold">${name}</h4>
          <p class="text-gray-600 mt-1">${desc}</p>
          <p class="text-indigo-600 font-bold mt-2">₹${price}</p>
          <div class="mt-4 flex space-x-2">
            <button data-id="${docSnap.id}"
                    class="editBtn px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">
              Edit
            </button>
            <button data-id="${docSnap.id}"
                    class="delBtn px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition">
              Delete
            </button>
          </div>
        </div>
      `;
      // Edit handler
      card.querySelector(".editBtn").onclick = async () => {
        const newPrice = prompt("New price:", price);
        if (newPrice !== null) {
          await updateDoc(doc(db, "menuItems", docSnap.id), { price: Number(newPrice) });
        }
      };
      // Delete handler
      card.querySelector(".delBtn").onclick = () =>
        deleteDoc(doc(db, "menuItems", docSnap.id));
      list.append(card);
    });
  });

  // in src/components/AdminPanel.js, replace your onsubmit with this:

container.querySelector("#dishForm").onsubmit = async e => {
  e.preventDefault();

  // grab values
  const name     = e.target.name.value.trim();
  const desc     = e.target.desc.value.trim();
  const price    = Number(e.target.price.value);
  const category = e.target.category.value;
  const file     = e.target.imageFile.files[0];

  console.log("[AdminPanel] Submitting:", { name, desc, price, category, file });

  try {
    let imageUrl = "";

    if (file) {
      console.log("[AdminPanel] Uploading image…");
      imageUrl = await uploadDishImage(file);
      console.log("[AdminPanel] Image URL:", imageUrl);
    }

    const docRef = await addDoc(colRef, {
      name,
      desc,
      price,
      category,
      imageUrl,
      createdAt: Date.now(),
    });
    console.log("[AdminPanel] Document written with ID:", docRef.id);

    e.target.reset();
  } catch (err) {
    console.error("[AdminPanel] Error adding dish:", err);
    alert("Failed to add dish: " + err.message);
  }
};

}