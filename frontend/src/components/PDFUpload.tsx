import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { projectAPI } from '../services/api';
import { useProjects } from '../contexts/ProjectContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PDFUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { refreshProjects } = useProjects();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
  
    if (file.type !== 'application/pdf') {
      toast.error('PLEASE UPLOAD A PDF FILE');
      return;
    }
  
    setUploading(true);
    setUploadProgress(0);
  
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
  
      const project = await projectAPI.createProject(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        refreshProjects();
        toast.success('PDF UPLOADED SUCCESSFULLY!');
        navigate(`/dashboard/chat/${project.id}`, {
          state: { project }
        });
      }, 500);
  
    } catch (error: any) {
      setUploading(false);
      setUploadProgress(0);
      toast.error(error.response?.data?.message || 'UPLOAD FAILED');
    }
  }, [refreshProjects, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 border-b-4 border-black pb-8">
          <FileText className="w-16 h-16 text-black mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-black mb-2 uppercase">
            Upload Your PDF
          </h1>
          <p className="text-black font-medium">
            DROP YOUR PDF DOCUMENT HERE TO START AN INTELLIGENT CONVERSATION
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`relative border-4 border-black p-12 text-center cursor-pointer bg-white shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] transition-all ${
            uploading ? 'cursor-not-allowed' : ''
          } ${isDragActive ? 'bg-yellow-200' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto border-2 border-black bg-white rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-black"></div>
              </div>
              <div className="space-y-3">
                <p className="text-xl font-bold text-black uppercase">
                  Uploading PDF...
                </p>
                <div className="w-full bg-white border-2 border-black h-4">
                  <div 
                    className="bg-black h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm font-bold text-black">
                  {uploadProgress}% COMPLETE
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto border-2 border-black bg-white rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-black" />
              </div>
              <div className="space-y-3">
                <p className="text-xl font-bold text-black uppercase">
                  {isDragActive ? 'DROP YOUR PDF HERE' : 'DRAG & DROP YOUR PDF'}
                </p>
                <p className="text-black font-medium">
                  OR CLICK TO SELECT A FILE
                </p>
                <p className="text-sm font-bold text-black">
                  MAXIMUM FILE SIZE: 50MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center border-2 border-black p-4 bg-white shadow-[4px_4px_0_0_#000]">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold  text-black mb-2 uppercase">Instant Processing</h3>
            <p className="text-black">
              YOUR PDF IS PROCESSED AND READY FOR QUESTIONS IN SECONDS
            </p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-white shadow-[4px_4px_0_0_#000]">
            <FileText className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-black mb-2 uppercase">Smart Analysis</h3>
            <p className="text-black">
              ADVANCED AI UNDERSTANDS CONTEXT AND STRUCTURE
            </p>
          </div>
          <div className="text-center border-2 border-black p-4 bg-white shadow-[4px_4px_0_0_#000]">
            <AlertCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-black mb-2 uppercase">Secure Storage</h3>
            <p className="text-black">
              YOUR DOCUMENTS ARE ENCRYPTED AND PROTECTED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;