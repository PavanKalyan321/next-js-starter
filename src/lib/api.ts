const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  // Projects
  getProjects: () => fetchAPI('/api/projects'),
  getProject: (id: number) => fetchAPI(`/api/projects/${id}`),
  createProject: (data: any) =>
    fetchAPI('/api/projects', { method: 'POST', body: JSON.stringify(data) }),

  // Files
  getFiles: () => fetchAPI('/api/files'),
  getFile: (id: number) => fetchAPI(`/api/files/${id}`),
  uploadFile: async (file: File, projectId?: number) => {
    const formData = new FormData()
    formData.append('file', file)
    if (projectId) formData.append('project_id', String(projectId))

    return fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json())
  },

  // Ideas
  getIdeas: () => fetchAPI('/api/ideas'),
  getIdea: (id: number) => fetchAPI(`/api/ideas/${id}`),
  createIdea: (data: any) =>
    fetchAPI('/api/ideas', { method: 'POST', body: JSON.stringify(data) }),
  updateIdea: (id: number, data: any) =>
    fetchAPI(`/api/ideas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Bots
  getBots: () => fetchAPI('/api/bots'),
  getBot: (id: number) => fetchAPI(`/api/bots/${id}`),
  startBot: (id: number) =>
    fetchAPI(`/api/bots/${id}/start`, { method: 'POST' }),
  stopBot: (id: number) =>
    fetchAPI(`/api/bots/${id}/stop`, { method: 'POST' }),

  // Dashboard
  getDashboardStats: () => fetchAPI('/api/dashboard/stats'),
  getRecentActivity: () => fetchAPI('/api/dashboard/activity'),
}
