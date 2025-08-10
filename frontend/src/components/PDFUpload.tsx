import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { projectAPI } from '../services/api';
import { useProjects } from '../contexts/ProjectContext';
import { toast } from 'react-toastify';

const PDFUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { refreshProjects } = useProjects();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await projectAPI.createProject(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        refreshProjects();
        toast.success('PDF uploaded successfully!');
      }, 500);

    } catch (error: any) {
      setUploading(false);
      setUploadProgress(0);
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  }, [refreshProjects]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Your PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drop your PDF document here to start an intelligent conversation
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            isDragActive
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : uploading
              ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Uploading PDF...
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Maximum file size: 50MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Instant Processing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your PDF is processed and ready for questions in seconds
            </p>
          </div>
          <div className="text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Smart Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Advanced AI understands context and structure
            </p>
          </div>
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Secure Storage</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your documents are encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;