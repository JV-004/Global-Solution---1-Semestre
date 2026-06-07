// services/api.ts
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.message);
    return Promise.reject(err);
  }
);

export const DebrisService = {
  getAll:  () => client.get('/debris'),
  getById: (id: string) => client.get(`/debris/${id}`),
  getRisk: (id: string) => client.get(`/risk/${id}`),
};

export const AgentService = {
  query: async (question: string): Promise<string> => {
    const response = await client.post('/rag/query', { question });
    return response.data.answer;
  },
};

export const HealthService = {
  check: () => client.get('/health'),
};
