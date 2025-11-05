export interface Project {
  id: number
  name: string
  description: string
  created_on: string
  updated_at?: string
}

export interface CodeFile {
  id: number
  filename: string
  project_id: number
  project_name?: string
  size: number
  uploaded_at: string
  file_path: string
  download_url?: string
}

export interface Idea {
  id: number
  title: string
  description: string
  tags: string[]
  status: 'Active' | 'Paused' | 'Completed'
  created_at: string
  updated_at?: string
}

export interface Bot {
  id: number
  name: string
  description?: string
  status: 'Running' | 'Stopped'
  last_updated: string
  logs_url?: string
}

export interface DashboardStats {
  total_projects: number
  total_files: number
  active_ideas: number
  running_bots: number
}

export interface Activity {
  id: number
  type: 'project' | 'file' | 'idea' | 'bot'
  action: string
  timestamp: string
  details?: string
}
