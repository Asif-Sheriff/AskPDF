import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useProjects } from '../contexts/ProjectContext';

const Dashboard: React.FC = () => {
  const { projectId } = useParams();
  const { refreshProjects, projects, setCurrentProject } = useProjects();

  useEffect(() => {
    refreshProjects();
  }, []);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      }
    } else if (!projectId) {
      setCurrentProject(null);
    }
  }, [projectId, projects, setCurrentProject]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;