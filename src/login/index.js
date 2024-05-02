import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Login() {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Destructure loginForm for easier access
    const { latitude } = loginForm;

    try {
      // Check if latitude is available
      if (!latitude) {
        alert("Please turn on location or reload webpage !");
        return;
      }

      const response = await fetch("http://localhost:9002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      // Check if response is ok
      if (!response.ok) {
        alert(response?.statusText);
        throw new Error("Failed to login");
      }

      const data = await response.json();

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(data?.data));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoginForm((preState) => ({
            ...preState,
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

  const handleSigin = async () => {
    navigate("/login-with-faceid");
  };
  const handleSigup = async () => {
    navigate("/signup");
  };

  return (
    <div className="h-lvh w-lvw flex flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="px-2 py-1 rounded border border-gray-400"
            onChange={(e) =>
              setLoginForm((preState) => ({
                ...preState,
                username: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="px-2 py-1 rounded border border-gray-400"
            onChange={(e) =>
              setLoginForm((preState) => ({
                ...preState,
                password: e.target.value,
              }))
            }
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-1">
          Login
        </button>
        <button
          type="button"
          className="bg-green-700 text-white rounded p-1"
          onClick={handleSigin}
        >
          Login with FaceID
        </button>
        <button
          type="button"
          className="bg-green-700 text-white rounded p-1"
          onClick={handleSigup}
        >
          signup with FaceID
        </button>
      </form>
    </div>
  );
}

export default Login;
