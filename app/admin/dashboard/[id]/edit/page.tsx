// Path: app/admin/dashboard/[id]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Globalbanner from "@/component/global/banner";
import ProjectForm from "@/component/admin/ProjectForm";
import type { ProjectDTO } from "@/types/project";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
        const data = (await res.json()) as { data?: ProjectDTO; error?: string };
        if (!res.ok || !data.data) throw new Error(data.error || "Project nahi mila");
        setProject(data.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    }
    load();
  }, [id]);

  return (
    <main className="bg-gray-100 min-h-screen">
      <Globalbanner title="Edit Project" slug="edit project" />
      <div className="px-4 py-8 sm:py-12">
        {error && <p className="text-center text-red-600">{error}</p>}
        {!project && !error && <p className="text-center text-gray-500">Loading...</p>}
        {project && <ProjectForm mode="edit" project={project} />}
      </div>
    </main>
  );
}