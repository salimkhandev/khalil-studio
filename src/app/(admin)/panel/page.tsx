"use client";
import AdminPanel from "@/components/admin/AdminPanel";
import Link from "next/link";

export default function AdminPanelPage() {
  return (
    <main className="min-h-screen mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <Link href="/" className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">Back to Home</Link>
      </div>
      <AdminPanel />
    </main>
  );
}


