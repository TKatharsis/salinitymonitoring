import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import MqttLogger from "../views/MQTTLogger.vue";
import LoginPage from "../views/LoginPage.vue";  // Import LoginPage

const routes = [
  { path: "/home", name: "Home", component: HomePage },  // Updated to /home
  {
    path: "/sensors",
    name: "Sensors",
    component: MqttLogger,
  },
  {
    path: "/login",  // New route for login
    name: "Login",
    component: LoginPage,  // Login page component
  },
  {
    path: "/",
    redirect: "/login",  // Redirect the root URL to the login page
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
