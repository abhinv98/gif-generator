import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

const CameraCapture = ({ onCapture, onBack }) => {
  const webcamRef = useRef(null);
  const [isCameraReady, setCameraReady] = useState(false);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user",
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    } else {
      toast.error("Failed to capture image. Please try again.");
    }
  }, [onCapture]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={() => setCameraReady(true)}
          onUserMediaError={() => {
            toast.error(
              "Unable to access camera. Please ensure you have granted camera permissions."
            );
          }}
          className="w-full aspect-square object-cover"
        />

        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleCapture}
          disabled={!isCameraReady}
          className="flex-1 flex items-center justify-center space-x-2 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="h-5 w-5" />
          <span>Capture</span>
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
