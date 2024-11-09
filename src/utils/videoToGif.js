import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

export async function convertVideoToGif(videoBlob, onProgress = () => {}) {
  try {
    onProgress('Initializing FFmpeg...');
    
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      
      // Log progress
      ffmpeg.on('progress', ({ ratio }) => {
        onProgress(`Converting: ${(ratio * 100).toFixed(0)}%`);
      });

      // Load FFmpeg
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    }

    // Write video file
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));

    // Run FFmpeg command
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', 'fps=12,scale=320:-1',
      '-f', 'gif',
      'output.gif'
    ]);

    // Read the output
    const data = await ffmpeg.readFile('output.gif');

    // Cleanup
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.gif');

    return new Blob([data], { type: 'image/gif' });
  } catch (error) {
    console.error('Error in convertVideoToGif:', error);
    throw new Error(`Failed to convert video to GIF: ${error.message}`);
  }
}