'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useInterview } from '@/context/InterviewContext';
import Link from 'next/link';
import Header from '@/components/Header';

export default function WaitingRoomPage() {
  const router = useRouter();
  const { sessionId, questions, jobTitle } = useInterview();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isHostReady, setIsHostReady] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Protect route - redirect to upload if no session or questions
  useEffect(() => {
    if (!sessionId || questions.length === 0) {
      console.log('No session or questions found, redirecting to upload...');
      router.push('/upload');
    }
  }, [sessionId, questions, router]);

  // Simulate backend readiness (replace with actual API call later)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHostReady(true);
    }, 5000); // 5 seconds delay to simulate backend processing

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Navigate to interview page
      router.push('/interview');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Get available devices
  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setCameras(videoDevices);
      setMicrophones(audioDevices);
      
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(audioDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error enumerating devices:', error);
    }
  };

  // Request camera and microphone access
  const requestMediaAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined },
        audio: { deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined },
      });

      setStream(mediaStream);
      setCameraPermissionGranted(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get devices after permission is granted
      await getDevices();
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please grant permissions and try again.');
    }
  };

  // Update stream when device selection changes
  useEffect(() => {
    if (cameraPermissionGranted && (selectedCamera || selectedMicrophone)) {
      requestMediaAccess();
    }
  }, [selectedCamera, selectedMicrophone]);

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
      setCameraEnabled(!cameraEnabled);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleStart = () => {
    if (!isReady) return;
    
    // Start countdown
    setCountdown(3);
  };

  const handleReady = () => {
    setIsReady(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24">
      <Header />
      
      <div className="py-12 px-8">
        <div className="container mx-auto max-w-3xl">
          {/* Main Card */}
          <div className="bg-gray-700 rounded-xl overflow-hidden shadow-xl">
            {/* Header Section with Logo and Title */}
            <div className="bg-gray-800 p-6 flex items-start gap-4">
              {/* Placeholder Logo */}
              <div className="w-24 h-16 bg-white rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-4xl">🦝</span>
              </div>
              
              {/* Title Section */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {jobTitle || 'Job'} Interview
                </h1>
                <p className="text-gray-300 text-sm">
                  {isHostReady 
                    ? 'Your host has joined the room and is ready to let you in. Good luck!' 
                    : 'Waiting for host to join...'}
                </p>
              </div>
            </div>

            {/* Video Preview */}
            <div className="relative bg-gray-900 aspect-video p-8">
              {!cameraPermissionGranted ? (
                <div className="absolute inset-8 flex flex-col items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center p-8">
                    <svg
                      className="mx-auto h-24 w-24 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <h2 className="text-white text-xl font-semibold mb-2">Camera Access Required</h2>
                    <p className="text-gray-400 mb-6">We need access to your camera and microphone</p>
                    <button
                      onClick={requestMediaAccess}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Enable Camera & Microphone
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-8 bg-gray-800 rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${!cameraEnabled ? 'hidden' : ''}`}
                    />
                    {!cameraEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center">
                          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-12 h-12 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <p className="text-white text-lg">Camera Off</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Audio and Video Controls */}
            <div className="p-6 bg-gray-700 flex justify-center gap-4">
              <button
                onClick={toggleAudio}
                disabled={!cameraPermissionGranted}
                className={`p-4 rounded-full transition-all ${
                  audioEnabled
                    ? 'bg-gray-600 hover:bg-gray-500'
                    : 'bg-red-600 hover:bg-red-700'
                } ${!cameraPermissionGranted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {audioEnabled ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>

              <button
                onClick={toggleCamera}
                disabled={!cameraPermissionGranted}
                className={`p-4 rounded-full transition-all ${
                  cameraEnabled
                    ? 'bg-gray-600 hover:bg-gray-500'
                    : 'bg-red-600 hover:bg-red-700'
                } ${!cameraPermissionGranted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cameraEnabled ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                )}
              </button>
            </div>
          </div>

        {/* Countdown and Action Buttons */}
        {countdown !== null && (
          <div className="text-center mt-4">
            <div className="text-6xl font-bold text-blue-400 animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => router.push('/topics')}
            className="bg-white hover:bg-gray-200 text-gray-900 text-lg font-semibold px-8 py-4 rounded-[32px] transition-colors duration-200"
          >
            Go Back
          </button>
          <button
            onClick={handleStart}
            disabled={!isReady || countdown !== null}
            className={`text-lg font-semibold px-12 py-4 rounded-[32px] transition-colors duration-200 ${
              isReady && countdown === null
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {!isHostReady 
              ? 'Waiting for Host...' 
              : !cameraPermissionGranted
              ? 'Enable Camera to Start'
              : isReady && countdown === null 
              ? 'Start Interview' 
              : '✓ Ready'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
