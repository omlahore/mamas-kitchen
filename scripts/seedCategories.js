// scripts/seedCategories.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

// ← use the *same* config from your src/firebaseConfig.js
const firebaseConfig = {
  apiKey:            "AIzaSyBxecknqywP2VJVTaaQ7aQap9iz4d0BlaA",
  authDomain:        "mamas-kithcen.firebaseapp.com",
  projectId:         "mamas-kithcen",
  storageBucket:     "mamas-kitchen.firebasestorage.app",
  messagingSenderId: "776865061393",
  appId:             "1:776865061393:web:67919e6a0b10264aef2fb0",
  measurementId:     "G-RMZQTCM6C8"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function seedCategories() {
  // 1) grab every menuItem's category field
  const itemsSnap = await getDocs(collection(db, "menuItems"));
  const names = new Set(itemsSnap.docs.map(d => d.data().category));

  for (let name of names) {
    // derive a stable doc-ID (so you don't accidentally duplicate)
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const ref = doc(db, "categories", id);
    const exists = (await getDoc(ref)).exists();
    if (!exists) {
      await setDoc(ref, { name, subcategories: [] });
      console.log("Created category:", name);
    }
  }

  console.log("✅ Migration complete.");
  process.exit(0);
}

seedCategories().catch(err => {
  console.error(err);
  process.exit(1);
});
