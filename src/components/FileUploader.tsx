import React, { useCallback, useState } from 'react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';
import { scanImageFile } from '../utils/qrScanner';
import { QRCodeData } from '../types/qr';

interface FileUploaderProps {
  onQRCodesFound: (codes: QRCodeData[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onQRCodesFound }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const allCodes: QRCodeData[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const codes = await scanImageFile(file);
          allCodes.push(...codes);
        }
      }
      
      if (allCodes.length === 0) {
        setError('No QR codes found in the uploaded images');
      } else {
        onQRCodesFound(allCodes);
      }
    } catch (err) {
      setError('Failed to process images');
    } finally {
      setIsProcessing(false);
    }
  }, [onQRCodesFound]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : (
            <div className="bg-blue-100 p-3 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Processing Images...' : 'Upload QR Code Images'}
            </h3>
            <p className="text-gray-600">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPG, PNG, GIF formats
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;