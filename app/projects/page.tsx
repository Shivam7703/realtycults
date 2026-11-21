// Path: app/properties/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import Globalbanner from "@/component/global/banner";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic"; // naya project turant dikhe

export const metadata: Metadata = {
  title: "Our Projects",
  description: "Hamare ongoing aur completed real estate projects dekhein.",
};

export default async function PropertiesPage() {
  const projects = await getProjects();

  return (
    <main className="bg-white">
      <Globalbanner title="Our Projects" slug="projects" />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Abhi koi project available nahi hai.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="group overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-orange-50 shadow-sm transition hover:shadow-lg"
              >
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
                <div className="p-5">
                  <h2 className="font-serif text-xl text-gray-900">{p.title}</h2>

                  <dl className="mt-3 grid grid-cols-2 gap-3">
                    {p.details.slice(0, 2).map((d) => (
                      <div key={d.label}>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
                          {d.label}
                        </dt>
                        <dd className="mt-0.5 text-sm text-gray-800">{d.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <span className="mt-4 inline-block text-sm font-medium text-amber-700">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}