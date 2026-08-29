import test from 'node:test';
import assert from 'node:assert/strict';

import { getRequiredRuntimeValue } from './runtime-config';

test('returns a configured runtime value', () => {
  process.env.DATABASE_URL = 'postgresql://example.test/db';
  assert.equal(getRequiredRuntimeValue('DATABASE_URL'), 'postgresql://example.test/db');
});

test('throws a clear error when required runtime configuration is missing', () => {
  delete process.env.DATABASE_URL;

  assert.throws(
    () => getRequiredRuntimeValue('DATABASE_URL'),
    /DATABASE_URL is not configured in the live environment/i,
  );
});
