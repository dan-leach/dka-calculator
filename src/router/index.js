import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import PrivacyPolicyView from "../views/PrivacyPolicyView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "start",
      component: StartView,
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: () => import("../views/PrivacyPolicyView.vue"),
    },
  ],
});

export default router;
