// Path: component/admin/ProjectForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectDTO } from "@/types/project";

type Props = {
  mode: "create" | "edit";
  project?: ProjectDTO;
};

const MAX_IMAGES = 4;

const inputCls =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

const countCsv = (s: string): number =>
  s.split(",").map((x) => x.trim()).filter(Boolean).length;

export default function ProjectForm({ mode, project }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState<string>(project?.title ?? "");
  const [labels, setLabels] = useState<string>(project?.raw.labels ?? "");
  const [values, setValues] = useState<string>(project?.raw.values ?? "");
  const [description, setDescription] = useState<string>(project?.description ?? "");
  const [highlights, setHighlights] = useState<string>(project?.raw.highlights ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const list = Array.from(e.target.files ?? []);
    previews.forEach((u) => URL.revokeObjectURL(u));

    if (list.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images select kar sakte ho`);
      setFiles([]);
      setPreviews([]);
      e.target.value = "";
      return;
    }
    setError("");
    setFiles(list);
    setPreviews(list.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title zaroori hai");
    if (countCsv(labels) === 0) return setError("Labels daalo");
    if (countCsv(labels) !== countCsv(values)) {
      return setError(
        `Labels (${countCsv(labels)}) aur Values (${countCsv(values)}) ki count same honi chahiye`
      );
    }
    if (mode === "create" && (files.length < 1 || files.length > MAX_IMAGES)) {
      return setError(`1 se ${MAX_IMAGES} images select karo`);
    }

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("labels", labels);
    fd.append("values", values);
    fd.append("description", description);
    fd.append("highlights", highlights);
    files.forEach((f) => fd.append("images", f));

    const url = mode === "create" ? "/api/projects" : `/api/projects/${project?.id}`;

    setLoading(true);
    try {
      const res = await fetch(url, { method: mode === "create" ? "POST" : "PUT", body: fd });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl space-y-6 rounded-2xl bg-white p-6 shadow-lg sm:p-8"
    >
      <h1 className="text-2xl font-bold text-gray-900">
        {mode === "create" ? "Add New Project" : "Edit Project"}
      </h1>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <input
          className={inputCls}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="CR Park H Block - 233 Yards Corner Plot"
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Labels <span className="text-gray-400">(comma se alag) - {countCsv(labels)}</span>
          </label>
          <textarea
            className={inputCls}
            rows={3}
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="Area,Plot Type,Category,Created By"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Values <span className="text-gray-400">(comma se alag) - {countCsv(values)}</span>
          </label>
          <textarea
            className={inputCls}
            rows={3}
            value={values}
            onChange={(e) => setValues(e.target.value)}
            placeholder="233 Yards,Corner / North East,Ongoing,CITYSPACE"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className={inputCls}
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project ki description..."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Highlights <span className="text-gray-400">(comma se alag) - {countCsv(highlights)}</span>
        </label>
        <textarea
          className={inputCls}
          rows={3}
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Corner plot,Modern elevation,Near markets and schools"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Images <span className="text-gray-400">(1 se {MAX_IMAGES}, JPG/PNG/WEBP, max 5MB each)</span>
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFiles}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
        />

        {mode === "edit" && previews.length === 0 && project && project.images.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500">
              Current images (naye select karoge to ye sab replace ho jayengi):
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="h-24 w-full rounded-lg object-cover" />
              ))}
            </div>
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="h-24 w-full rounded-lg object-cover" />
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}