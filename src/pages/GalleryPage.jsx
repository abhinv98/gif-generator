import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Trash2, Plus, Image } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import toast from "react-hot-toast";

const GalleryPage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedVideos = () => {
      try {
        const savedVideos =
          JSON.parse(localStorage.getItem("savedVideos")) || [];
        // Validate video data URLs
        const validVideos = savedVideos.filter((video) =>
          video?.url?.startsWith("data:video/mp4;base64,")
        );

        if (validVideos.length !== savedVideos.length) {
          localStorage.setItem("savedVideos", JSON.stringify(validVideos));
          toast.error("Some invalid videos were removed from the gallery");
        }

        setVideos(validVideos);
      } catch (error) {
        console.error("Error loading saved videos:", error);
        toast.error("Failed to load saved videos");
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedVideos();
  }, []);

  const handleDelete = (index) => {
    try {
      const updatedVideos = videos.filter((_, i) => i !== index);
      localStorage.setItem("savedVideos", JSON.stringify(updatedVideos));
      setVideos(updatedVideos);
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const handleDownload = async (videoUrl, index) => {
    try {
      // Extract base64 data from data URL
      const base64Data = videoUrl.split(",")[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `portrait-video-${index + 1}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Video downloaded successfully");
    } catch (error) {
      console.error("Error downloading video:", error);
      toast.error("Failed to download video");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <Link
            to="/generator"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Video
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Gallery</h1>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Image className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No Videos Yet
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Start by creating your first animated portrait
              </p>
              <Link
                to="/generator"
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Video
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      controls
                      loop
                      playsInline
                      onError={(e) => {
                        console.error("Video load error:", e);
                        toast.error(`Failed to load video ${index + 1}`);
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleDownload(video.url, index)}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-primary-500 hover:text-primary-600"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
