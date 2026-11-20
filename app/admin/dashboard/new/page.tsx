// Path: app/admin/dashboard/new/page.tsx

"use client";

import Globalbanner from "@/component/global/banner";
import ProjectForm from "@/component/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <Globalbanner title="Add Project" slug="add project" />
      <div className="px-4 py-8 sm:py-12">
        <ProjectForm mode="create" />
      </div>
    </main>
  );
}