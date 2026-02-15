import { useEffect, useRef, useState } from "react";

export default function StripPreview({ photos, goBack }) {
  const canvasRef = useRef(null);

  const [caption, setCaption] = useState("Best Day 💗");
  const [outerColor, setOuterColor] = useState("#a8d8f7");
  const [innerColor, setInnerColor] = useState("#ffffff");
  const [stickers, setStickers] = useState([]);

  const stickerOptions = ["💗", "✨", "🌸", "🦋", "🎀"];

  const toggleSticker = (sticker) => {
    if (stickers.includes(sticker)) {
      setStickers(stickers.filter((s) => s !== sticker));
    } else {
      setStickers([...stickers, sticker]);
    }
  };

 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const BASE_WIDTH = 380;
  const BASE_HEIGHT = 980;

  const SCALE = 2; 

  const WIDTH = BASE_WIDTH * SCALE;
  const HEIGHT = BASE_HEIGHT * SCALE;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  canvas.style.width = BASE_WIDTH + "px";
  canvas.style.height = BASE_HEIGHT + "px";

  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.scale(SCALE, SCALE);

  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  ctx.fillStyle = outerColor;
  roundRect(0, 0, BASE_WIDTH, BASE_HEIGHT, 40);
  ctx.fill();

  const stripWidth = 300;
  const stripX = (BASE_WIDTH - stripWidth) / 2;
  const stripY = 40;

  ctx.fillStyle = innerColor;
  ctx.fillRect(stripX, stripY, stripWidth, BASE_HEIGHT - 80);

  const photoWidth = 260;
  const gap = 12;
  const photoX = stripX + 20;

  const draw = async () => {
    let totalHeight = 0;

    for (let i = 0; i < photos.length; i++) {
      const img = new Image();
      img.src = photos[i];
      await new Promise((resolve) => (img.onload = resolve));

      const aspectRatio = img.height / img.width;
      const photoHeight = photoWidth * aspectRatio;

      const photoY = stripY + 25 + totalHeight;

      ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);

      totalHeight += photoHeight + gap;
    }

    const captionY = stripY + 25 + totalHeight + 25;

    const isDark = innerColor === "#111111";

    ctx.textAlign = "center";

    ctx.font = "bold 22px Helvetica, Arial, sans-serif";
    ctx.fillStyle = isDark ? "#ffffff" : "#333";
    ctx.fillText(caption, BASE_WIDTH / 2, captionY);

    ctx.font = "14px Helvetica, Arial, sans-serif";
    ctx.fillStyle = isDark ? "#cccccc" : "#888";
    ctx.fillText(
      new Date().toLocaleDateString(),
      BASE_WIDTH / 2,
      captionY + 22
    );

    const positions = [
      [stripX + 10, stripY + 10],
      [stripX + stripWidth - 30, stripY + 10],
      [stripX + 10, BASE_HEIGHT - 60],
      [stripX + stripWidth - 30, BASE_HEIGHT - 60],
    ];

    stickers.forEach((sticker, i) => {
      if (positions[i]) {
        ctx.font = "26px serif";
        ctx.fillText(sticker, positions[i][0], positions[i][1]);
      }
    });
  };

  draw();
}, [photos, outerColor, innerColor, stickers, caption]);

  const download = () => {
    const link = document.createElement("a");
    link.download = `DigiBooth-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="strip-layout">
      <canvas ref={canvasRef}></canvas>

      <div className="controls">
        <h3>Outer Background</h3>
        <button onClick={() => setOuterColor("#a8d8f7")}>Blue</button>
        <button onClick={() => setOuterColor("#f6a5c0")}>Pink</button>
        <button onClick={() => setOuterColor("#800020")}>Maroon</button>
        <button onClick={() => setOuterColor("#111111")}>Black</button>
        <button onClick={() => setOuterColor("#a8e6c1")}>Green</button>

        <h3>Inner Strip</h3>
        <button onClick={() => setInnerColor("#ffffff")}>White</button>
        <button onClick={() => setInnerColor("#fdf6e3")}>Cream</button>
        <button onClick={() => setInnerColor("#fce4ec")}>Soft Pink</button>
        <button onClick={() => setInnerColor("#111111")}>Black</button>

        <h3>Caption</h3>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <h3>Stickers</h3>
        <div>
          {stickerOptions.map((s, i) => (
            <button key={i} onClick={() => toggleSticker(s)}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button onClick={download}>Download</button>
          <button onClick={goBack}>Back</button>
        </div>
      </div>
    </div>
  );
}
