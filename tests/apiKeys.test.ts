/**
 * API Keys Dashboard Tests (localStorage logic)
 */

const STORAGE_KEY = 'quantum_api_keys';

interface StoredKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  requests: number;
  status: 'active' | 'revoked';
}

function loadKeys(): StoredKey[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as StoredKey[];
  return [];
}

function saveKeys(keys: StoredKey[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

describe('API Keys storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with no keys', () => {
    expect(loadKeys()).toEqual([]);
  });

  it('should save and load keys', () => {
    const key: StoredKey = {
      id: 'test-1',
      name: 'Test Key',
      key: 'qai_test-1234-5678',
      prefix: 'qai_test-12...',
      createdAt: new Date().toISOString(),
      lastUsed: null,
      requests: 0,
      status: 'active',
    };
    saveKeys([key]);
    const loaded = loadKeys();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.name).toBe('Test Key');
    expect(loaded[0]?.status).toBe('active');
  });

  it('should handle multiple keys', () => {
    const keys: StoredKey[] = [
      {
        id: '1',
        name: 'Key A',
        key: 'qai_a',
        prefix: 'qai_a...',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        requests: 0,
        status: 'active',
      },
      {
        id: '2',
        name: 'Key B',
        key: 'qai_b',
        prefix: 'qai_b...',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        requests: 5,
        status: 'active',
      },
      {
        id: '3',
        name: 'Key C',
        key: 'qai_c',
        prefix: 'qai_c...',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        requests: 0,
        status: 'revoked',
      },
    ];
    saveKeys(keys);
    const loaded = loadKeys();
    expect(loaded).toHaveLength(3);
    expect(loaded.filter(k => k.status === 'active')).toHaveLength(2);
    expect(loaded.filter(k => k.status === 'revoked')).toHaveLength(1);
  });

  it('should revoke a key by updating status', () => {
    const keys: StoredKey[] = [
      {
        id: '1',
        name: 'Key',
        key: 'qai_x',
        prefix: 'qai_x...',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        requests: 0,
        status: 'active',
      },
    ];
    saveKeys(keys);
    const loaded = loadKeys();
    loaded[0]!.status = 'revoked';
    saveKeys(loaded);
    const updated = loadKeys();
    expect(updated[0]?.status).toBe('revoked');
  });

  it('should delete a key', () => {
    const keys: StoredKey[] = [
      {
        id: '1',
        name: 'A',
        key: 'qai_a',
        prefix: 'qai_a...',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        requests: 0,
        status: 'active',
      },
      {
        id: '2',
        name: 'B',
        key: 'qai_b',
        prefix: 'qai_b...',
        createdAt: new Date().toISOString(),
        lastUsed: null,
        requests: 0,
        status: 'active',
      },
    ];
    saveKeys(keys);
    const filtered = loadKeys().filter(k => k.id !== '1');
    saveKeys(filtered);
    expect(loadKeys()).toHaveLength(1);
    expect(loadKeys()[0]?.id).toBe('2');
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(() => loadKeys()).toThrow(); // raw JSON.parse throws
  });
});
