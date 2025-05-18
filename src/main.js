// src/main.js
import { auth }               from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { AdminPanel }         from "./components/AdminPanel.js";
import { LoginForm }          from "./components/LoginForm.js";
import { MenuGrid }           from "./components/MenuGrid.js";
import "@splidejs/splide/dist/css/splide.min.css";


const app = document.getElementById("app");
const isAdmin = () => location.pathname.endsWith("/admin");

onAuthStateChanged(auth, user => {
  app.innerHTML = "";
  if (isAdmin()) {
    user ? AdminPanel(app) : LoginForm(app);
  } else {
    MenuGrid(app);
  }
});
