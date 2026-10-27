import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    k8s: {
      podName: process.env.HOSTNAME || 'local-workstation',
      nodeName: process.env.K8S_NODE_NAME || 'minikube-node',
      namespace: process.env.K8S_NAMESPACE || 'cloud-vault',
    },
  });
}
