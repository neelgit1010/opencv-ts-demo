export const loadOpenCv = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).cv?.["ready"]) {
      resolve();
    } else {
      (window as any).cv = {
        onRuntimeInitialized: () => {
          console.log("OpenCV runtime initialized");
          resolve();
        },
      };

      const script = document.createElement("script");
      script.src = "https://docs.opencv.org/4.x/opencv.js";
      script.async = true;
      script.onload = () => console.log("OpenCV script loaded");
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    }
  });
};