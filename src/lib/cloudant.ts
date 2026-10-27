import { CloudantV1 } from '@ibm-cloud/cloudant';
import { IamAuthenticator, BasicAuthenticator } from 'ibm-cloud-sdk-core';
import dns from 'node:dns';
import { SecurityRecord } from './types';
import { MockDatabase } from './mock-db';

// Use natural resolver ordering (verbatim) to allow proper NAT64/IPv6 routing on mobile/broadband
try {
  dns.setDefaultResultOrder('verbatim');
} catch {
  // Ignored
}

let cloudantClient: CloudantV1 | null = null;
let isDbEnsured = false;
const DB_NAME = process.env.IBM_CLOUDANT_DATABASE || 'cloud_vault_records';

// Automatic retry helper with exponential backoff for mobile/NAT64 network resilience
async function withRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastErr = err;
      console.warn(`[Cloudant] Attempt ${attempt}/${retries} failed: ${(err as Error).message}. Retrying...`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 600));
      }
    }
  }
  throw lastErr;
}

export function isCloudantConfigured(): boolean {
  return !!(
    (process.env.IBM_CLOUDANT_APIKEY || (process.env.IBM_CLOUDANT_USERNAME && process.env.IBM_CLOUDANT_PASSWORD)) &&
    process.env.IBM_CLOUDANT_URL
  );
}

export function getCloudantClient(): CloudantV1 | null {
  if (!isCloudantConfigured()) return null;

  if (!cloudantClient) {
    try {
      let authenticator;
      if (process.env.IBM_CLOUDANT_USERNAME && process.env.IBM_CLOUDANT_PASSWORD) {
        authenticator = new BasicAuthenticator({
          username: process.env.IBM_CLOUDANT_USERNAME,
          password: process.env.IBM_CLOUDANT_PASSWORD,
        });
      } else {
        authenticator = new IamAuthenticator({
          apikey: process.env.IBM_CLOUDANT_APIKEY!,
        });
      }

      cloudantClient = CloudantV1.newInstance({
        authenticator,
        serviceUrl: process.env.IBM_CLOUDANT_URL!,
      });
    } catch (err) {
      console.error('Failed to initialize IBM Cloudant client:', err);
      return null;
    }
  }

  return cloudantClient;
}

export async function ensureDatabase(): Promise<boolean> {
  if (isDbEnsured) return true;

  const client = getCloudantClient();
  if (!client) return false;

  try {
    await withRetry(async () => {
      try {
        await client.getDatabaseInformation({ db: DB_NAME });
      } catch (err: unknown) {
        const error = err as { status?: number };
        if (error.status === 404) {
          await client.putDatabase({ db: DB_NAME });
          console.log(`IBM Cloudant: Database '${DB_NAME}' created.`);
        } else {
          throw err;
        }
      }
    });

    isDbEnsured = true;
    return true;
  } catch (err) {
    console.error(`IBM Cloudant: ensureDatabase error:`, err);
    return false;
  }
}

export async function getAllRecords(): Promise<SecurityRecord[]> {
  const client = getCloudantClient();
  if (!client) {
    return MockDatabase.getAll();
  }

  try {
    await ensureDatabase();

    const response = await withRetry(async () => {
      return await client.postAllDocs({
        db: DB_NAME,
        includeDocs: true,
      });
    });

    const docs: SecurityRecord[] = [];
    if (response.result.rows) {
      for (const row of response.result.rows) {
        if (row.id && row.doc && !row.id.startsWith('_design/')) {
          const doc = row.doc as unknown as SecurityRecord;
          docs.push({
            ...doc,
            id: row.id,
            _id: row.id,
            _rev: row.value?.rev,
          });
        }
      }
    }
    return docs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error('Error fetching docs from IBM Cloudant, falling back to mock:', err);
    return MockDatabase.getAll();
  }
}

export async function getRecordById(id: string): Promise<SecurityRecord | null> {
  const client = getCloudantClient();
  if (!client) {
    return MockDatabase.getById(id);
  }

  try {
    const response = await withRetry(async () => {
      return await client.getDocument({
        db: DB_NAME,
        docId: id,
      });
    });
    return response.result as unknown as SecurityRecord;
  } catch (err: unknown) {
    const error = err as { status?: number };
    if (error.status === 404) return null;
    return MockDatabase.getById(id);
  }
}

export async function createRecord(
  data: Omit<SecurityRecord, '_id' | '_rev' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<SecurityRecord> {
  const client = getCloudantClient();
  if (!client) {
    return MockDatabase.create(data);
  }

  try {
    await ensureDatabase();
    const now = new Date().toISOString();
    const docToCreate = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const response = await withRetry(async () => {
      return await client.postDocument({
        db: DB_NAME,
        document: docToCreate,
      });
    });

    console.log(`[Cloudant] Successfully saved record: ${response.result.id} (rev: ${response.result.rev})`);

    return {
      ...docToCreate,
      _id: response.result.id,
      id: response.result.id,
      _rev: response.result.rev,
    };
  } catch (err) {
    console.error('Error writing to IBM Cloudant:', err);
    if (process.env.DEMO_MODE === 'true') {
      return MockDatabase.create(data);
    }
    throw new Error(`Failed to save record in IBM Cloudant: ${(err as Error).message}`);
  }
}

export async function updateRecord(
  id: string,
  updates: Partial<SecurityRecord>
): Promise<SecurityRecord | null> {
  const client = getCloudantClient();
  if (!client) {
    return MockDatabase.update(id, updates);
  }

  try {
    return await withRetry(async () => {
      const existing = await client.getDocument({
        db: DB_NAME,
        docId: id,
      });

      const currentDoc = existing.result as Record<string, unknown>;
      const rev = typeof currentDoc._rev === 'string' ? currentDoc._rev : undefined;
      const mergedDoc: CloudantV1.Document = {
        ...currentDoc,
        ...updates,
        _id: id,
        _rev: rev,
        updatedAt: new Date().toISOString(),
      };

      const response = await client.postDocument({
        db: DB_NAME,
        document: mergedDoc,
      });

      return {
        ...(mergedDoc as unknown as SecurityRecord),
        _rev: response.result.rev,
      };
    });
  } catch (err) {
    console.error('Error updating in IBM Cloudant:', err);
    if (process.env.DEMO_MODE === 'true') {
      return MockDatabase.update(id, updates);
    }
    throw new Error(`Failed to update record in IBM Cloudant: ${(err as Error).message}`);
  }
}

export async function deleteRecord(id: string): Promise<boolean> {
  const client = getCloudantClient();
  if (!client) {
    return MockDatabase.delete(id);
  }

  try {
    return await withRetry(async () => {
      const existing = await client.getDocument({
        db: DB_NAME,
        docId: id,
      });

      const rev = existing.result._rev;
      if (!rev) return false;

      await client.deleteDocument({
        db: DB_NAME,
        docId: id,
        rev,
      });
      return true;
    });
  } catch (err) {
    console.error('Error deleting from IBM Cloudant:', err);
    if (process.env.DEMO_MODE === 'true') {
      return MockDatabase.delete(id);
    }
    throw new Error(`Failed to delete record in IBM Cloudant: ${(err as Error).message}`);
  }
}
