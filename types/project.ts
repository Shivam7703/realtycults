// PATH: types/project.ts
import type { RowDataPacket } from 'mysql2';

/** MySQL `projects` table ki ek row */
export interface ProjectRow extends RowDataPacket {
  id: number;
  title: string;
  labels: string;        // "Area,Plot Type,Category,Created By"
  label_values: string;  // "233 Yards,Corner / North East,Ongoing,CITYSPACE"
  description: string | null;
  highlights: string | null; // "Corner plot,Modern elevation"
  images: string;        // "a.jpg,b.jpg,c.jpg"
  created_at: Date;
  updated_at: Date;
}

/** API response me ek label + value */
export interface ProjectDetail {
  label: string;
  value: string;
}

/** API response me ek project */
export interface ProjectDTO {
  id: number;
  title: string;
  details: ProjectDetail[];
  description: string | null;
  highlights: string[];
  images: string[]; // full URLs
  raw: { labels: string; values: string; highlights: string | null };
  created_at: Date;
  updated_at: Date;
}

/** [id] route ka context */
export interface IdRouteCtx {
  params: Promise<{ id: string }>;
}

export interface ApiError {
  error: string;
}