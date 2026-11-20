// Path: app/properties/[id]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Globalbanner from "@/component/global/banner";
import ProjectGallery from "@/component/projects/ProjectGallery";
import { getProject } from "@/lib/projects";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: (project.description ?? "").slice(0, 160),
    openGraph: { images: project.images[0] ? [project.images[0]] : [] },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const paragraphs: string[] = (project.description ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <main className="bg-white">
      <Globalbanner title={project.title} slug={`projects / ${project.title}`} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <ProjectGallery images={project.images} title={project.title} />

        {/* Label / Value cards (Area, Plot Type, Category, Created By ...) */}
        {project.details.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {project.details.map((d) => (
              <div
                key={d.label}
                className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-orange-50 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                  {d.label}
                </p>
                <p className="mt-3 font-serif text-xl text-gray-900 sm:text-2xl">{d.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {paragraphs.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-3xl text-gray-900">Description</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-gray-600">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-3xl text-gray-900">Highlights</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-xl border border-amber-100 bg-orange-50/50 px-4 py-3 text-gray-700"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}