/**
 * @file fetchConfig.js
 * Fetches the application configuration from the remote API and exposes it as
 * a reactive Vue ref consumed throughout the app via import.
 *
 * Environment detection:
 *   - Development  (localhost or a URL containing "dev."):
 *       Requests are proxied through /api-proxy/config (see vite.config.js)
 *       to avoid CORS issues. If the API is unreachable the app falls back
 *       to public/localConfig.json so development can continue offline.
 *   - Production:
 *       Requests go directly to https://api.dka-calculator.co.uk/config.
 *       No fallback is attempted; a failure surfaces an error to the user.
 *
 * Version constants below (clientVersion, icpVersion, etc.) are maintained
 * here rather than in the API so that client and ICP releases can be tracked
 * independently of the back-end deployment cycle.
 */
import { ref } from "vue";
let config = ref({});

const windowLocation = window.location.href;
const clientUnderDevelopment =
  windowLocation.includes("localhost") || windowLocation.includes("dev.");

// Set client version here.
const clientVersion = "2.9";
const clientLastUpdated = "2026-01-20";

// Set ICP version here.
const icpVersion = "1.7";
const icpLastUpdated = "2025-12-21";
const icpIsDraft = false;

const url = clientUnderDevelopment
  ? "/api-proxy/config"
  : "https://api.dka-calculator.co.uk/config";

const timeoutDuration = 15000;

/**
 * Fetches and stores the application configuration.
 *
 * Merges the API response with the client-side version constants above and
 * assigns the result to the shared `config` ref. In development, falls back
 * to public/localConfig.json when the API is unavailable.
 *
 * @returns {Promise<Object>} The resolved configuration object.
 * @throws {Array<{msg: string}>} Array of error message objects on failure.
 */
async function fetchConfig() {
  if (clientUnderDevelopment) console.log("***CLIENT DEV MODE ACTIVE***");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const jsonResponse = await response.json();
    config.value = jsonResponse;

    config.value.client.version = clientVersion;
    config.value.client.lastUpdated = clientLastUpdated;
    config.value.client.underDevelopment = clientUnderDevelopment;
    config.value.icp = {
      version: icpVersion,
      lastUpdated: icpLastUpdated,
      isDraft: icpIsDraft,
    };

    return jsonResponse;
  } catch (error) {
    clearTimeout(timeoutId);

    if (clientUnderDevelopment) {
      console.warn("API unavailable, loading local fallback config...", error);
      try {
        const fallbackResponse = await fetch("/localConfig.json");
        const fallbackConfig = await fallbackResponse.json();
        config.value = fallbackConfig;
        config.value.client.version = clientVersion;
        config.value.client.lastUpdated = clientLastUpdated;
        config.value.client.underDevelopment = clientUnderDevelopment;
        config.value.icp = {
          version: icpVersion,
          lastUpdated: icpLastUpdated,
          isDraft: icpIsDraft,
        };
        return config.value;
      } catch (fallbackError) {
        console.error("Failed to load fallback config:", fallbackError);
        throw [{ msg: "API error: Failed to load configuration." }];
      }
    }

    if (error.name === "AbortError") {
      const errorStr = "API error: The request timed out.";
      console.error(errorStr);
      throw [{ msg: errorStr }];
    } else if (error.errors) {
      console.error("API errors: ", error.errors);
      throw error.errors;
    } else {
      console.log("API error: ", error);
      throw [{ msg: "API error: " + error.toString() }];
    }
  }
}

export { config, fetchConfig };
