import { spawn } from "child_process";
import fs from "fs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase.js";

const convertToHLS = async (inputFile, songId) => {
  try {
    const outputDir = `./public/streams/${songId}`;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const audioDuration = await getAudioDuration(inputFile);

    const audioOnlyPath = `${outputDir}/audio_only.mp3`;
    
    return new Promise((resolve, reject) => {
      // Step 1: Extract audio only without video/image streams
      const ffmpegExtract = spawn('ffmpeg', [
        '-i', inputFile,
        '-vn',  // Skip video/image streams
        '-c:a', 'copy', // Copy audio without re-encoding
        audioOnlyPath
      ]);

      ffmpegExtract.on('close', (extractCode) => {
        if (extractCode === 0) {
          console.log("Successfully extracted audio-only file");
          
          const ffmpegHLS = spawn('ffmpeg', [
            '-i', audioOnlyPath,
            '-c:a', 'aac',        // Use AAC codec for audio
            '-b:a', '128k',       // Set audio bitrate
            '-ar', '44100',       // Set audio sample rate
            '-hls_time', '5',    // 10-second segments
            '-hls_list_size', '0', // All segments in the playlist
            '-hls_segment_filename', `${outputDir}/playlist%d.ts`,
            `${outputDir}/playlist.m3u8`
          ]);

          ffmpegHLS.stderr.on('data', (data) => {
            console.log(`FFmpeg: ${data}`);
          });

          ffmpegHLS.on('close', async (hlsCode) => {
            if (hlsCode === 0) {
              try {
                const segmentFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.ts'));
                const segmentUrls = {};
                
                for (const segment of segmentFiles) {
                  const segmentRef = ref(storage, `hls/${songId}/${segment}`);
                  await uploadBytes(segmentRef, fs.readFileSync(`${outputDir}/${segment}`));
                  const downloadUrl = await getDownloadURL(segmentRef);
                  segmentUrls[segment] = downloadUrl;
                }
                
                let m3u8Content = fs.readFileSync(`${outputDir}/playlist.m3u8`, 'utf8');
                
                for (const [segment, url] of Object.entries(segmentUrls)) {
                  m3u8Content = m3u8Content.replace(
                    new RegExp(`^${segment}$`, 'gm'), 
                    url
                  );
                }
                
                fs.writeFileSync(`${outputDir}/modified_playlist.m3u8`, m3u8Content);
                
                const m3u8Ref = ref(storage, `hls/${songId}/playlist.m3u8`);
                await uploadBytes(m3u8Ref, fs.readFileSync(`${outputDir}/modified_playlist.m3u8`));
                const m3u8Url = await getDownloadURL(m3u8Ref);
                
                fs.rmSync(outputDir, { recursive: true, force: true });
                
                resolve({
                  masterUrl: m3u8Url,
                  segmentUrls: Object.values(segmentUrls),
                  duration: audioDuration
                });
              } catch (error) {
                reject(`Error uploading HLS files: ${error.message}`);
              }
            } else {
              reject(`FFmpeg HLS process exited with code ${hlsCode}`);
            }
          });
        } else {
          reject(`FFmpeg extract process exited with code ${extractCode}`);
        }
      });

      ffmpegExtract.stderr.on('data', (data) => {
        console.log(`FFmpeg Extract: ${data}`);
      });
    });
  } catch (error) {
    console.error("HLS conversion error:", error);
    throw error;
  }
};

const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-i', filePath,
      '-show_entries', 'format=duration',
      '-v', 'quiet',
      '-of', 'csv=p=0'
    ]);

    let output = '';

    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        console.warn(`FFprobe process exited with code ${code}`);
        resolve(0);
      } else {
        const duration = parseFloat(output.trim());
        resolve(isNaN(duration) ? 0 : duration);
      }
    });
  });
};

export { convertToHLS };