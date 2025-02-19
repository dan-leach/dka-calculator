import { createRouter, createWebHistory } from "vue-router";
import Start from "../views/Start.vue";
import { fetchConfig } from "../assets/fetchConfig";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "start",
      component: Start,
    },
    {
      path: "/form-disclaimer",
      name: "form-disclaimer",
      component: () => import("../views/FormDisclaimer.vue"),
    },
    {
      path: "/form-patient-details",
      name: "form-patient-details",
      component: () => import("../views/FormPatientDetails.vue"),
    },
    {
      path: "/form-clinical-details",
      name: "form-clinical-details",
      component: () => import("../views/FormClinicalDetails.vue"),
    },
    {
      path: "/form-override-confirm",
      name: "form-override-confirm",
      component: () => import("../views/FormOverrideConfirm.vue"),
    },
    {
      path: "/form-audit-details",
      name: "form-audit-details",
      component: () => import("../views/FormAuditDetails.vue"),
    },
    {
      path: "/generate-protocol",
      name: "generate-protocol",
      component: () => import("../views/GenerateProtocol.vue"),
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: () => import("../views/PrivacyPolicy.vue"),
      beforeEnter: async (to, from) => {
        await fetchConfig();
      },
    },
    {
      path: "/update",
      name: "update",
      component: () => import("../views/Update.vue"),
    },
    {
      path: "/submit-update",
      name: "submit-update",
      component: () => import("../views/SubmitUpdate.vue"),
    },
    {
      path: "/sodium-osmo",
      name: "sodium-osmo",
      component: () => import("../views/SodiumOsmo.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("../views/404.vue"),
    },
  ],
});

export default router;
