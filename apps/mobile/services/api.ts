const API_BASE_URL = 'http://localhost:3000/v1';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Netzwerkfehler' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Cantons
export const api = {
  getCantons: () => fetchApi<any[]>('/cantons'),
  getCanton: (code: string) => fetchApi<any>(`/cantons/${code}`),

  // Regulations
  getRegulationCategories: () => fetchApi<any[]>('/regulations/categories'),
  getRegulations: (cantonCode: string, categorySlug?: string) => {
    const params = new URLSearchParams({ cantonCode });
    if (categorySlug) params.append('categorySlug', categorySlug);
    return fetchApi<any>(`/regulations?${params}`);
  },
  getRegulation: (id: number) => fetchApi<any>(`/regulations/${id}`),

  // Calculations
  getCalculationTypes: () => fetchApi<any[]>('/calculations/types'),
  getCalculationParameters: (type: string, cantonCode?: string) => {
    const params = new URLSearchParams({ type });
    if (cantonCode) params.append('cantonCode', cantonCode);
    return fetchApi<any>(`/calculations/parameters?${params}`);
  },
  compute: (body: { calculationType: string; cantonCode?: string; inputs: Record<string, number | string> }) =>
    fetchApi<any>('/calculations/compute', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Examples
  getExampleCategories: () => fetchApi<any[]>('/examples/categories'),
  getExamples: (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    return fetchApi<any>(`/examples?${searchParams}`);
  },
  getExample: (id: number) => fetchApi<any>(`/examples/${id}`),

  // Contacts
  getContacts: (cantonCode: string) => fetchApi<any[]>(`/contacts?cantonCode=${cantonCode}`),
  getFederalContacts: () => fetchApi<any[]>('/contacts/federal'),
  getContactTypes: () => fetchApi<any[]>('/contacts/types'),

  // Sync
  getSyncVersions: () => fetchApi<any[]>('/sync/versions'),
  getSyncData: (table: string, sinceVersion: number) =>
    fetchApi<any>(`/sync/data?table=${table}&sinceVersion=${sinceVersion}`),
};
