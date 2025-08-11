export interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
}

export interface Project {
  id: string;
  title: string;
  created_at: string;
  pdf_url: string;
  updated_at: string;
}

export interface Message {
  chat_id: number;
  project_id: number;
  message: string;
  sender_type: 'USER' | 'SYSTEM';
  created_at: string;
  sources?: Match[];
}

export interface Match {
  document: string;
  metadata: {
    project_id: string;
  };
  score: number;
}

export interface QueryResponse{
  query: string;
  llm_response: string;
  matches: Match[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

// Add this to your types file (e.g., ../types.ts)
export interface AuthResponse {
  token: string;
  user: User;
}