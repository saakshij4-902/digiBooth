export default function Controls({ setFilter, takePhotos }) {
  return (
    <div className="controls">
      <p>Click a picture 💕</p>

      <div className="filters">
        <button onClick={() => setFilter("none")}>No Filter</button>
        <button onClick={() => setFilter("grayscale(1)")}>B&W</button>
        <button onClick={() => setFilter("sepia(0.6)")}>Vintage</button>
        <button onClick={() => setFilter("contrast(1.3)")}>Soft</button>
      </div>

      <button className="capture-btn" onClick={takePhotos}>
        Start Capture 📸
      </button>
    </div>
  );
}
