// src/utils/apiClient.js (Versão Final sem o try/catch desnecessário)

const BASE_URL = 'http://localhost:3000/api'; // Certifique-se que a porta está correta

async function apiClient(endpoint, { body, ...customOptions } = {}) {
  const config = {
    method: body ? 'POST' : 'GET',
    credentials: 'include',
    ...customOptions,
    headers: {
      ...customOptions.headers,
    },
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  // O bloco try...catch foi removido.
  // Se fetch falhar ou a resposta não for .ok, a Promise será rejeitada,
  // o que será capturado pelo bloco catch no componente que chamou a função.
  const response = await fetch(BASE_URL + endpoint, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erro ${response.status}`);
  }
  
  if (response.status === 204) {
    return;
  }

  return await response.json();
}

export default apiClient;