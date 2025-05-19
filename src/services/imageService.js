// src/services/imageService.js

/**
 * Reads a File object as a base64 data URL.
 * No Firebase Storage, no CORS, just returns a string you can stick
 * directly into Firestore and then into an <img src="…" />.
 */
export async function uploadDishImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // e.g. "data:image/png;base64,iVBORw0KGgoAAAANS…"
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
