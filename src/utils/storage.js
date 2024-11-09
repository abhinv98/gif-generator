export const saveToGallery = (videoData) => {
  try {
    const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");

    // Convert ArrayBuffer to base64
    const uint8Array = new Uint8Array(videoData);
    const base64String = btoa(
      Array.from(uint8Array)
        .map((byte) => String.fromCharCode(byte))
        .join("")
    );

    const newVideo = {
      id: Date.now(),
      url: `data:video/mp4;base64,${base64String}`,
      createdAt: new Date().toISOString(),
    };

    savedVideos.unshift(newVideo);
    localStorage.setItem("savedVideos", JSON.stringify(savedVideos));
    return newVideo;
  } catch (error) {
    console.error("Error saving to gallery:", error);
    throw new Error("Failed to save video to gallery");
  }
};

export const loadFromGallery = () => {
  try {
    const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
    return savedVideos.filter((video) =>
      video?.url?.startsWith("data:video/mp4;base64,")
    );
  } catch (error) {
    console.error("Error loading from gallery:", error);
    return [];
  }
};

export const deleteFromGallery = (videoId) => {
  try {
    const savedVideos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
    const updatedVideos = savedVideos.filter((video) => video.id !== videoId);
    localStorage.setItem("savedVideos", JSON.stringify(updatedVideos));
  } catch (error) {
    console.error("Error deleting from gallery:", error);
    throw new Error("Failed to delete video from gallery");
  }
};
