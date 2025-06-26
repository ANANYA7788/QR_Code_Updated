import jsQR from 'jsqr';
import { QRCodeData } from '../types/qr';

export const scanImageFile = async (file: File): Promise<QRCodeData[]> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      
      if (imageData) {
        const codes: QRCodeData[] = [];
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          codes.push({
            id: Math.random().toString(36).substr(2, 9),
            data: code.data,
            timestamp: new Date(),
            source: 'upload'
          });
        }
        
        resolve(codes);
      } else {
        reject(new Error('Failed to process image'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const scanFromCanvas = (canvas: HTMLCanvasElement): QRCodeData | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  
  if (code) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      data: code.data,
      timestamp: new Date(),
      source: 'camera'
    };
  }
  
  return null;
};