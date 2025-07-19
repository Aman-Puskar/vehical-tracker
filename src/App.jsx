import React, { useEffect, useRef, useState } from "react";
import {MapContainer, TileLayer,Marker,Polyline,} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import carIconPng from "./car-icon/car.png";

export default function App() {
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef(null);

  //when app starts load the data only once thats why depenency array is empty
  useEffect(() => {
    fetch("/dummy-route.json")
      .then((res) => res.json())
      .then((data) => setRoute(data));
  }, []);

  // movement when app starts
  useEffect(() => {
    if (!playing || route.length === 0) return;

    //setting currentIndex every 1sec.
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < route.length - 1 ? prev + 1 : prev
      );
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [route, playing]);

  //Show loading if data not ready 
  if (route.length === 0) return <div className="text-center mt-10">Loading map...</div>;

  const current = route[currentIndex];
  const path = route.slice(0, currentIndex + 1).map((p) => [p.latitude, p.longitude]);

  return (
    <div className="min-h-screen bg-gray-500 p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">🚗 Vehicle Tracker</h1>

      {/* how map*/}
      <div className="h-[500px] w-full rounded shadow overflow-hidden">
        <MapContainer center={[current.latitude, current.longitude]} zoom={16} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={path} color="blue" />
          <Marker
            position={[current.latitude, current.longitude]}
            icon={new L.Icon({
              iconUrl: carIconPng,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })}
          />
        </MapContainer>
      </div>

      {/* Play/Pause */}
      <div className="text-center mt-6">
        <button
          onClick={() => setPlaying(!playing)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
