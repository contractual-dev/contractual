import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { createJSONSchemaDiffer } from './index';

const source = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "The user identifier"
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "status": {
      "type": "string",
      "enum": ["active", "inactive"]
    }
  },
  "required": ["id", "username", "email"],
  "additionalProperties": false
}`;

const destination = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "The user identifier",
      "minimum": 1
    },
    "username": {
      "type": "string",
      "minLength": 3,
      "maxLength": 30
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "status": {
      "type": "string",
      "enum": ["active", "inactive", "suspended"]
    }
  },
  "required": ["id", "username", "email", "status"],
  "additionalProperties": false
}`;

describe('diff schema', function () {
  let dirPath = '';
  let sourcePath = '';
  let destinationPath = '';

  beforeAll(async function () {
    dirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'temp-'));
    sourcePath = path.join(dirPath, 'source.json');
    destinationPath = path.join(dirPath, 'destination.json');

    fs.writeFile(sourcePath, JSON.stringify(source, null, 4));
    fs.writeFile(destinationPath, JSON.stringify(destination, null, 4));
  });

  afterAll(async function () {
    await fs.rm(dirPath, { recursive: true, force: true });
  });

  it('should detect diff', async function () {
    const differ = createJSONSchemaDiffer();
    const res = await differ.diff(source, destination);
    console.log('res is', res!.removalsFound);
  });
});
