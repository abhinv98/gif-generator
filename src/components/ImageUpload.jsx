import React, { useCallback } from "react";
import { Camera, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { validateImage } from "../services/api";

const ImageUpload = ({ onImageSelect, onCameraClick }) => {
  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      // Validate image before processing
      const validatedImage = await validateImage(file);
      onImageSelect(validatedImage);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    processFile(file);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    processFile(file);
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors duration-200"
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="h-12 w-12 text-gray-400" />
          <div className="space-y-1">
            <span className="text-sm text-gray-600">
              Drag and drop an image here, or click to select
            </span>
            <p className="text-xs text-gray-500">
              Recommended size: at least 256x256 pixels
            </p>
          </div>
        </label>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-500">or</span>
      </div>

      <button
        onClick={onCameraClick}
        className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200"
      >
        <Camera className="h-5 w-5" />
        <span>Take a Selfie</span>
      </button>
    </div>
  );
};

export default ImageUpload;
