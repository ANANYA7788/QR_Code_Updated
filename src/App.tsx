import React, { useState, useCallback } from 'react';
import { QrCode, Download, Github } from 'lucide-react';
import FileUploader from './components/FileUploader';
import CameraScanner from './components/CameraScanner';
import QRCodeList from './components/QRCodeList';
import LinkedListVisualization from './components/LinkedListVisualization';
import { QRLinkedList, QRCodeData } from './types/qr';

function App() {
  const [qrList] = useState(new QRLinkedList());
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');

  const handleQRCodesFound = useCallback((codes: QRCodeData[]) => {
    codes.forEach(code => {
      // Check for duplicates
      const isDuplicate = qrCodes.some(existing => existing.data === code.data);
      if (!isDuplicate) {
        qrList.append(code);
      }
    });
    setQRCodes(qrList.toArray());
  }, [qrList, qrCodes]);

  const handleQRCodeFound = useCallback((code: QRCodeData) => {
    // Check for duplicates
    const isDuplicate = qrCodes.some(existing => existing.data === code.data);
    if (!isDuplicate) {
      qrList.append(code);
      setQRCodes(qrList.toArray());
    }
  }, [qrList, qrCodes]);

  const handleClearAll = useCallback(() => {
    qrList.clear();
    setQRCodes([]);
  }, [qrList]);

  const exportData = () => {
    const data = JSON.stringify(qrCodes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QR Scanner Pro</h1>
                <p className="text-sm text-gray-600">Scan & organize QR codes with linked lists</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {qrCodes.length > 0 && (
                <button
                  onClick={exportData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              )}
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Scanner */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200
                    ${activeTab === 'upload'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  Upload Images
                </button>
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200
                    ${activeTab === 'camera'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  Camera Scanner
                </button>
              </div>
            </div>

            {/* Scanner Content */}
            <div className="min-h-[400px]">
              {activeTab === 'upload' ? (
                <FileUploader onQRCodesFound={handleQRCodesFound} />
              ) : (
                <CameraScanner onQRCodeFound={handleQRCodeFound} />
              )}
            </div>

            {/* Linked List Visualization */}
            <LinkedListVisualization qrCodes={qrCodes} />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <QRCodeList qrCodes={qrCodes} onClear={handleClearAll} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with React, TypeScript, and jsQR for high-performance QR code scanning
            </p>
            <p className="text-sm text-gray-500">
              Demonstrates linked list data structure implementation in web applications
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;