// src/main.js
import "./input.css";
import { auth }               from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

const app = document.getElementById("app");
const isAdmin = () => location.pathname.endsWith("/admin");

// Unregister service worker in development
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Unregister any existing service workers in development
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('[Service Worker] Unregistered for development');
      }
    });
  } else {
    // Register Service Worker for caching and offline support (production only)
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[Service Worker] Registered successfully:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.log('[Service Worker] Registration failed:', error);
        });
    });
  }
}

// Show loading state
function showLoading() {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  `;
}

// Lazy load components for code splitting
async function loadAdminPanel() {
  const { AdminPanel } = await import("./components/AdminPanel.js");
  return AdminPanel;
}

async function loadLoginForm() {
  const { LoginForm } = await import("./components/LoginForm.js");
  return LoginForm;
}

async function loadMenuGrid() {
  const { MenuGrid } = await import("./components/MenuGrid.js");
  return MenuGrid;
}

onAuthStateChanged(auth, async user => {
  showLoading();
  
  try {
    if (isAdmin()) {
      if (user) {
        const AdminPanel = await loadAdminPanel();
        AdminPanel(app);
      } else {
        const LoginForm = await loadLoginForm();
        LoginForm(app);
      }
    } else {
      const MenuGrid = await loadMenuGrid();
      MenuGrid(app);
    }
  } catch (error) {
    console.error("Error loading component:", error);
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <p class="text-red-600">Error loading page. Please refresh.</p>
        </div>
      </div>
    `;
  }
});
