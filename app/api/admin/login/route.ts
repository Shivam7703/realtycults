// Path: app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { handle, HttpError } from '../../../../lib/helpers';
import { checkKey, createSessionToken, COOKIE_NAME, SESSION_SECONDS } from '../../../../lib/auth';

export const runtime = 'nodejs';

// POST /api/admin/login  body: { key: string }
export const POST = handle(async (req) => {
  const body = (await req.json().catch(() => null)) as { key?: unknown } | null;
  if (!checkKey(body?.key)) throw new HttpError(401, 'Galat secret key');

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
  return res;
});