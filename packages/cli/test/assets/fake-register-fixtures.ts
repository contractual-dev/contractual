import { registerFixtures } from '@contractual/fixtures';

export default registerFixtures('create version', {
  'basic version': () => ({
    body: {
      version: 'string',
      codename: 'string',
      from: 'string',
      is_stable: true,
      is_beta: true,
      is_hidden: true,
      is_deprecated: true,
    },
  }),
  'rc version': ({ extend }) => {
    return extend({
      'with something else': () => ({
        body: {
          version: 'string',
          from: 'string',
        },
      }),
    });
  },
});
