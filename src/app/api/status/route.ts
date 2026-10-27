import { NextResponse } from 'next/server';
import { isCloudantConfigured, getCloudantClient } from '@/lib/cloudant';
import { isAppIdConfigured } from '@/lib/appid';

export async function GET() {
  const isCloudantSet = isCloudantConfigured();
  const isAppIdSet = isAppIdConfigured();

  let cloudantStatus: 'connected' | 'demo_mode' | 'error' = 'demo_mode';
  let cloudantDetails = 'Running in Local Simulated Cloudant DB (Set IBM_CLOUDANT_APIKEY & IBM_CLOUDANT_URL in .env.local or k8s secrets to sync with live IBM Cloud)';
  let latencyMs: number | undefined;

  if (isCloudantSet) {
    const startTime = Date.now();
    try {
      const client = getCloudantClient();
      if (client) {
        await client.getServerInformation();
        cloudantStatus = 'connected';
        latencyMs = Date.now() - startTime;
        cloudantDetails = `Connected to IBM Cloudant live cluster (${latencyMs}ms latency)`;
      }
    } catch (err) {
      cloudantStatus = 'error';
      cloudantDetails = `Connection failed: ${(err as Error).message}`;
    }
  }

  const appidStatus = isAppIdSet ? 'configured' : 'demo_mode';
  const appidDetails = isAppIdSet
    ? `Configured with IBM Cloud App ID Tenant: ${process.env.IBM_APPID_TENANT_ID || 'Active'}`
    : 'Running with Local Role Simulation (Set IBM_APPID_CLIENT_ID & IBM_APPID_SECRET to activate live IBM OIDC)';

  return NextResponse.json({
    cloudant: {
      status: cloudantStatus,
      database: process.env.IBM_CLOUDANT_DATABASE || 'cloud_vault_records',
      details: cloudantDetails,
      latencyMs,
      endpoint: process.env.IBM_CLOUDANT_URL ? new URL(process.env.IBM_CLOUDANT_URL).hostname : 'local-in-memory',
    },
    appid: {
      status: appidStatus,
      tenantId: process.env.IBM_APPID_TENANT_ID || 'demo-tenant-id',
      oauthUrl: process.env.IBM_APPID_OAUTH_SERVER_URL || 'demo-oauth-server',
      details: appidDetails,
    },
    cluster: {
      environment: process.env.KUBERNETES_SERVICE_HOST ? 'minikube' : 'docker-local',
      podName: process.env.HOSTNAME || 'dev-runner',
      namespace: process.env.K8S_NAMESPACE || 'cloud-vault',
    },
  });
}
