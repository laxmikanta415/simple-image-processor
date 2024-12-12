import { useRef, useState, useEffect } from "react";
import sample from "/sample.jpg";

const ImageProcessor = () => {
  const canvasRef = useRef(null);
  const [alpha, setAlpha] = useState(255); // Alpha value (0-255)
  const [imageLoaded, setImageLoaded] = useState(false);

  const loadImageToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.crossOrigin = "anonymous"; // Handle cross-origin images if necessary
    img.src = sample;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      applyAlpha();
      setImageLoaded(true);
    };
  };

  const applyAlpha = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 3; i < data.length; i += 4) {
      data[i] = alpha; // Apply the alpha value
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const downloadCanvasImage = (type) => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `output.${type}`;
    link.href = canvas.toDataURL(`image/${type}`);
    link.click();
  };

  useEffect(() => {
    loadImageToCanvas();
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      applyAlpha();
    }
  }, [alpha]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Image Processor</h1>
      <h3>Below one is a JPG image</h3>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => downloadCanvasImage("png")}>
          Download as PNG
        </button>

        <div style={{ marginTop: "20px" }}>
          <label>
            Adjust Alpha as RGPA
            <input
              type="range"
              min="0"
              max="255"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              style={{ marginLeft: "10px" }}
            />
          </label>
          <p>Alpha Value: {alpha}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageProcessor;
