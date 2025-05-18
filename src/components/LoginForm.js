// src/components/LoginForm.js
import { auth } from "../firebaseConfig.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export function LoginForm(container) {
  container.innerHTML = `
  <div class="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4 text-center">Admin Login</h2>
    <form id="loginForm" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input type="email" id="email" placeholder="you@example.com"
               class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium">Password</label>
        <input type="password" id="password" placeholder="••••••••"
               class="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>
      <button type="submit"
              class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Sign In
      </button>
    </form>
    <p id="error" class="mt-2 text-sm text-red-600 text-center"></p>
  </div>
`;


  container.querySelector("#loginForm").onsubmit = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const pass  = e.target.password.value;
    const errEl = container.querySelector("#error");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      errEl.textContent = "";
    } catch (err) {
      errEl.textContent = "Invalid credentials.";
    }
  };
}
