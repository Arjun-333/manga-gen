"use client";

import { useEffect, useState } from "react";

export default function HealthCheck() {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-50">
      <p className="text-xs font-mono">
        Backend Status: <span className="text-yellow-500">Bypassed - Try generating!</span>
      </p>
    </div>
  );
}
