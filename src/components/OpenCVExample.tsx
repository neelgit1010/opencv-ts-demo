"use client";

import { useEffect, useRef, useState } from "react";
import { loadOpenCv } from "@/helper/OpencvLoader";

export default function OpenCVExample() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Load OpenCV.js
  useEffect(() => {
    loadOpenCv()
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error("OpenCV load error:", err);
        setErrorMsg("Failed to load OpenCV.");
      });
  }, []);

  // 2. Try accessing webcam
  useEffect(() => {
    if (!isLoaded || !videoRef.current) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();
        setCameraAvailable(true);
      })
      .catch((err) => {
        console.warn("No webcam available or permission denied:", err);
        setCameraAvailable(false);
        setErrorMsg("No webcam detected or permission denied.");
      });
  }, [isLoaded]);

  // 3. Frame processing logic
  const processFrame = () => {
    const cv = (window as any).cv;
    if (!cv || !videoRef.current || !canvasRef.current) return;

    try {
      const cap = new cv.VideoCapture(videoRef.current);
      const src = new cv.Mat(
        videoRef.current.videoHeight,
        videoRef.current.videoWidth,
        cv.CV_8UC4
      );
      const dst = new cv.Mat();

      cap.read(src);
      cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
      cv.imshow(canvasRef.current, dst);

      src.delete();
      dst.delete();
    } catch (error) {
      console.error("OpenCV processing error:", error);
      setErrorMsg("Error during frame processing.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 text-white">
      {errorMsg && <div className="text-red-500 font-semibold">{errorMsg}</div>}

      <video
        ref={videoRef}
        width="320"
        height="240"
        className="rounded border"
        style={{ backgroundColor: "#000" }}
      />
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        className="rounded border"
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={processFrame}
        disabled={!isLoaded || !cameraAvailable}
      >
        Process Frame
      </button>
    </div>
  );
}
