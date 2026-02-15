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
      setStickers(stickers.filter(s => s !== sticker));
    } else {
      setStickers([...stickers, sticker]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const WIDTH = 380;
    const HEIGHT = 980; // taller for caption breathing space

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // ========= OUTER BACKGROUND (curved) =========
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
    roundRect(0, 0, WIDTH, HEIGHT, 40);
    ctx.fill();

    // ========= INNER STRIP (NO CURVE) =========
    const stripWidth = 300;
    const stripX = (WIDTH - stripWidth) / 2;
    const stripY = 40;
    const stripHeight = HEIGHT - 80;

    ctx.fillStyle = innerColor;
    ctx.fillRect(stripX, stripY, stripWidth, stripHeight);

    // ========= PHOTOS =========
    const photoWidth = 260;
    const photoHeight = 180;
    const gap = 12;
    const photoX = stripX + 20;

    (async () => {
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise(resolve => img.onload = resolve);

        const photoY = stripY + 25 + i * (photoHeight + gap);

        ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
      }

      // ========= CAPTION AREA =========
      const captionY =
        stripY + 25 + photos.length * (photoHeight + gap) + 30;

      const isDark = innerColor === "#111111";

      ctx.textAlign = "center";

      // Clean Helvetica-style font
      ctx.font = "bold 22px Helvetica, Arial, sans-serif";
      ctx.fillStyle = isDark ? "#ffffff" : "#333";
      ctx.fillText(caption, WIDTH / 2, captionY);

      // Date below caption
      ctx.font = "14px Helvetica, Arial, sans-serif";
      ctx.fillStyle = isDark ? "#cccccc" : "#888";
      ctx.fillText(
        new Date().toLocaleDateString(),
        WIDTH / 2,
        captionY + 22
      );

      // ========= STICKERS (safe corners) =========
      const positions = [
        [stripX + 10, stripY + 10],
        [stripX + stripWidth - 30, stripY + 10],
        [stripX + 10, stripY + stripHeight - 40],
        [stripX + stripWidth - 30, stripY + stripHeight - 40],
      ];

      stickers.forEach((sticker, i) => {
        if (positions[i]) {
          ctx.font = "26px serif";
          ctx.fillText(sticker, positions[i][0], positions[i][1]);
        }
      });

    })();

  }, [photos, outerColor, innerColor, stickers, caption]);

  const download = () => {
    const link = document.createElement("a");
    link.download = "korean-photobooth.png";
    link.href = canvasRef.current.toDataURL();
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
