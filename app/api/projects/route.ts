// PATH: app/api/projects/route.ts
import { NextResponse } from 'next/server';
import type { ResultSetHeader } from 'mysql2';
import { pool } from '../../../lib/db';
import {
  handle, requireAuth, HttpError, formatProject, getImageFiles, saveImages,
  deleteImages, toCsv, validateLabelsValues, MAX_IMAGES, type ProjectRow,
} from '../../../lib/helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/projects -> list
export const GET = handle(async () => {
  const [rows] = await pool.query<ProjectRow[]>('SELECT * FROM projects ORDER BY id DESC');
  return NextResponse.json({ data: rows.map(formatProject) });
});

// POST /api/projects (multipart/form-data) -> create
export const POST = handle(async (req) => {
  requireAuth(req);
  const fd = await req.formData();

  const title = String(fd.get('title') ?? '').trim();
  const labels = String(fd.get('labels') ?? '');
  const values = String(fd.get('values') ?? '');
  const description = String(fd.get('description') ?? '').trim();
  const highlights = String(fd.get('highlights') ?? '');
  const files = getImageFiles(fd);

  if (!title) throw new HttpError(422, 'title required');
  validateLabelsValues(labels, values);
  if (files.length < 1 || files.length > MAX_IMAGES) {
    throw new HttpError(422, `1 se ${MAX_IMAGES} images upload karein`);
  }

  const names = await saveImages(files);
  try {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO projects (title, labels, label_values, description, highlights, images)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, toCsv(labels), toCsv(values), description, toCsv(highlights), names.join(',')]
    );
    const [rows] = await pool.execute<ProjectRow[]>('SELECT * FROM projects WHERE id = ?', [res.insertId]);
    return NextResponse.json({ data: formatProject(rows[0]) }, { status: 201 });
  } catch (e) {
    await deleteImages(names); // DB fail hua to uploaded images hata do
    throw e;
  }
});