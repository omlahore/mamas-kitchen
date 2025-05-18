// src/services/imageService.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig.js";

/**
 * Uploads a File to Firebase Storage under "menu-images/"
 * Returns the public download URL.
 */
export async function uploadDishImage(file) {
  const fileRef = ref(storage, `menu-images/${Date.now()}-${file.name}`);
  const snap    = await uploadBytes(fileRef, file);
  return getDownloadURL(snap.ref);
}
