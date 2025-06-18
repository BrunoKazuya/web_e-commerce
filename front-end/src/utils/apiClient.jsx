const BASE_URL = 'http://localhost:3000/api'; // Defines the base URL for all API requests.

async function apiClient(endpoint, { body, ...customOptions } = {}) { // Defines a reusable async function for making API calls.
  const config = { // Creates a configuration object for the fetch request.
    method: body ? 'POST' : 'GET', // Sets the default method to 'POST' if a body exists, otherwise 'GET'.
    credentials: 'include', // Includes cookies in the request, essential for session management.
    ...customOptions, // Spreads any custom options (like method: 'PUT' or 'DELETE') into the config.
    headers: { // Sets up the headers for the request.
      ...customOptions.headers, // Includes any custom headers passed in.
    },
  };

  if (body) { // Checks if a request body is provided.
    if (body instanceof FormData) { // Checks if the body is FormData (for file uploads).
      config.body = body; // If so, sets the body directly without changing headers.
    } else { // If the body is a regular object...
      config.headers['Content-Type'] = 'application/json'; // Set the Content-Type header to JSON.
      config.body = JSON.stringify(body); // Stringify the body object.
    }
  }

  // The try...catch block was removed.
  // If fetch fails or the response is not .ok, the Promise will be rejected,
  // which will be caught by the catch block in the component that called the function.
  const response = await fetch(BASE_URL + endpoint, config); // Executes the fetch request with the constructed URL and config.

  if (!response.ok) { // Checks if the response status is not successful (e.g., 400, 401, 500).
    const errorData = await response.json(); // Tries to parse the error message from the response body.
    throw new Error(errorData.message || `Erro ${response.status}`); // Throws a new error, which will be caught by the caller.
  }
  
  if (response.status === 204) { // Checks for a "No Content" status, common for successful DELETE requests.
    return; // Returns undefined, as there is no body to parse.
  }

  return await response.json(); // For successful responses with a body, parses and returns the JSON data.
}

export default apiClient; // Exports the apiClient function for use throughout the application.