import { useState, useCallback } from "react";

export const useCamera = () => {
  const [isCameraAvailable, setIsCameraAvailable] = useState(null);
  const [error, setError] = useState(null);

  const checkCameraAvailability = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      setIsCameraAvailable(hasCamera);
      setError(null);
    } catch (err) {
      setIsCameraAvailable(false);
      setError("Unable to access camera devices");
    }
  }, []);

  const requestCameraPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraAvailable(true);
      setError(null);
      return true;
    } catch (err) {
      setIsCameraAvailable(false);
      setError("Camera permission denied");
      return false;
    }
  }, []);

  return {
    isCameraAvailable,
    error,
    checkCameraAvailability,
    requestCameraPermission,
  };
};
