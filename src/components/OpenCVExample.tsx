"use client";

import { useEffect, useRef, useState } from "react";
import { loadOpenCv } from "@/helper/OpencvLoader";

export default function OpenCVExample() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [error, setError] = useState("");

  // Load OpenCV
  useEffect(() => {
    loadOpenCv()
      .then(() => {
        console.log("OpenCV ready");
        setIsLoaded(true);
      })
      .catch(() => {
        setError("Failed to load OpenCV.");
      });
  }, []);

  // Attempt to access webcam
  useEffect(() => {
    if (!isLoaded) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setCameraAvailable(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        console.error("No camera available:", err);
        setCameraAvailable(false);
        setError("No webcam detected or permission denied.");
      });
  }, [isLoaded]);

  // Process frame with OpenCV
  const processFrame = () => {
    const cv = (window as any).cv;
    if (!cv || !videoRef.current || !canvasRef.current) return;

    const src = new cv.Mat(
      videoRef.current.videoHeight,
      videoRef.current.videoWidth,
      cv.CV_8UC4
    );
    const dst = new cv.Mat();
    const cap = new cv.VideoCapture(videoRef.current);
    cap.read(src);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow(canvasRef.current, dst);
    src.delete();
    dst.delete();
  };

  return (
    <div className="flex flex-col items-center gap-4 text-white">
      <video
        ref={videoRef}
        width="320"
        height="240"
        className="rounded border"
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {!error && !cameraAvailable && (
        <p className="mt-4">Waiting for webcam...</p>
      )}
    </div>
  );
}