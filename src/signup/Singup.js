import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const convertBase64ToFile = (base64Data) => {
  const byteString = atob(base64Data.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: "image/png" });
  const file = new File([blob], "image.png", { type: "image/png" });
  console.log("Converted file:", file);
  return file;
};

function SignupWithFaceId() {
  const [localUserStream, setLocalUserStream] = useState(null);
  const [signupResult, setSignupResult] = useState("PENDING");
  const videoRef = useRef();
  const canvasRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getLocalUserVideo();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation((prevState) => ({
            ...prevState,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [navigator?.geolocation]);

  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const pauseLocalUserVideo = () => {
    if (localUserStream) {
      const tracks = localUserStream.getVideoTracks();
      tracks.forEach((track) => {
        track.enabled = false;
      });
    }
  };

  const scanFace = async (e) => {
    e.preventDefault();
    if (!userLocation.latitude) {
      alert("Please turn on location!");
      return;
    }
    setIsLoading(true);
    setSignupResult("PENDING");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    pauseLocalUserVideo();
    const img = canvasRef.current.toDataURL("image/png");
    const file = convertBase64ToFile(img);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lat", userLocation?.latitude);
    formData.append("long", userLocation?.longitude);
    formData.append("username", username);
    formData.append("password", password);

    fetch("http://localhost:9002/post-face", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res?.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        setSignupResult("SUCCESS");
        localStorage?.setItem("user", JSON.stringify(data?.result));
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      })
      .catch((err) => {
        console.error("Error during fetch operation:", err);
        setIsLoading(false);
        setSignupResult("FAILED");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[24px] max-w-[720px] mx-auto">
      {signupResult === "SUCCESS" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600 mt-2">
            Successfully signed up with face recognition!
          </span>
        </h2>
      )}

      {signupResult === "FAILED" && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
          <span className="block mt-[56px]">
            Oops! Signup with face recognition failed.
          </span>
        </h2>
      )}

      {signupResult === "PENDING" && isLoading && (
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block mt-[56px]">Signing up...</span>
        </h2>
      )}

      <div className="w-full">
        <div className="relative flex flex-col items-center p-[10px]">
          <video
            muted
            autoPlay
            ref={videoRef}
            height={videoHeight}
            width={videoWidth}
            style={{
              objectFit: "fill",
              borderRadius: "10px",
              display: localUserStream ? "block" : "none",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              display: localUserStream ? "block" : "none",
            }}
          />
        </div>
        <div className="text-center">
          {!isLoading && (
            <form onSubmit={scanFace}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="py-2.5 px-3 mr-2 mb-2 rounded-lg border border-gray-300"
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2.5 px-3 mr-2 mb-2 rounded-lg border border-gray-300"
              />
              <br />
              <button
                type="submit"
                className="flex justify-center items-center w-1/2 py-2.5 px-5 mr-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg border border-gray-200 inline-flex items-center"
              >
                Sign up with face recognition
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupWithFaceId;
