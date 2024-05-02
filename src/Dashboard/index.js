import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";

const Dashboard = () => {
  const Navigation = useNavigate();
  const [user, setUser] = useState({});
  const [logs, setLogs] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const getLog = (id) => {
    fetch(`http://localhost:9002/logs/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setLogs(res);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation((preState) => ({
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
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (user._id) getLog(user._id);
  }, [user]);

  if (
    !localStorage.getItem("user") ||
    localStorage.getItem("user") == undefined
  ) {
    return <Navigate to={"/"} replace />;
  }
  const handleSignOut = () => {
    localStorage.removeItem("user");
    fetch("http://localhost:9002/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id, ...currentLocation }),
    });
    Navigation("/");
  };

  return (
    <div className="w-3/4">
      <p className="text-lg font-bold">Dashboard</p>
      <div>
        <div className="flex justify-between">
          <p className="text-lg font-semibold">{user?.username}</p>
          <button onClick={handleSignOut}>SignOut</button>
        </div>
        <div className="flex justify-center mt-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Latitude
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Longitude
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, key) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user?.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log?.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log?.latitude}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log?.longitude}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log?.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
