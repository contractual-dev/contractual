import { diffSchemas } from 'json-schema-diff';

export type schema = { [key: string]: any };

export function createJSONSchemaDiffer() {
  const api = {
    diff(sourceSchema: any, destinationSchema: any) {
      console.log('hello world')
      try {
        return diffSchemas({
          sourceSchema,
          destinationSchema,
        });
      } catch (e) {
        console.error('error found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      }
    },
  };

  return api;
}
