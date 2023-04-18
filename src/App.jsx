import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
  const [videoSrc, setVideoSrc] = useState("");

  const [imageFile, setImageFile] = useState({});
  const [soundFile, setSoundFile] = useState({});

  const ffmpeg = createFFmpeg({
    log: true,
  });

  const handleChangeImage = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChangeSound = (e) => {
    setSoundFile(e.target.files[0]);
  };

  const createVideo = async () => {
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "image.png", await fetchFile(imageFile));
    ffmpeg.FS("writeFile", "sound.mp3", await fetchFile(soundFile));

    await ffmpeg.run(
      "-framerate",
      "1/10",
      "-i",
      "image.png",
      "-i",
      "sound.mp3",
      "-c:v",
      "libx264",
      "-t",
      "10",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      "scale=1920:1080",
      "output.mp4"
    );

    const data = ffmpeg.FS('readFile', 'output.mp4');

    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'})));
  };

  return (
    <div className="App">
      <video src={videoSrc} controls></video>
      <br />
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleChangeImage}
      ></input>
      <br />
      <input
        type="file"
        id="sound"
        accept="sound/*"
        onChange={handleChangeSound}
      ></input>
      <br />
      <button onClick={createVideo}>Create a video from the files above</button>
    </div>
  );
}

export default App;
