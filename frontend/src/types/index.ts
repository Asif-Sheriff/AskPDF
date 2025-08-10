export interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  thumbnail?: string;
  userId: string;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  sources?: string[];
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