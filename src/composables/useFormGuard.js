import { onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router/index.js";

/**
 * Runs form validity guards on mount, redirecting to earlier steps if any are invalid.
 *
 * Each guard is checked in order. The first failing guard triggers a redirect and
 * stops further checks. If all guards pass, the optional onPassed callback is called.
 *
 * @param {Array<{formIndex?: number, check?: () => boolean, redirect: string}>} guards
 *   Each entry must have a redirect path, plus either:
 *   - formIndex: a form number validated by data.value.form.isValid()
 *   - check: a custom function that returns true if the guard should trigger a redirect
 * @param {Function} [onPassed] - Called if all guards pass (e.g. scroll to top, setup).
 *
 * @example
 * useFormGuard(
 *   [
 *     { formIndex: 1, redirect: "/form-disclaimer" },
 *     { formIndex: 2, redirect: "/form-protocol-purpose" },
 *     { formIndex: 3, redirect: "/form-patient-details" },
 *   ],
 *   () => { window.scrollTo(0, 0); }
 * );
 */
export function useFormGuard(guards, onPassed) {
  onMounted(() => {
    for (const guard of guards) {
      const shouldRedirect =
        guard.formIndex !== undefined
          ? !data.value.form.isValid(guard.formIndex)
          : guard.check();

      if (shouldRedirect) {
        router.push(guard.redirect);
        return;
      }
    }
    if (onPassed) onPassed();
  });
}
