const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API Error');
  }
  return response.json();
}

const createCrudMethods = (resource: string) => ({
  getAll: () => fetch(`${API_URL}/${resource}`).then(handleResponse),
  create: (data: any) => fetch(`${API_URL}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  update: (id: string | number, data: any) => fetch(`${API_URL}/${resource}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse),
  delete: (id: string | number) => fetch(`${API_URL}/${resource}/${id}`, {
    method: 'DELETE'
  }).then(handleResponse),
});

export const apiService = {
  clients: createCrudMethods('clients'),
  cases: createCrudMethods('cases'),
  events: createCrudMethods('events'),
  tasks: createCrudMethods('tasks'),
  invoices: createCrudMethods('invoices'),
  avocats: createCrudMethods('avocats'),
  personnels: createCrudMethods('personnels'),
  fournisseurs: createCrudMethods('fournisseurs'),
  correspondances: createCrudMethods('correspondances'),
  users: createCrudMethods('users'),
  auditLogs: {
    getAll: () => fetch(`${API_URL}/auditLogs`).then(handleResponse),
    create: (data: any) => fetch(`${API_URL}/auditLogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  },
  chat: {
    getMessages: () => fetch(`${API_URL}/chat`).then(handleResponse),
    sendMessage: (data: any) => fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),
  }
};
