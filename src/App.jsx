import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
  const [videoSrc, setVideoSrc] = useState("");

  const [videoFile, setVideoFile] = useState({});

  const ffmpeg = createFFmpeg({
    log: true,
  });

  const handleChangeImage = (e) => {
    setVideoFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const createVideo = async () => {
    await ffmpeg.load();

    ffmpeg.FS("writeFile", `${videoFile.name.slice(0, -4)}.mp4`, await fetchFile(videoFile));

    await ffmpeg.run(
      "-i",
      `${videoFile.name.slice(0, -4)}.mp4`,
      "-s",
      "1920x1080",
      "output.mp4"
    );

    ffmpeg.setProgress(({ ratio }) => {
      console.log(ratio);
      /*
       * ratio is a float number between 0 to 1.
       */
    });

    const data = ffmpeg.FS("readFile", "output.mp4");

    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };

  return (
    <div className="App">
      <video src={videoSrc} controls></video>
      <br />
      <input
        type="file"
        id="video"
        accept="video/*"
        onChange={handleChangeImage}
      ></input>
      <br />
      <button onClick={createVideo}>Convert to mp4</button>
    </div>
  );
}

export default App;
