import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ProjectContextType } from '../types';
import { projectAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const refreshProjects = async () => {
    try {
      const response = await projectAPI.getProjects();
      setProjects(response.data);
    } catch (error: any) {
      toast.error('Failed to load projects');
      console.error('Error fetching projects:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await projectAPI.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  const value: ProjectContextType = {
    projects,
    currentProject,
    setCurrentProject,
    refreshProjects,
    deleteProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};