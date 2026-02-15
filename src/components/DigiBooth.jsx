import { useRef, useState } from "react";
import StripPreview from "./StripPreview";

export default function DigiBooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [filter, setFilter] = useState("none");
  const [showStrip, setShowStrip] = useState(false);
  const [frameColor, setFrameColor] = useState("#ffffff");

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (err) {
      alert("Please allow camera access 💕");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video) return null;

    const ctx = canvas.getContext("2d");

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    ctx.filter = filter;
    ctx.drawImage(video, 0, 0, width, height);

    return canvas.toDataURL("image/png");
  };

  const startCountdown = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Please open the camera first 💕");
      return;
    }

    let time = 3;
    setCountdown(time);

    const interval = setInterval(() => {
      time--;

      if (time <= 0) {
        clearInterval(interval);
        setCountdown(null);

        const newPhoto = capturePhoto();
        if (newPhoto) {
          setPhotos(prev => [...prev, newPhoto]);
        }
      } else {
        setCountdown(time);
      }
    }, 1000);
  };

  const resetBooth = () => {
    setPhotos([]);
    setShowStrip(false);
  };

return (
  <div className="booth">

    <h1 className="logo">Digi Booth</h1>

    {!showStrip && (
      <div className="main-area">

        <div className="left-panel">

          <div className="camera-frame">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="video"
              style={{ filter }}
            />
          </div>

          {countdown && (
            <div className="countdown">{countdown}</div>
          )}

          <div className="button-row">
            <button className="primary-btn" onClick={openCamera}>
              Open Camera
            </button>

            <button className="primary-btn" onClick={startCountdown}>
              Click Image 📸
            </button>
          </div>

          <div className="filters">
            <button onClick={() => setFilter("none")}>Normal</button>
            <button onClick={() => setFilter("grayscale(1)")}>Grayscale</button>
            <button onClick={() =>
              setFilter("grayscale(1) contrast(1.4) brightness(0.8)")
            }>
              B&W
            </button>
            <button onClick={() => setFilter("sepia(0.8)")}>Vintage</button>
            <button onClick={() => setFilter("contrast(1.3)")}>Bright</button>
            <button onClick={() => setFilter("hue-rotate(90deg)")}>Cool</button>
            <button onClick={() => setFilter("blur(1px)")}>Soft</button>
          </div>

          {photos.length >= 4 && (
            <button
              className="primary-btn generate-btn"
              onClick={() => setShowStrip(true)}
            >
              Generate Polaroid 🎀
            </button>
          )}

        </div>

        <div className="preview-section">
          {photos.map((photo, index) => (
            <div key={index} className="preview-box">
              <img src={photo} alt="preview" />
            </div>
          ))}
        </div>

      </div>
    )}

    {showStrip && (
      <StripPreview
        photos={photos}
        goBack={resetBooth}
      />
    )}

    <canvas ref={canvasRef} style={{ display: "none" }} />
  </div>
);

}
