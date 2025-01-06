import type { AppRoute } from '@ts-rest/core';
import { z } from 'zod';

export const ApiOperations = {
  // 'create version': 'createVersion',
  // 'delete version': 'deleteVersion',
} as const;

export type ApiOperations = (typeof ApiOperations)[keyof typeof ApiOperations];

export const appRouter = {
  // createVersion: {
  //   path: '/version',
  //   method: 'POST' as const,
  //   body: z.object({
  //     version: z.string(),
  //     codename: z.string().optional(),
  //     from: z.string(),
  //     is_stable: z.boolean().optional(),
  //     is_beta: z.boolean().optional(),
  //     is_hidden: z.boolean().optional(),
  //     is_deprecated: z.boolean().optional(),
  //   }),
  //   responses: {
  //     [201]: z.object({
  //       _id: z.string(),
  //     }),
  //     [400]: z.object({
  //       message: z.string(),
  //     }),
  //   },
  // },
  // deleteVersion: {
  //   path: '/version',
  //   method: 'DELETE' as const,
  //   pathParams: z.object({
  //     versionId: z.string(),
  //   }),
  //   responses: {
  //     [200]: z.object({
  //       _id: z.string(),
  //     }),
  //     [400]: z.object({
  //       message: z.string(),
  //     }),
  //   },
  // },
} satisfies Record<string, AppRoute>;
