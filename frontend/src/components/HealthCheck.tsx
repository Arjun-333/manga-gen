"use client";

import { useEffect, useState } from "react";

export default function HealthCheck() {
  const [status, setStatus] = useState<string>("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch((err) => setStatus("Backend not connected"));
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700">
      <p className="text-xs font-mono">Backend Status: <span className={status.includes("running") ? "text-green-500" : "text-red-500"}>{status}</span></p>
    </div>
  );
}
