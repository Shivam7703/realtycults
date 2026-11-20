// Path: app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';
import { handle } from '../../../../lib/helpers';
import { COOKIE_NAME } from '../../../../lib/auth';

export const runtime = 'nodejs';

// POST /api/admin/logout
export const POST = handle(async () => {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
});