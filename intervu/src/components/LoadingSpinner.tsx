import Image from 'next/image';
import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'medium' 
}: LoadingSpinnerProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  // Animation frames in sequence
  const frames = [
    '/trashcanClosed.svg',
    '/trashcanMiddle.svg',
    '/trashcan.svg',
    '/trashcanMiddle.svg'
  ];

  // Cycle through frames
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 300); // Change frame every 300ms

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const spinnerSizeClasses = {
    small: 'w-25 h-25',
    medium: 'w-45 h-45',
    large: 'w-61 h-61'
  };

  const imageSizeMap = {
    small: 58,
    medium: 115,
    large: 173
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Loading animation container */}
      <div className={`relative ${spinnerSizeClasses[size]} flex items-center justify-center`}>
        {/* Spinning circle */}
        <div className="absolute inset-0">
          <svg className="animate-spin w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="220 80"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Animated trash can frames - centered */}
        <div className="relative z-10">
          <Image
            src={frames[frameIndex]}
            alt="Loading..."
            width={imageSizeMap[size]}
            height={imageSizeMap[size]}
            priority
            key={frameIndex}
            className="object-contain"
          />
        </div>
      </div>

      {/* Loading message - moved further down to avoid overlap */}
      {message && (
        <div className="text-center">
          <p className="text-slate-300 text-lg font-medium animate-pulse">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
