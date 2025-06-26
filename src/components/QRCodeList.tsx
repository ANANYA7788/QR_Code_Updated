import React from 'react';
import { QRCodeData } from '../types/qr';
import { Calendar, Camera, Upload, ExternalLink, Copy, Trash2 } from 'lucide-react';

interface QRCodeListProps {
  qrCodes: QRCodeData[];
  onClear: () => void;
}

const QRCodeList: React.FC<QRCodeListProps> = ({ qrCodes, onClear }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
    });
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString();
  };

  if (qrCodes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR Codes Scanned</h3>
        <p className="text-gray-600">Upload images or use the camera to start scanning QR codes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Scanned QR Codes ({qrCodes.length})
        </h3>
        <button
          onClick={onClear}
          className="flex items-center space-x-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {qrCodes.map((qrCode, index) => (
          <div key={qrCode.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    {qrCode.source === 'camera' ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>{qrCode.source === 'camera' ? 'Camera' : 'Upload'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatTimestamp(qrCode.timestamp)}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-900 font-mono text-sm break-all">
                    {qrCode.data}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => copyToClipboard(qrCode.data)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                
                {isUrl(qrCode.data) && (
                  <a
                    href={qrCode.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeList;