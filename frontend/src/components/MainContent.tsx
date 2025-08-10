import React from 'react';
import { useProjects } from '../contexts/ProjectContext';
import PDFUpload from './PDFUpload';
import ChatInterface from './ChatInterface';

const MainContent: React.FC = () => {
  const { currentProject } = useProjects();

  return (
    <div className="flex-1 flex flex-col">
      {currentProject ? (
        <ChatInterface project={currentProject} />
      ) : (
        <PDFUpload />
      )}
    </div>
  );
};

export default MainContent;