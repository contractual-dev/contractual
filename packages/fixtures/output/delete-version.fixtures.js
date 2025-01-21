import { registerFixtures } from '@contractual/fixtures';
export default registerFixtures('delete version', {
    'basic delete': () => ({
        params: {
            versionId: 'string',
        }
    }),
    'complex': () => ({
        params: {
            versionId: 'string',
        }
    }),
});
