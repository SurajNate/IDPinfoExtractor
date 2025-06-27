
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FileText, File } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      console.log('File dropped:', acceptedFiles[0]);
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const getFileIcon = () => {
    if (isDragActive) return <Upload className="h-12 w-12 text-blue-500" />;
    return <FileImage className="h-12 w-12 text-gray-400" />;
  };

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        {getFileIcon()}
        
        <div className="space-y-2">
          {isDragActive ? (
            <p className="text-blue-600 font-medium text-lg">
              Drop the file here...
            </p>
          ) : (
            <>
              <p className="text-gray-700 font-medium text-lg">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-gray-500 text-sm">
                Supports images (PNG, JPG, JPEG, WEBP), PDFs, and text files
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FileImage className="h-4 w-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>PDFs</span>
          </div>
          <div className="flex items-center gap-1">
            <File className="h-4 w-4" />
            <span>Text Files</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
