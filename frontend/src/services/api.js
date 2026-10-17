const API_BASE = '/api';

// Helper for making API requests with JWT authorization
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aura_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Products API
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.sort) query.append('sort', params.sort);
      if (params.featured) query.append('featured', 'true');
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/products${queryString}`);
    },
    getById: (id) => request(`/products/${id}`),
    getCategories: () => request('/products/meta/categories'),
    create: (productData) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    update: (id, productData) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // Orders API
  orders: {
    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    getMyOrders: () => request('/orders/my-orders'),
    getById: (id) => request(`/orders/${id}`),
    track: (identifier) => request(`/orders/track/${encodeURIComponent(identifier)}`),
    cancel: (id, reason) =>
      request(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      }),
    // Admin Order endpoints
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/orders${queryString}`);
    },
    updateStatus: (id, statusData) =>
      request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
      }),
  },

  // Admin Stats API
  stats: {
    getDashboard: () => request('/stats/dashboard'),
  },
};
