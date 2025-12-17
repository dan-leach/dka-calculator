import { ref } from "vue";
let config = ref({});

// Set client version here.
const clientVersion = "2.6";
const clientLastUpdated = "2025-12-17";
const clientUnderDevelopment = true;

// Set ICP version here.
const icpVersion = "1.7";
const icpLastUpdated = "2025-12-17";
const icpIsDraft = false;

// Set API development mode with node environment variables

const url = clientUnderDevelopment
  ? "https://dev-api.dka-calculator.co.uk/config"
  : "https://api.dka-calculator.co.uk/config";

const timeoutDuration = 15000;

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
      const errorResponse = await response.json();
      throw errorResponse;
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
    // Handle errors (including timeout and network issues)
    if (error.name === "AbortError") {
      const errorStr = "API error: The request timed out.";
      console.error(errorStr);
      throw [{ msg: errorStr }];
    } else if (error.errors) {
      //is a jsonResponse with errors array
      console.error("API errors: ", error.errors);
      throw error.errors;
    } else {
      //another unexpected error
      console.log("API error: ", error);
      throw [{ msg: "API error: " + error.toString() }];
    }
  }
}

export { config, fetchConfig };
