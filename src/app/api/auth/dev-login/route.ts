import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/appid';
import { signSessionToken, getCookieOptions, COOKIE_NAME } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = (body.role || 'admin') as string;

    const user = DEMO_USERS[role] || DEMO_USERS.admin;
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.nextUrl.protocol === 'https:';
    const token = await signSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      message: `Signed in as ${user.name} (${user.role}) via simulation mode`,
    });
    response.cookies.set(COOKIE_NAME, token, getCookieOptions(isHttps));
    return response;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
