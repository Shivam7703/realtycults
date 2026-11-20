// Path: app/admin/dashboard/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Globalbanner from "@/component/global/banner";
import type { ProjectDTO } from "@/types/project";

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = (await res.json()) as { data?: ProjectDTO[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Projects load nahi hue");
      setProjects(data.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number): Promise<void> {
    if (!confirm("Ye project aur uski images delete ho jayengi. Pakka?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      alert(data.error || "Delete failed");
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleLogout(): Promise<void> {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <Globalbanner title="Admin Dashboard" slug="admin dashboard" />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Projects ({projects.length})</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard/new"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
            >
              + Add Project
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            Abhi koi project nahi hai. &quot;Add Project&quot; se pehla project banao.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl bg-white shadow">
              {p.images[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt={p.title} className="h-48 w-full object-cover" />
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900">{p.title}</h2>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {p.details.slice(0, 4).map((d) => (
                    <li key={d.label}>
                      <span className="font-medium text-gray-800">{d.label}:</span> {d.value}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-gray-400">{p.images.length} image(s)</p>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/dashboard/${p.id}/edit`}
                    className="flex-1 rounded-lg bg-indigo-50 py-2 text-center text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}