let config = {};

function fetchConfig() {
  const url = "https://api.dka-calculator.co.uk/config";
  const timeoutDuration = 15000;

  // Create a controller to handle request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  // Return a promise that resolves with the fetched config or rejects with an error
  return fetch(url, {
    method: "GET",
    signal: controller.signal,
  })
    .then(response => {
      // Clear the timeout
      clearTimeout(timeoutId);

      // Check if the response is ok, then parse the JSON response
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(jsonResponse => Promise.reject(jsonResponse));
      }
    })
    .then(jsonResponse => {
      // Process the JSON response
      config = jsonResponse;
      return jsonResponse;
    })
    .catch(error => {
      console.error(error);
    });
}

export { config, fetchConfig };
