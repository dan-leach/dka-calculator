import { config } from "./config.js";

/**
 * Sends a POST request to the specified API route with the given data.
 * Returns a promise that resolves with the parsed JSON response or rejects with an error.
 *
 * @param {string} route - The API route to send the request to.
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} - A promise that resolves with the API response as a JSON object.
 */
async function api(route, data) {
  const url = config.api.url;
  const timeoutDuration = config.api.timeoutDuration;
  const showConsole = config.api.showConsole;

  // Create a controller to handle request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    // Prepare and send the request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        route,
        data: JSON.stringify(data),
      }),
      signal: controller.signal,
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        console.error("API error", errorJson);
        throw errorJson;
      } catch (e) {
        console.error("API error", e);
        throw new Error(
          `API error: status ${response.status} (${response.statusText}) ${errorText}`
        );
      }
    }

    // Parse and return the response JSON
    const responseJson = await response.json();
    if (showConsole) {
      console.log(`${route} -->`, responseJson);
    }
    return responseJson;
  } catch (error) {
    // Handle request timeout or network errors
    if (error.name === "AbortError") {
      throw new Error(
        "Your request timed out. Please check your internet connection."
      );
    }
    console.error("Network or fetch error", error);
    throw error;
  }
}

export { api };
