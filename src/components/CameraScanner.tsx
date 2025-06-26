import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { scanFromCanvas } from '../utils/qrScanner';
import { QRCodeData } from '../types/qr';

interface CameraScannerProps {
  onQRCodeFound: (code: QRCodeData) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onQRCodeFound }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  }, [stream]);

  const scanFrame = useCallback(() => {
    if (!isActive || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const qrCode = scanFromCanvas(canvas);
      if (qrCode) {
        onQRCodeFound(qrCode);
      }
    }
  }, [isActive, onQRCodeFound]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(scanFrame, 200);
      return () => clearInterval(interval);
    }
  }, [isActive, scanFrame]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Scan className="h-5 w-5" />
            <span>Camera Scanner</span>
          </h3>
          
          <button
            onClick={isActive ? stopCamera : startCamera}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
              ${isActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
              }
            `}
          >
            {isActive ? (
              <>
                <CameraOff className="h-4 w-4" />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                <span>Start Camera</span>
              </>
            )}
          </button>
        </div>
        
        <div className="relative">
          {isActive ? (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 border-2 border-blue-400 rounded-lg">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-400"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-400"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-400"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-400"></div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                Scanning for QR codes...
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Click "Start Camera" to begin scanning</p>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;