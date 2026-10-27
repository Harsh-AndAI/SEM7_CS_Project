import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';
import { getAppOrigin } from '@/lib/appid';

export async function GET(request: NextRequest) {
  await clearSessionCookie();
  const origin = getAppOrigin(request);
  return NextResponse.redirect(`${origin}/?logged_out=true`);
}

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
