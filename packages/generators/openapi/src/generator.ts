import { compile, NodeHost } from '@typespec/compiler';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

export async function generateSpecification() {
  // console.log(
  //   path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'tspconfig.yaml')
  // );

  const pathToSpec = path.resolve(process.cwd(), './contractual/spec.tsp');

  if (!fs.existsSync(pathToSpec)) {
    console.error('specification file not found', pathToSpec);
    process.exit(1);
  }

  console.log(await NodeHost.realpath(pathToSpec));

  return compile(
    {
      ...NodeHost,
      getExecutionRoot(): string {
        return `${process.cwd()}/node_modules/@typespec/compiler`;
      },
    },
    pathToSpec,
    {
      emit: ['@typespec/openapi3'],
      additionalImports: ['@typespec/openapi', '@typespec/openapi3', '@typespec/http'],
      outputDir: path.resolve(process.cwd(), './contractual/snapshots'),
      ignoreDeprecated: true,
    }
  )
    .then(() => {
      // console.log(program.diagnostics);
      console.log('Specifi/**/cation generated');
    })
    .catch((error) => {
      console.error(error);
    });
}
