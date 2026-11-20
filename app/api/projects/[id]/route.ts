// PATH: app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import type { IdRouteCtx } from '../../../../types/project';
import {
  handle, requireAuth, HttpError, formatProject, getImageFiles, saveImages,
  deleteImages, toCsv, csv, validateLabelsValues, type ProjectRow,
} from '../../../../lib/helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = IdRouteCtx;

async function findProject(id: string): Promise<ProjectRow> {
  const [rows] = await pool.execute<ProjectRow[]>('SELECT * FROM projects WHERE id = ?', [id]);
  if (!rows.length) throw new HttpError(404, 'Project not found');
  return rows[0];
}

// GET /api/projects/:id
export const GET = handle<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  return NextResponse.json({ data: formatProject(await findProject(id)) });
});

// PUT /api/projects/:id (multipart/form-data)
// Sirf bheje gaye fields update honge. Images bheji to purani sab replace.
export const PUT = handle<Ctx>(async (req, { params }) => {
  requireAuth(req);
  const { id } = await params;
  const old = await findProject(id);
  const fd = await req.formData();

  const title = fd.has('title') ? String(fd.get('title')).trim() : old.title;
  const labels = fd.has('labels') ? toCsv(fd.get('labels')) : old.labels;
  const values = fd.has('values') ? toCsv(fd.get('values')) : old.label_values;
  const description = fd.has('description') ? String(fd.get('description')).trim() : old.description;
  const highlights = fd.has('highlights') ? toCsv(fd.get('highlights')) : old.highlights;

  if (!title) throw new HttpError(422, 'title khali nahi ho sakta');
  validateLabelsValues(labels, values);

  const files = getImageFiles(fd);
  let images = old.images;
  let newNames: string[] = [];
  if (files.length) {
    newNames = await saveImages(files);
    images = newNames.join(',');
  }

  try {
    await pool.execute(
      `UPDATE projects SET title=?, labels=?, label_values=?, description=?, highlights=?, images=? WHERE id=?`,
      [title, labels, values, description, highlights, images, id]
    );
  } catch (e) {
    await deleteImages(newNames);
    throw e;
  }
  if (newNames.length) await deleteImages(csv(old.images));

  return NextResponse.json({ data: formatProject(await findProject(id)) });
});

// DELETE /api/projects/:id
export const DELETE = handle<Ctx>(async (req, { params }) => {
  requireAuth(req);
  const { id } = await params;
  const old = await findProject(id);
  await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
  await deleteImages(csv(old.images));
  return NextResponse.json({ message: 'Deleted' });
});