import axios from "axios";

const SEGMIND_API_URL = "https://api.segmind.com/v1/live-portrait";
const API_KEY = import.meta.env.VITE_SEGMIND_API_KEY;

const api = axios.create({
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
  responseType: "arraybuffer",
  timeout: 60000,
});

const convertBase64UrlToBase64String = (base64Url) => {
  return base64Url.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
};

export const validateImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        if (img.width < 256 || img.height < 256) {
          reject(new Error("Image must be at least 256x256 pixels"));
        } else if (img.width > 2048 || img.height > 2048) {
          reject(new Error("Image must be smaller than 2048x2048 pixels"));
        } else {
          resolve(reader.result);
        }
      };

      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const generateVideo = async (imageBase64, onStatus = () => {}) => {
  if (!imageBase64) {
    throw new Error("No image data provided");
  }

  if (!API_KEY) {
    throw new Error("API key is not configured");
  }

  onStatus("Preparing image...");

  try {
    const payload = {
      face_image: convertBase64UrlToBase64String(imageBase64),
      driving_video:
        "https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-video.mp4",
      live_portrait_dsize: 512,
      live_portrait_scale: 2.3,
      video_frame_load_cap: 128,
      live_portrait_lip_zero: true,
      live_portrait_relative: true,
      live_portrait_vx_ratio: 0,
      live_portrait_vy_ratio: -0.12,
      live_portrait_stitching: true,
      video_select_every_n_frames: 1,
      live_portrait_eye_retargeting: false,
      live_portrait_lip_retargeting: false,
      live_portrait_lip_retargeting_multiplier: 1,
      live_portrait_eyes_retargeting_multiplier: 1,
    };

    onStatus("Generating video...");
    const response = await api.post(SEGMIND_API_URL, payload);

    if (!response.data || !(response.data instanceof ArrayBuffer)) {
      throw new Error("Invalid response format from API");
    }

    onStatus("Processing complete!");
    return response.data;
  } catch (error) {
    console.error("Video generation error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Failed to generate video"
    );
  }
};
