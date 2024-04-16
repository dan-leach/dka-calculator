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
    },
  ],
});

export default router;
