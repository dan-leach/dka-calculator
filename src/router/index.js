/**
 * @file router/index.js
 * Vue Router configuration for the DKA Calculator SPA.
 *
 * Standard episode flow (in order):
 *   /                          Start — config fetch, episode type selection
 *   /form-disclaimer           Form 1  — legal disclaimer agreement
 *   /form-protocol-purpose     Form 2  — episode type (new / existing patient)
 *   /form-patient-details      Form 3  — patient demographics
 *   /form-clinical-details     Form 4  — clinical measurements
 *   /form-override-confirm     (conditional) — weight limit override confirmation
 *   /form-audit-details        Form 5  — audit / governance fields
 *   /generate-protocol         Output  — PDF generation and display
 *
 * Standalone tools:
 *   /sodium-osmo               Form 6  — sodium / osmolality calculator
 *   /privacy-policy            Privacy policy (fetches config independently)
 *
 * Retrospective audit flow:
 *   /form-retrospective-start  Form 8/9 — lookup or create a retrospective record
 *   /form-retrospective-audit  Form 7   — retrospective clinical data entry
 *   /form-retrospective-complete        — submission confirmation
 *
 * The form index numbers above correspond to the indices used in
 * src/assets/data.js and checked by src/composables/useFormGuard.js to
 * prevent users from reaching a form before completing earlier ones.
 *
 * /audit redirects to /form-retrospective-start for backwards-compatibility
 * with links in earlier versions of the tool.
 */
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
      path: "/form-protocol-purpose",
      name: "form-protocol-purpose",
      component: () => import("../views/FormProtocolPurpose.vue"),
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
      path: "/form-retrospective-start",
      name: "form-retrospective-start",
      component: () => import("../views/FormRetrospectiveStart.vue"),
      alias: "/create-retrospective-episode",
    },
    {
      path: "/audit",
      redirect: "/form-retrospective-start",
    },
    {
      path: "/form-retrospective-audit",
      name: "form-retrospective-audit",
      component: () => import("../views/FormRetrospectiveAudit.vue"),
    },
    {
      path: "/form-retrospective-complete",
      name: "form-retrospective-complete",
      component: () => import("../views/FormRetrospectiveComplete.vue"),
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
