// src/components/LoginForm.js
import { auth } from "../firebaseConfig.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export function LoginForm(container) {
  // Clear anything previously rendered
  container.innerHTML = "";

  // Render full-page hero + glass card
  container.innerHTML = `
    <div
      class="min-h-screen bg-[url('/hero2.jpg')] bg-cover bg-center relative flex items-center justify-center"
    >
      <!-- dark overlay -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- glass card -->
      <div
        class="relative z-10 w-full max-w-md p-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl"
      >
        <h2 class="text-center text-3xl font-bold text-white mb-6">
          Admin Login
        </h2>
        <form id="loginForm" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-white">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              class="mt-1 w-full px-4 py-2 rounded bg-white/80 text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-white">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              class="mt-1 w-full px-4 py-2 rounded bg-white/80 text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white
                   font-semibold rounded transition"
          >
            SIGN IN
          </button>
        </form>
        <p id="error" class="mt-4 text-sm text-red-400 text-center"></p>
      </div>
    </div>
  `;

  const errorEl = container.querySelector("#error");
  container.querySelector("#loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const pass  = e.target.password.value;
    errorEl.textContent = "";
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      errorEl.textContent = "Invalid credentials.";
    }
  };
}
