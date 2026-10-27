import { NextRequest, NextResponse } from 'next/server';
import { getAllRecords, createRecord } from '@/lib/cloudant';
import { getSession } from '@/lib/session';
import { SecurityRecord } from '@/lib/types';

// Security Input Sanitizer to guard against injection & malformed data
function sanitizeString(str?: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>?/gm, ''); // strip potential html/script tags
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q')?.toLowerCase() || '';
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let records = await getAllRecords();

    if (q) {
      records = records.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q)) ||
          r.affectedSystems?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (severity && severity !== 'ALL') {
      records = records.filter((r) => r.severity === severity);
    }

    if (type && type !== 'ALL') {
      records = records.filter((r) => r.type === type);
    }

    if (status && status !== 'ALL') {
      records = records.filter((r) => r.status === status);
    }

    return NextResponse.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    console.error('Failed to retrieve records:', err);
    return NextResponse.json(
      { success: false, error: 'Database query failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in via IBM App ID or select a Demo Role.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. Validate and Sanitize Inputs
    const title = sanitizeString(body.title);
    const description = sanitizeString(body.description);
    const remediationPlan = sanitizeString(body.remediationPlan);
    const type = body.type === 'compliance_document' ? 'compliance_document' : 'security_incident';
    const severity = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(body.severity)
      ? body.severity
      : 'MEDIUM';
    const classification = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'].includes(
      body.classification
    )
      ? body.classification
      : 'INTERNAL';
    const status = ['OPEN', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'CLOSED'].includes(body.status)
      ? body.status
      : 'OPEN';

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required fields.' },
        { status: 400 }
      );
    }

    const affectedSystems = Array.isArray(body.affectedSystems)
      ? body.affectedSystems.map(sanitizeString).filter(Boolean)
      : typeof body.affectedSystems === 'string'
      ? body.affectedSystems.split(',').map(sanitizeString).filter(Boolean)
      : [];

    const tags = Array.isArray(body.tags)
      ? body.tags.map(sanitizeString).filter(Boolean)
      : typeof body.tags === 'string'
      ? body.tags.split(',').map(sanitizeString).filter(Boolean)
      : [];

    // 3. Create Record in IBM Cloudant
    const newRecord = await createRecord({
      type,
      title,
      description,
      severity,
      classification,
      status,
      affectedSystems,
      tags,
      reportedBy: {
        name: session.name,
        email: session.email,
        role: session.role,
      },
      remediationPlan,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Security record stored successfully in Cloudant',
        record: newRecord,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Record creation error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create record in database' },
      { status: 500 }
    );
  }
}
