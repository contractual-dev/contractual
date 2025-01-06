import { test } from '@contractual/test';
import { expect } from '@playwright/test';

// let createdVersionId: string;

test('create version', async ({ operation }) => {
  await operation('basic version 1.2.0 from 1.0.0', async ({ response }) => {
    expect(response.status).toBe(400);
  });
});

// test('create version', async ({ operation }) => {
//   const response = await operation('rc version with something else');
//
//   expect(response.status).toBe(400);
//   // expect(response.body._id).toBeDefined();
//
//   // createdVersionId = response.body._id;
// });

// test('delete version', async ({ operation }) => {
//   const response = await operation(() => ({
//     params: { versionId: createdVersionId },
//   }));
//
//   expect(response.body._id).toBeDefined();
// });
