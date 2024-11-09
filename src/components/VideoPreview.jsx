import React, { useState, useEffect } from "react";
import { Download, RotateCcw, Save } from "lucide-react";
import toast from "react-hot-toast";

const VideoPreview = ({ videoData, onTryAgain }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!videoData) return;

    try {
      // Create blob URL from video data
      const blob = new Blob([videoData], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      console.log("Video blob URL created:", url);
      setBlobUrl(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
          console.log("Video blob URL revoked:", url);
        }
      };
    } catch (error) {
      console.error("Error creating video blob URL:", error);
      toast.error("Failed to process video data");
    }
  }, [videoData]);

  const handleDownload = async () => {
    try {
      const blob = new Blob([videoData], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `animated-portrait-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Video downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download video");
    }
  };

  const handleSaveToGallery = async () => {
    try {
      // Convert ArrayBuffer to base64
      const uint8Array = new Uint8Array(videoData);
      const base64String = btoa(
        Array.from(uint8Array)
          .map((byte) => String.fromCharCode(byte))
          .join("")
      );

      // Save to localStorage
      const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
      const newVideo = {
        id: Date.now(),
        url: `data:video/mp4;base64,${base64String}`,
        createdAt: new Date().toISOString(),
      };
      savedVideos.unshift(newVideo);
      localStorage.setItem("savedVideos", JSON.stringify(savedVideos));

      toast.success("Video saved to gallery!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save video to gallery");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}
        {blobUrl && (
          <video
            src={blobUrl}
            className="w-full aspect-square object-contain"
            controls
            autoPlay
            loop
            playsInline
            onLoadedData={() => {
              console.log("Video loaded successfully");
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("Video load error:", e);
              setIsLoading(false);
              toast.error("Failed to load video preview");
            }}
          />
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={handleDownload}
          disabled={isLoading || !blobUrl}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          <span>Download Video</span>
        </button>

        <button
          onClick={handleSaveToGallery}
          disabled={isLoading || !blobUrl}
          className="w-full flex items-center justify-center space-x-2 bg-primary-100 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" />
          <span>Save to Gallery</span>
        </button>

        <button
          onClick={onTryAgain}
          className="w-full flex items-center justify-center space-x-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Try Another Photo</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;