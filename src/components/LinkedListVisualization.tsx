import React from 'react';
import { QRCodeData } from '../types/qr';
import { ArrowRight } from 'lucide-react';

interface LinkedListVisualizationProps {
  qrCodes: QRCodeData[];
}

const LinkedListVisualization: React.FC<LinkedListVisualizationProps> = ({ qrCodes }) => {
  if (qrCodes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked List Structure</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">
            <div className="bg-gray-100 rounded-lg p-4 inline-block">
              <span className="font-mono">head → null</span>
            </div>
          </div>
          <p className="text-gray-500 mt-2">Empty linked list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked List Structure</h3>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-4">
        <div className="text-sm font-medium text-blue-600 whitespace-nowrap">
          head →
        </div>
        
        {qrCodes.map((qrCode, index) => (
          <React.Fragment key={qrCode.id}>
            <div className="flex-shrink-0 bg-blue-50 border-2 border-blue-200 rounded-lg p-3 min-w-[200px]">
              <div className="text-xs text-blue-600 font-medium mb-1">
                Node {index + 1}
              </div>
              <div className="text-sm font-mono text-gray-900 truncate" title={qrCode.data}>
                {qrCode.data.length > 20 ? `${qrCode.data.substring(0, 20)}...` : qrCode.data}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {qrCode.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            {index < qrCodes.length - 1 ? (
              <ArrowRight className="h-5 w-5 text-blue-400 flex-shrink-0" />
            ) : (
              <div className="flex items-center space-x-2 flex-shrink-0">
                <ArrowRight className="h-5 w-5 text-gray-300" />
                <div className="text-sm text-gray-500 font-mono">null</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>Structure:</strong> Each node contains QR code data and points to the next node. 
          The last node points to null, indicating the end of the list.
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualization;