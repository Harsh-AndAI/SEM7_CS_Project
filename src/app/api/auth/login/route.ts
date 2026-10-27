import { NextRequest, NextResponse } from 'next/server';
import { getAppIdAuthUrl, isAppIdConfigured, getAppOrigin } from '@/lib/appid';

export async function GET(request: NextRequest) {
  const origin = getAppOrigin(request);
  const redirectUri = `${origin}/api/auth/callback`;

  if (!isAppIdConfigured()) {
    // If IBM App ID is not yet configured, redirect back with a status query param
    return NextResponse.redirect(`${origin}/?error=appid_not_configured`);
  }

  try {
    const authUrl = getAppIdAuthUrl(redirectUri);
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error('Error initiating IBM App ID login:', err);
    return NextResponse.redirect(`${origin}/?error=login_failed`);
  }
}
