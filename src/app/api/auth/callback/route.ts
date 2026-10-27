import { NextRequest, NextResponse } from 'next/server';
import { exchangeAppIdCode, fetchAppIdUserInfo, getAppOrigin } from '@/lib/appid';
import { setSessionCookie } from '@/lib/session';
import { UserSession } from '@/lib/types';

export async function GET(request: NextRequest) {
  const origin = getAppOrigin(request);
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    console.error('App ID callback error:', error || 'No authorization code received');
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error || 'missing_code')}`);
  }

  try {
    const redirectUri = `${origin}/api/auth/callback`;
    const tokens = await exchangeAppIdCode(code, redirectUri);
    const userInfo = await fetchAppIdUserInfo(tokens.access_token);

    const userSession: UserSession = {
      id: userInfo.id || 'ibm-user-' + Math.random().toString(36).substring(2, 8),
      name: userInfo.name || 'IBM Cloud Authenticated User',
      email: userInfo.email || 'user@appid.cloud.ibm.com',
      role: 'security_analyst',
      provider: 'ibm-appid',
      accessToken: tokens.access_token,
    };

    await setSessionCookie(userSession);
    return NextResponse.redirect(`${origin}/?auth_success=true`);
  } catch (err) {
    console.error('Failed to process IBM App ID callback:', err);
    return NextResponse.redirect(`${origin}/?error=auth_exchange_failed`);
  }
}
