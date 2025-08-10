import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, LogOut, Trash2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectContext';

const Sidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { projects, currentProject, setCurrentProject, deleteProject } = useProjects();
  const navigate = useNavigate();

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-8 h-8 text-red-600" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">AskPDF</span>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* New Project Button */}
        <Link
          to="/dashboard"
          onClick={() => setCurrentProject(null)}
          className="w-full flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Projects ({filteredProjects.length})
        </h3>
        <div className="space-y-2">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/chat/${project.id}`}
                className={`group flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  currentProject?.id === project.id
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
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
  );
};

export default Sidebar;