import { UserSession } from './types';

export function isAppIdConfigured(): boolean {
  return !!(
    process.env.IBM_APPID_CLIENT_ID &&
    process.env.IBM_APPID_SECRET &&
    process.env.IBM_APPID_OAUTH_SERVER_URL
  );
}

export function getAppOrigin(request?: {
  headers?: { get: (name: string) => string | null };
  nextUrl?: { origin?: string };
}): string {
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  if (request?.headers) {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      const proto = request.headers.get('x-forwarded-proto') || 'https';
      return `${proto}://${host}`;
    }
  }

  return request?.nextUrl?.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function getAppIdAuthUrl(redirectUri: string, state: string = 'secure-random-state'): string {
  const oauthServerUrl = process.env.IBM_APPID_OAUTH_SERVER_URL?.replace(/\/$/, '');
  const clientId = process.env.IBM_APPID_CLIENT_ID;

  if (!oauthServerUrl || !clientId) {
    throw new Error('IBM App ID configuration is missing');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    state,
  });

  return `${oauthServerUrl}/authorization?${params.toString()}`;
}

export async function exchangeAppIdCode(code: string, redirectUri: string) {
  const oauthServerUrl = process.env.IBM_APPID_OAUTH_SERVER_URL?.replace(/\/$/, '');
  const clientId = process.env.IBM_APPID_CLIENT_ID;
  const clientSecret = process.env.IBM_APPID_SECRET;

  if (!oauthServerUrl || !clientId || !clientSecret) {
    throw new Error('IBM App ID credentials incomplete');
  }

  const tokenEndpoint = `${oauthServerUrl}/token`;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IBM App ID Token exchange failed: ${response.status} ${errorText}`);
  }

  const tokenData = await response.json();
  return tokenData;
}

export async function fetchAppIdUserInfo(accessToken: string): Promise<Partial<UserSession>> {
  const oauthServerUrl = process.env.IBM_APPID_OAUTH_SERVER_URL?.replace(/\/$/, '');
  const userInfoUrl = `${oauthServerUrl}/userinfo`;

  try {
    const response = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return {};
    }

    const info = await response.json();
    return {
      id: info.sub || info.id,
      name: info.name || info.given_name || info.email || 'IBM App ID User',
      email: info.email || 'user@appid.cloud.ibm.com',
      role: 'security_analyst',
    };
  } catch (err) {
    console.error('Failed to fetch App ID user info:', err);
    return {};
  }
}

// Pre-configured simulation roles for demo/testing without credentials
export const DEMO_USERS: Record<string, UserSession> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Security Admin (CISO)',
    email: 'admin.ciso@cloudvault.ibm.internal',
    role: 'admin',
    provider: 'local-simulation',
  },
  analyst: {
    id: 'usr-analyst-02',
    name: 'Senior SOC Analyst',
    email: 'analyst.soc@cloudvault.ibm.internal',
    role: 'security_analyst',
    provider: 'local-simulation',
  },
  auditor: {
    id: 'usr-auditor-03',
    name: 'Compliance Auditor',
    email: 'auditor.gdpr@cloudvault.ibm.internal',
    role: 'compliance_auditor',
    provider: 'local-simulation',
  },
};
