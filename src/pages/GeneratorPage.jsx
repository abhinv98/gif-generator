import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ImageUpload from "../components/ImageUpload";
import CameraCapture from "../components/CameraCapture";
import LoadingSpinner from "../components/LoadingSpinner";
import VideoPreview from "../components/VideoPreview";
import { generateVideo } from "../services/api";
import toast from "react-hot-toast";

const GeneratorPage = () => {
  const [currentStep, setCurrentStep] = useState("upload");
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const [error, setError] = useState(null);

  const handleImageSelect = async (image) => {
    try {
      setSelectedImage(image);
      setCurrentStep("processing");
      setError(null);

      const videoData = await generateVideo(image, setProcessingStatus);
      
      console.log("Video generation successful");
      setGeneratedVideo(videoData);
      setCurrentStep("preview");
    } catch (error) {
      console.error("Generation Error:", error);
      setError(error.message || "Failed to generate video. Please try again.");
      toast.error(error.message || "Failed to generate video. Please try again.");
      setCurrentStep("upload");
    } finally {
      setProcessingStatus("");
    }
  };

  const handleCameraClick = () => {
    setCurrentStep("camera");
  };

  const handleCameraCapture = (image) => {
    handleImageSelect(image);
  };

  const handleBack = () => {
    setCurrentStep("upload");
    setSelectedImage(null);
    setGeneratedVideo(null);
    setError(null);
  };

  const renderContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <ImageUpload
            onImageSelect={handleImageSelect}
            onCameraClick={handleCameraClick}
          />
        );
      case "camera":
        return (
          <CameraCapture onCapture={handleCameraCapture} onBack={handleBack} />
        );
      case "processing":
        return (
          <LoadingSpinner 
            message="Creating your animated portrait..." 
            substatus={processingStatus} 
          />
        );
      case "preview":
        return generatedVideo ? (
          <VideoPreview videoData={generatedVideo} onTryAgain={handleBack} />
        ) : (
          <div className="text-center py-8">
            <button
              onClick={handleBack}
              className="text-primary-500 hover:text-primary-600"
            >
              Something went wrong. Click here to try again.
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">
              Portrait Animation Generator
            </CardTitle>
            {currentStep !== "upload" && (
              <p className="text-center text-sm text-gray-500">
                {currentStep === "camera" && "Take a selfie"}
                {currentStep === "processing" && "Generating your animation..."}
                {currentStep === "preview" && "Your animation is ready!"}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneratorPage;