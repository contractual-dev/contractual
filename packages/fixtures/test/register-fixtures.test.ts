import type { RegisterFixturesReturnType } from '../src';
import { registerFixtures } from '../src';

describe('Register Fixtures Unit Spec', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let result: RegisterFixturesReturnType<'create version'>;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    result = registerFixtures('create version', {
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
  });

  it('should return the correct snapshot', () => {
    expect(result).toMatchSnapshot();
  });
});
