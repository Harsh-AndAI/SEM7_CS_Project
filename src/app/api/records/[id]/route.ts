import { NextRequest, NextResponse } from 'next/server';
import { getRecordById, updateRecord, deleteRecord } from '@/lib/cloudant';
import { getSession } from '@/lib/session';

function sanitizeString(str?: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>?/gm, '');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await getRecordById(id);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, record });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to update records' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = {};
    if (body.title) updates.title = sanitizeString(body.title);
    if (body.description) updates.description = sanitizeString(body.description);
    if (body.remediationPlan !== undefined) updates.remediationPlan = sanitizeString(body.remediationPlan);
    if (body.severity) updates.severity = body.severity;
    if (body.classification) updates.classification = body.classification;
    if (body.status) updates.status = body.status;
    if (body.affectedSystems) {
      updates.affectedSystems = Array.isArray(body.affectedSystems)
        ? body.affectedSystems.map(sanitizeString)
        : body.affectedSystems.split(',').map(sanitizeString);
    }
    if (body.tags) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags.map(sanitizeString)
        : body.tags.split(',').map(sanitizeString);
    }

    const updated = await updateRecord(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Record update failed or record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Record updated successfully in IBM Cloudant',
      record: updated,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to delete records' },
        { status: 401 }
      );
    }

    // Role-based security check: Only admin or security_analyst can delete
    if (session.role === 'compliance_auditor') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Compliance Auditors have read-only access and cannot delete audit records.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deleted = await deleteRecord(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Record not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Record ${id} permanently removed from database`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
