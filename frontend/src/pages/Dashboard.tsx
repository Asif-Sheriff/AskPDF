import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useProjects } from '../contexts/ProjectContext';
import { Menu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { projectId } = useParams();
  const { refreshProjects, projects, setCurrentProject } = useProjects();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    refreshProjects();
  }, []);

  useEffect(() => {
    // Prevent scrolling when sidebar is open on mobile
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden ${isSidebarOpen ? 'fixed' : ''}`}>
      {/* Desktop Sidebar (always visible) */}
      <div className="hidden md:block h-screen sticky top-0 overflow-y-auto">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar (conditionally visible) */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <Sidebar 
            onClose={() => setIsSidebarOpen(false)} 
            isMobile={true} 
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col relative overflow-auto">
        {/* Mobile Menu Button (only visible on mobile) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 left-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md z-10"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Centered Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;