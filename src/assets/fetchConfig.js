let config = {};

async function fetchConfig() {
  const url = "https://api.dka-calculator.co.uk/config";
  const timeoutDuration = 15000;

  // Create a controller to handle request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    // Prepare and send the request
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    //parse the JSON response
    const jsonResponse = await response.json();

    config = jsonResponse;

    // Show the response if required
    if (response.ok) {
      return jsonResponse;
    } else {
      throw jsonResponse;
    }
  } catch (error) {
    console.error(error);
  }
}

await fetchConfig();

export { config };
