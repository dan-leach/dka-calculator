import { createRouter, createWebHistory } from "vue-router";
import Start from "../views/Start.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "start",
      component: Start,
    },
    {
      path: "/form-part-1",
      name: "form-part-1",
      component: () => import("../views/Form1.vue"),
    },
    {
      path: "/form-part-2",
      name: "form-part-2",
      component: () => import("../views/Form2.vue"),
    },
    {
      path: "/form-part-3",
      name: "form-part-3",
      component: () => import("../views/Form3.vue"),
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: () => import("../views/PrivacyPolicy.vue"),
    },
  ],
});

export default router;
