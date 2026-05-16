import { ref } from "vue";

/**
 * Central reactive data store.
 * This ref starts empty and is fully populated by src/assets/data.js
 * after all input domain files are assembled.
 * All input files import from here (not from data.js) to avoid circular dependencies.
 */
export const data = ref({});
