import { transformSync } from '@babel/core';
import type { RegisterFixturesReturnType } from '@contractual/fixtures';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createProgram, parseJsonConfigFileContent, readConfigFile, sys } from 'typescript';

export interface GenerateFixturesOptions {
  path: string;
  output?: string;
}

export async function generateFixtures({ output, path: fixturesPath }: GenerateFixturesOptions) {
  const resolvedTsconfigPath = path.resolve(fixturesPath, 'tsconfig.fixtures.json');

  if (!fs.existsSync(resolvedTsconfigPath)) {
    throw new Error(`specified tsconfig.json path does not exist: ${resolvedTsconfigPath}`);
  }

  // Parse and compile using TypeScript
  const configFileContent = readConfigFile(resolvedTsconfigPath, sys.readFile);

  if (configFileContent.error) {
    throw new Error(`Error reading tsconfig.json: ${configFileContent.error.messageText}`);
  }

  const config = parseJsonConfigFileContent(
    configFileContent.config,
    sys,
    path.dirname(resolvedTsconfigPath)
  );

  createProgram(config.fileNames, config.options).emit();

  // Define input and output directories
  const readFrom = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..', 'output');

  if (!fs.existsSync(readFrom)) {
    fs.mkdirSync(readFrom, { recursive: true });
  }

  const writeTo =
    (output && path.resolve(output)) ||
    path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'fixtures');

  if (!output && !fs.existsSync(writeTo)) {
    fs.mkdirSync(writeTo);
  }

  const imports = fs.readdirSync(readFrom).map(async (file) => {
    const filePath = path.join(readFrom, file);
    return import(filePath).then((module) => module.default);
  });

  const result = await Promise.all(imports).then((fixturesModules) =>
    fixturesModules.reduce<RegisterFixturesReturnType<never>>(
      (acc, fixtures) => ({ ...acc, [fixtures.operation]: fixtures.fixtures }),
      {} as RegisterFixturesReturnType<never>
    )
  );

  const tsFilePath = path.join(writeTo, 'index.ts');
  const tsContent = `export const Fixtures = ${JSON.stringify(result)};`;

  fs.writeFileSync(tsFilePath, tsContent, { encoding: 'utf-8' });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line import/no-extraneous-dependencies
  const preset = await import('@babel/preset-typescript');

  const { code } = transformSync(tsContent, {
    presets: [preset.default],
    filename: tsFilePath,
    sourceMaps: false,
  })!;

  fs.writeFileSync(tsFilePath, code!.slice(0, -1) + ' as const;', { encoding: 'utf-8' });

  // fs.readdirSync(readFrom).forEach((file) => {
  //   fs.unlinkSync(path.join(readFrom, file));
  // });
  //
  // fs.unlinkSync(path.resolve(writeTo, 'index.ts'));
}
