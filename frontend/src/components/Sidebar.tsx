import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, LogOut, Trash2, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { projects, currentProject, setCurrentProject, deleteProject } = useProjects();
  const navigate = useNavigate();

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 w-full' : ''} w-80 bg-white border-r-4 border-black flex flex-col h-full`}>
      {/* Close button for mobile */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Content container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b-4 border-black">
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-8 h-8 text-black" />
            <span className="text-2xl font-bold text-black">ASKPDF</span>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 border-2 border-black bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-black truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-700 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* New Project Button */}
          <Link
            to="/dashboard"
            onClick={() => {
              setCurrentProject(null);
              if (isMobile && onClose) onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-black bg-red-500 text-white hover:bg-white hover:text-black transition-all shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000]"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bold">NEW PROJECT</span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4 border-b-4 border-black">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-none focus:ring-0 focus:outline-none bg-white text-black placeholder-gray-700 font-medium"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">
            PROJECTS ({filteredProjects.length})
          </h3>
          <div className="space-y-3">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 border-2 border-black p-4 bg-white">
                <FileText className="w-12 h-12 text-black mx-auto mb-3" />
                <p className="text-sm font-bold text-black">
                  {searchTerm ? 'NO PROJECTS FOUND' : 'NO PROJECTS YET'}
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  state={{project}}
                  to={`/dashboard/chat/${project.id}`}
                  onClick={() => {
                    if (isMobile && onClose) onClose();
                  }}
                  className={`group flex items-center space-x-3 p-3 border-2 border-black transition-all hover:shadow-[4px_4px_0_0_#000] ${
                    currentProject?.id === project.id
                      ? 'bg-yellow-200 shadow-[4px_4px_0_0_#000]'
                      : 'bg-white'
                  }`}
                >
                  <div className="w-10 h-10 border-2 border-black bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-700">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteProject(e, project.id);
                    }}
                    className="p-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;