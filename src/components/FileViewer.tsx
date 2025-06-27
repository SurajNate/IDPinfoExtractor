
import React from 'react';
import { FileText, Image, AlertCircle } from 'lucide-react';

interface FileViewerProps {
  file: File;
  previewUrl: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, previewUrl }) => {
  console.log('FileViewer rendering:', file.name, file.type);

  // Render image preview
  if (file.type.startsWith('image/')) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Image className="h-4 w-4" />
          <span>Image Preview</span>
        </div>
        <div className="border rounded-lg overflow-hidden bg-gray-50">
          <img
            src={previewUrl}
            alt="Uploaded file preview"
            className="w-full h-auto max-h-96 object-contain"
            onLoad={() => console.log('Image loaded successfully')}
            onError={() => console.error('Failed to load image')}
          />
        </div>
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p><strong>Filename:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Type:</strong> {file.type}</p>
        </div>
      </div>
    );
  }

  // Render PDF preview placeholder
  if (file.type === 'application/pdf') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="h-4 w-4" />
          <span>PDF Document</span>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">PDF Document Uploaded</p>
          <p className="text-sm text-gray-500">
            PDF preview not available. Click "Extract Text" to process the document.
          </p>
        </div>
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p><strong>Filename:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Type:</strong> {file.type}</p>
        </div>
      </div>
    );
  }

  // Render unsupported file type
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-orange-600">
        <AlertCircle className="h-4 w-4" />
        <span>File Type: {file.type}</span>
      </div>
      <div className="border-2 border-dashed border-orange-300 rounded-lg p-12 text-center bg-orange-50">
        <AlertCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
        <p className="text-orange-700 font-medium mb-2">File Uploaded</p>
        <p className="text-sm text-orange-600">
          Preview not available for this file type. Click "Extract Text" to process.
        </p>
      </div>
      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
        <p><strong>Filename:</strong> {file.name}</p>
        <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <p><strong>Type:</strong> {file.type}</p>
      </div>
    </div>
  );
};

export default FileViewer;
