// Path: lib/projects.ts
// Server components isko seedha use karte hain (API call ki zaroorat nahi)
import { pool } from './db';
import { formatProject, type ProjectRow, type ProjectDTO } from './helpers';

export async function getProjects(): Promise<ProjectDTO[]> {
  const [rows] = await pool.query<ProjectRow[]>('SELECT * FROM projects ORDER BY id DESC');
  return rows.map(formatProject);
}

export async function getProject(id: string): Promise<ProjectDTO | null> {
  if (!/^\d+$/.test(id)) return null;
  const [rows] = await pool.execute<ProjectRow[]>('SELECT * FROM projects WHERE id = ?', [id]);
  return rows.length ? formatProject(rows[0]) : null;
}