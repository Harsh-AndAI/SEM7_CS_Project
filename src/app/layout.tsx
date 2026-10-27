import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CloudSecure Vault | IBM Cloudant & App ID Incident Hub',
  description:
    'Enterprise Cloud Security & Compliance Management System deployed on Kubernetes (Minikube) with IBM App ID OIDC authentication, IBM Cloudant NoSQL storage, and Zero-Trust Network Policies.',
  keywords: ['IBM App ID', 'IBM Cloudant', 'Kubernetes', 'Minikube', 'Next.js', 'Cloud Security'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
