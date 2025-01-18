import { z } from 'zod';
import type { AppRouter } from '@ts-rest/core';
import { initContract } from '@ts-rest/core';

export const baseError = z
  .object({
    error: z.string(),
    message: z.string(),
    suggestion: z.string(),
    docs: z.string(),
    help: z.string(),
    poem: z.array(z.string()),
  })
  .partial();
export const error_REGISTRY_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const error_VERSION_EMPTY = baseError.and(z.object({ error: z.string() }).partial());
export const error_APIKEY_EMPTY = baseError.and(z.object({ error: z.string() }).partial());
export const error_APIKEY_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const error_APIKEY_MISMATCH = baseError.and(z.object({ error: z.string() }).partial());
export const error_VERSION_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_FILE_EMPTY = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_INVALID = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_INVALID_SCHEMA = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_VERSION_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_TIMEOUT = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_ID_DUPLICATE = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_ID_INVALID = baseError.and(z.object({ error: z.string() }).partial());
export const error_SPEC_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const jobOpening = z
  .object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    pullquote: z.string(),
    location: z.string(),
    department: z.string(),
    url: z.string(),
  })
  .partial();
export const apply = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  job: z.enum([
    'Front End Engineer',
    'Full Stack Engineer',
    'Head of Product',
    'Head of Solutions Engineering',
    'Product Designer',
  ]),
  pronouns: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  coverLetter: z.string().optional(),
  dontReallyApply: z.boolean().optional(),
});
export const category = z
  .object({ title: z.string(), type: z.enum(['reference', 'guide']) })
  .partial();
export const createCategory_Body = category.and(z.object({ title: z.string() }));
export const error_CATEGORY_INVALID = baseError.and(z.object({ error: z.string() }).partial());
export const error_CATEGORY_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const changelog = z.object({
  title: z.string(),
  type: z.enum(['', 'added', 'fixed', 'improved', 'deprecated', 'removed']).optional(),
  body: z.string(),
  hidden: z.boolean().optional(),
});
export const customPage = z.object({
  title: z.string(),
  body: z.string().optional(),
  html: z.string().optional(),
  htmlmode: z.boolean().optional(),
  hidden: z.boolean().optional(),
});
export const error_CUSTOMPAGE_INVALID = baseError.and(z.object({ error: z.string() }).partial());
export const error_CUSTOMPAGE_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const docSchemaResponse = z
  .object({
    title: z.string(),
    type: z.enum(['basic', 'error', 'link']),
    body: z.string(),
    category: z.string(),
    hidden: z.boolean(),
    order: z.number().int(),
    parentDoc: z.string(),
    error: z.object({ code: z.string() }).partial(),
  })
  .partial()
  .passthrough();
export const error_DOC_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const docSchemaPut = z
  .object({
    title: z.string(),
    type: z.enum(['basic', 'error', 'link']),
    body: z.string(),
    category: z.string(),
    hidden: z.boolean(),
    order: z.number().int(),
    parentDoc: z.string(),
    error: z.object({ code: z.string() }).partial(),
    categorySlug: z.string(),
    parentDocSlug: z.string(),
  })
  .partial()
  .passthrough();
export const error_DOC_INVALID = baseError.and(z.object({ error: z.string() }).partial());
export const docSchemaPost = z.union([z.unknown(), z.unknown()]);
export const condensedProjectData = z
  .object({
    name: z.string(),
    subdomain: z.string(),
    jwtSecret: z.string(),
    baseUrl: z.string(),
    plan: z.string(),
  })
  .partial();
export const version = z.object({
  version: z.string(),
  codename: z.string().optional(),
  from: z.string(),
  is_stable: z.boolean().optional(),
  is_beta: z.boolean().optional(),
  is_hidden: z.boolean().optional(),
  is_deprecated: z.boolean().optional(),
});
export const error_VERSION_DUPLICATE = baseError.and(z.object({ error: z.string() }).partial());
export const error_VERSION_FORK_EMPTY = baseError.and(z.object({ error: z.string() }).partial());
export const error_VERSION_FORK_NOTFOUND = baseError.and(z.object({ error: z.string() }).partial());
export const error_VERSION_CANT_DEMOTE_STABLE = baseError.and(
  z.object({ error: z.string() }).partial()
);
export const error_VERSION_CANT_REMOVE_STABLE = baseError.and(
  z.object({ error: z.string() }).partial()
);

export const apiRouter = {
  getProject: {
    method: 'GET' as const,
    path: '/',
    description: `Returns project data for the API key.`,
    responses: {
      [200]: condensedProjectData,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
    },
  },
  getAPIRegistry: {
    method: 'GET' as const,
    path: '/api-registry/:uuid',
    description: `Get an API definition file that&#x27;s been uploaded to ReadMe.`,
    pathParams: z.object({
      uuid: z.string(),
    }),
    responses: {
      [200]: z.object({}).partial(),
      [404]: error_REGISTRY_NOTFOUND,
    },
  },
  getAPISpecification: {
    method: 'GET' as const,
    path: '/api-specification',
    description: `Get API specification metadata.`,
    query: z.object({
      perPage: z.number().int().gte(1).lte(100).optional(),
      page: z.number().int().gte(1).optional(),
    }),
    responses: {
      [200]: z.void(),
      [400]: error_VERSION_EMPTY,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_VERSION_NOTFOUND,
    },
  },
  uploadAPISpecification: {
    method: 'POST' as const,
    path: '/api-specification',
    description: `Upload an API specification to ReadMe. Or, to use a newer solution see https://docs.readme.com/main/docs/rdme.`,
    body: z.object({ spec: z.instanceof(File) }).partial(),
    responses: {
      [201]: z.void(),
      [400]: z.union([
        error_SPEC_FILE_EMPTY,
        error_SPEC_INVALID,
        error_SPEC_INVALID_SCHEMA,
        error_SPEC_VERSION_NOTFOUND,
      ]),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [408]: error_SPEC_TIMEOUT,
    },
  },
  updateAPISpecification: {
    method: 'PUT' as const,
    path: '/api-specification/:id',
    description: `Update an API specification in ReadMe.`,
    pathParams: z.object({
      id: z.string(),
    }),
    body: z.object({ spec: z.instanceof(File) }).partial(),
    responses: {
      [200]: z.void(),
      [400]: z.union([
        error_SPEC_FILE_EMPTY,
        error_SPEC_ID_DUPLICATE,
        error_SPEC_ID_INVALID,
        error_SPEC_INVALID,
        error_SPEC_INVALID_SCHEMA,
        error_SPEC_VERSION_NOTFOUND,
      ]),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: z.void(),
      [408]: error_SPEC_TIMEOUT,
    },
  },
  deleteAPISpecification: {
    method: 'DELETE' as const,
    path: '/api-specification/:id',
    description: `Delete an API specification in ReadMe.`,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      [204]: z.void(),
      [400]: error_SPEC_ID_INVALID,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_SPEC_NOTFOUND,
    },
  },
  getOpenRoles: {
    method: 'GET' as const,
    path: '/apply',
    description: `Returns all the roles we&#x27;re hiring for at ReadMe!`,
    responses: {
      [200]: z.array(jobOpening),
    },
  },
  applyToReadMe: {
    method: 'POST' as const,
    path: '/apply',
    description: `This endpoint will let you apply to a job at ReadMe programatically, without having to go through our UI!`,
    body: apply,
    responses: {
      [200]: z.void(),
    },
  },
  getCategories: {
    method: 'GET' as const,
    path: '/categories',
    description: `Returns all the categories for a specified version.`,
    query: z.object({
      perPage: z.number().int().gte(1).lte(100).optional(),
      page: z.number().int().gte(1).optional(),
    }),
    responses: {
      [200]: z.void(),
    },
  },
  createCategory: {
    method: 'POST' as const,
    path: '/categories',
    description: `Create a new category inside of this project.`,
    body: createCategory_Body,
    responses: {
      [201]: z.void(),
      [400]: error_CATEGORY_INVALID,
    },
  },
  getCategory: {
    method: 'GET' as const,
    path: '/categories/:slug',
    description: `Returns the category with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [404]: error_CATEGORY_NOTFOUND,
    },
  },
  updateCategory: {
    method: 'PUT' as const,
    path: '/categories/:slug',
    description: `Change the properties of a category.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    body: category,
    responses: {
      [200]: z.void(),
      [400]: error_CATEGORY_INVALID,
      [404]: error_CATEGORY_NOTFOUND,
    },
  },
  deleteCategory: {
    method: 'DELETE' as const,
    path: '/categories/:slug',
    description: `Delete the category with this slug.
&gt;⚠️Heads Up!
&gt; This will also delete all of the docs within this category.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [204]: z.void(),
      [404]: error_CATEGORY_NOTFOUND,
    },
  },
  getCategoryDocs: {
    method: 'GET' as const,
    path: '/categories/:slug/docs',
    description: `Returns the docs and children docs within this category.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [404]: error_CATEGORY_NOTFOUND,
    },
  },
  getChangelogs: {
    method: 'GET' as const,
    path: '/changelogs',
    description: `Returns a list of changelogs.`,
    query: z.object({
      perPage: z.number().int().gte(1).lte(100).optional(),
      page: z.number().int().gte(1).optional(),
    }),
    responses: {
      [200]: z.void(),
    },
  },
  createChangelog: {
    method: 'POST' as const,
    path: '/changelogs',
    description: `Create a new changelog entry.`,
    body: changelog,
    responses: {
      [201]: z.void(),
      [400]: z.void(),
    },
  },
  getChangelog: {
    method: 'GET' as const,
    path: '/changelogs/:slug',
    description: `Returns the changelog with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [404]: z.void(),
    },
  },
  updateChangelog: {
    method: 'PUT' as const,
    path: '/changelogs/:slug',
    description: `Update a changelog with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    body: changelog,
    responses: {
      [200]: z.void(),
      [400]: z.void(),
      [404]: z.void(),
    },
  },
  deleteChangelog: {
    method: 'DELETE' as const,
    path: '/changelogs/:slug',
    description: `Delete the changelog with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [204]: z.void(),
      [404]: z.void(),
    },
  },
  getCustomPages: {
    method: 'GET' as const,
    path: '/custompages',
    description: `Returns a list of custom pages.`,
    query: z.object({
      perPage: z.number().int().gte(1).lte(100).optional(),
      page: z.number().int().gte(1).optional(),
    }),
    responses: {
      [200]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
    },
  },
  createCustomPage: {
    method: 'POST' as const,
    path: '/custompages',
    description: `Create a new custom page inside of this project.`,
    body: customPage,
    responses: {
      [201]: z.void(),
      [400]: error_CUSTOMPAGE_INVALID,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
    },
  },
  getCustomPage: {
    method: 'GET' as const,
    path: '/custompages/:slug',
    description: `Returns the custom page with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_CUSTOMPAGE_NOTFOUND,
    },
  },
  updateCustomPage: {
    method: 'PUT' as const,
    path: '/custompages/:slug',
    description: `Update a custom page with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    body: customPage,
    responses: {
      [200]: z.void(),
      [400]: error_CUSTOMPAGE_INVALID,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_CUSTOMPAGE_NOTFOUND,
    },
  },
  deleteCustomPage: {
    method: 'DELETE' as const,
    path: '/custompages/:slug',
    description: `Delete the custom page with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [204]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_CUSTOMPAGE_NOTFOUND,
    },
  },
  createDoc: {
    method: 'POST' as const,
    path: '/docs',
    description: `Create a new doc inside of this project.`,
    body: z.union([z.unknown(), z.unknown()]),
    responses: {
      [201]: z
        .object({
          title: z.string(),
          type: z.enum(['basic', 'error', 'link']),
          body: z.string(),
          category: z.string(),
          hidden: z.boolean(),
          order: z.number().int(),
          parentDoc: z.string(),
          error: z.object({ code: z.string() }).partial(),
        })
        .partial()
        .passthrough(),
      [400]: error_DOC_INVALID,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
    },
  },
  getDoc: {
    method: 'GET' as const,
    path: '/docs/:slug',
    description: `Returns the doc with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [200]: z
        .object({
          title: z.string(),
          type: z.enum(['basic', 'error', 'link']),
          body: z.string(),
          category: z.string(),
          hidden: z.boolean(),
          order: z.number().int(),
          parentDoc: z.string(),
          error: z.object({ code: z.string() }).partial(),
        })
        .partial()
        .passthrough(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_DOC_NOTFOUND,
    },
  },
  updateDoc: {
    method: 'PUT' as const,
    path: '/docs/:slug',
    description: `Update a doc with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    body: z
      .object({
        title: z.string(),
        type: z.enum(['basic', 'error', 'link']),
        body: z.string(),
        category: z.string(),
        hidden: z.boolean(),
        order: z.number().int(),
        parentDoc: z.string(),
        error: z.object({ code: z.string() }).partial(),
        categorySlug: z.string(),
        parentDocSlug: z.string(),
      })
      .partial()
      .passthrough(),
    responses: {
      [200]: z
        .object({
          title: z.string(),
          type: z.enum(['basic', 'error', 'link']),
          body: z.string(),
          category: z.string(),
          hidden: z.boolean(),
          order: z.number().int(),
          parentDoc: z.string(),
          error: z.object({ code: z.string() }).partial(),
        })
        .partial()
        .passthrough(),
      [400]: error_DOC_INVALID,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_DOC_NOTFOUND,
    },
  },
  deleteDoc: {
    method: 'DELETE' as const,
    path: '/docs/:slug',
    description: `Delete the doc with this slug.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [204]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_DOC_NOTFOUND,
    },
  },
  getProductionDoc: {
    method: 'GET' as const,
    path: '/docs/:slug/production',
    description: `This is intended for use by enterprise users with staging enabled. This endpoint will return the live version of your document, whereas the standard endpoint will always return staging.`,
    pathParams: z.object({
      slug: z.string(),
    }),
    responses: {
      [200]: z
        .object({
          title: z.string(),
          type: z.enum(['basic', 'error', 'link']),
          body: z.string(),
          category: z.string(),
          hidden: z.boolean(),
          order: z.number().int(),
          parentDoc: z.string(),
          error: z.object({ code: z.string() }).partial(),
        })
        .partial()
        .passthrough(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_DOC_NOTFOUND,
    },
  },
  searchDocs: {
    body: z.void(),
    method: 'POST' as const,
    path: '/docs/search',
    description: `Returns all docs that match the search.`,
    query: z.object({
      search: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
    },
  },
  getAPISchema: {
    method: 'GET' as const,
    path: '/schema',
    description: `Returns a copy of our OpenAPI Definition.`,
    responses: {
      [200]: z.object({}).partial().passthrough(),
    },
  },
  getVersions: {
    method: 'GET' as const,
    path: '/version',
    description: `Retrieve a list of versions associated with a project API key.`,
    responses: {
      [200]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
    },
  },
  createVersion: {
    method: 'POST' as const,
    path: '/version',
    description: `Create a new version.`,
    body: version,
    responses: {
      [200]: z.void(),
      [400]: z.union([error_VERSION_EMPTY, error_VERSION_DUPLICATE, error_VERSION_FORK_EMPTY]),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_VERSION_FORK_NOTFOUND,
    },
  },
  getVersion: {
    method: 'GET' as const,
    path: '/version/:versionId',
    description: `Returns the version with this version ID.`,
    pathParams: z.object({
      versionId: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_VERSION_NOTFOUND,
    },
  },
  updateVersion: {
    method: 'PUT' as const,
    path: '/version/:versionId',
    description: `Update an existing version.`,
    pathParams: z.object({
      versionId: z.string(),
    }),
    body: version,
    responses: {
      [200]: z.void(),
      [400]: error_VERSION_CANT_DEMOTE_STABLE,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_VERSION_NOTFOUND,
    },
  },
  deleteVersion: {
    method: 'DELETE' as const,
    path: '/version/:versionId',
    description: `Delete a version`,
    pathParams: z.object({
      versionId: z.string(),
    }),
    responses: {
      [200]: z.void(),
      [400]: error_VERSION_CANT_REMOVE_STABLE,
      [401]: z.union([error_APIKEY_EMPTY, error_APIKEY_NOTFOUND]),
      [403]: error_APIKEY_MISMATCH,
      [404]: error_VERSION_NOTFOUND,
    },
  },
} satisfies AppRouter;

export const ApiOperations = {
  'get project': 'getProject',
  'get api registry': 'getAPIRegistry',
  'get api specification': 'getAPISpecification',
  'upload api specification': 'uploadAPISpecification',
  'update api specification': 'updateAPISpecification',
  'delete api specification': 'deleteAPISpecification',
  'get open roles': 'getOpenRoles',
  'apply to read me': 'applyToReadMe',
  'get categories': 'getCategories',
  'create category': 'createCategory',
  'get category': 'getCategory',
  'update category': 'updateCategory',
  'delete category': 'deleteCategory',
  'get category docs': 'getCategoryDocs',
  'get changelogs': 'getChangelogs',
  'create changelog': 'createChangelog',
  'get changelog': 'getChangelog',
  'update changelog': 'updateChangelog',
  'delete changelog': 'deleteChangelog',
  'get custom pages': 'getCustomPages',
  'create custom page': 'createCustomPage',
  'get custom page': 'getCustomPage',
  'update custom page': 'updateCustomPage',
  'delete custom page': 'deleteCustomPage',
  'create doc': 'createDoc',
  'get doc': 'getDoc',
  'update doc': 'updateDoc',
  'delete doc': 'deleteDoc',
  'get production doc': 'getProductionDoc',
  'search docs': 'searchDocs',
  'get api schema': 'getAPISchema',
  'get versions': 'getVersions',
  'create version': 'createVersion',
  'get version': 'getVersion',
  'update version': 'updateVersion',
  'delete version': 'deleteVersion',
} satisfies Record<string, keyof typeof apiRouter>;

export const contract = initContract().router(apiRouter);
