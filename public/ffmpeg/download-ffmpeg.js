const https = require("https");
const fs = require("fs");
const path = require("path");

const files = [
  {
    url: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.js",
    output: "public/ffmpeg/ffmpeg-core.js",
  },
  {
    url: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd/ffmpeg-core.wasm",
    output: "public/ffmpeg/ffmpeg-core.wasm",
  },
];

files.forEach((file) => {
  https.get(file.url, (response) => {
    const fileStream = fs.createWriteStream(file.output);
    response.pipe(fileStream);
    fileStream.on("finish", () => {
      console.log(`Downloaded ${file.output}`);
    });
  });
});
