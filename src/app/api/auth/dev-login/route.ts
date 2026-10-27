import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/appid';
import { setSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = (body.role || 'admin') as string;

    const user = DEMO_USERS[role] || DEMO_USERS.admin;
    await setSessionCookie(user);

    return NextResponse.json({
      success: true,
      user,
      message: `Signed in as ${user.name} (${user.role}) via simulation mode`,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
