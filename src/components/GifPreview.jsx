import React, { useState, useEffect } from "react";
import { Download, RotateCcw, Save } from "lucide-react";
import toast from "react-hot-toast";

const GifPreview = ({ gifData, onTryAgain }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState(null);
  const [previewError, setPreviewError] = useState(null);

  useEffect(() => {
    console.log("GifData received:", {
      type: typeof gifData,
      isArrayBuffer: gifData instanceof ArrayBuffer,
      byteLength: gifData?.byteLength,
    });

    if (!gifData) return;

    try {
      // Create blob and URL
      const blob = new Blob([gifData], { type: "image/gif" });
      console.log("Blob created:", {
        size: blob.size,
        type: blob.type,
      });

      const url = URL.createObjectURL(blob);
      console.log("Blob URL created:", url);
      setBlobUrl(url);
      setPreviewError(null);

      // Cleanup
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
          console.log("Blob URL revoked:", url);
        }
      };
    } catch (error) {
      console.error("Error creating blob URL:", error);
      setPreviewError("Failed to process GIF data");
      toast.error("Failed to process GIF data");
    }
  }, [gifData]);

  const validateGifData = () => {
    if (!gifData) return false;
    if (!(gifData instanceof ArrayBuffer)) return false;
    return gifData.byteLength > 0;
  };

  const handleDownload = async () => {
    if (!validateGifData()) {
      toast.error("Invalid GIF data");
      return;
    }

    try {
      const blob = new Blob([gifData], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `animated-portrait-${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("GIF downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download GIF");
    }
  };

  const handleSaveToGallery = () => {
    if (!validateGifData()) {
      toast.error("Invalid GIF data");
      return;
    }

    try {
      const savedGifs = JSON.parse(localStorage.getItem("savedGifs")) || [];

      // Convert ArrayBuffer to base64
      const uint8Array = new Uint8Array(gifData);
      const base64String = btoa(
        Array.from(uint8Array)
          .map((byte) => String.fromCharCode(byte))
          .join("")
      );

      const newGif = {
        id: Date.now(),
        url: `data:image/gif;base64,${base64String}`,
        createdAt: new Date().toISOString(),
      };

      savedGifs.unshift(newGif);
      localStorage.setItem("savedGifs", JSON.stringify(savedGifs));
      toast.success("GIF saved to gallery!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save GIF to gallery");
    }
  };

  if (!gifData || !validateGifData()) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          {previewError || "Invalid or missing GIF data"}
        </p>
        <button
          onClick={onTryAgain}
          className="mt-4 text-primary-500 hover:text-primary-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}
        {blobUrl && (
          <img
            src={blobUrl}
            alt="Generated GIF"
            className="w-full aspect-square object-contain"
            onLoad={() => {
              console.log("GIF image loaded successfully");
              setIsImageLoading(false);
            }}
            onError={(e) => {
              console.error("Image load error:", {
                event: e,
                blobUrl,
                imageNaturalSize:
                  e.target.naturalWidth + "x" + e.target.naturalHeight,
              });
              setIsImageLoading(false);
              setPreviewError("Failed to load GIF preview");
              toast.error("Failed to load GIF preview");
            }}
          />
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={handleDownload}
          disabled={isImageLoading || !blobUrl}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          <span>Download GIF</span>
        </button>

        <button
          onClick={handleSaveToGallery}
          disabled={isImageLoading || !blobUrl}
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

export default GifPreview;