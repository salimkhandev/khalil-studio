"use client";
import Link from "next/link";
import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      location.href = "/panel";
    } else {
      setError("Invalid password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-xl border border-white/15 bg-white/5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <Link href="/" className="rounded-md border px-2.5 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10">Back to Home</Link>
        </div>
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Login</button>
      </form>
    </main>
  );
}


