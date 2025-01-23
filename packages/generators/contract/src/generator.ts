import SwaggerParser from '@apidevtools/swagger-parser';
import * as path from 'node:path';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import * as process from 'node:process';
import {
  type CompilerOptions,
  createCompilerHost,
  createProgram,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} from 'typescript';
import { createHandlebars } from './handlebars-helpers.js';
import ora from 'ora';
import * as fs from 'node:fs';
import chalk from 'chalk';

export const generateContract = async () => {
  try {
    const apiSpecPathToReadFrom = path.resolve(
      process.cwd(),
      'contractual',
      'specs',
      'openapi-v1.0.0.yaml'
    );

    if (!fs.existsSync(apiSpecPathToReadFrom)) {
      console.log(
        `${chalk.red('Error')}: Could not find Contractual schema that is required for this command.` +
          ' You can provide it with `--spec` argument'
      );

      return;
    }

    const startTime = Date.now();

    console.log(chalk.gray(`Contractual schema loaded from ${apiSpecPathToReadFrom}`));

    const typespecSpinner = ora('Parsing TypeSpec file..').start();

    const openapiDocument = await SwaggerParser.parse(apiSpecPathToReadFrom);

    typespecSpinner.succeed('TypeSpec file parsed successfully.');

    const destinationPath = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      '../../..',
      'contract/contract'
    );

    const generationSpinner = ora('Generating contract files..').start();

    const indexTsDestinationPath = path.resolve(destinationPath, 'index.ts');

    await generateZodClientFromOpenAPI({
      distPath: indexTsDestinationPath,
      openApiDoc: openapiDocument as OpenAPIObject,
      templatePath: path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        '..',
        'contract.template.hbs'
      ),
      prettierConfig: {
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'always',
      },
      options: {
        additionalPropertiesDefaultValue: false,
        withAllResponses: true,
        withAlias: true,
        withDescription: false,
        withDefaultValues: false,
      },
      handlebars: createHandlebars(),
    });

    generationSpinner.succeed('Generated Contractual contract');

    const compileSpinner = ora('Generating contract files..').start();

    compileSpinner.start('Compiling contract..');

    const tsOptions: CompilerOptions = {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      skipLibCheck: true,
      declaration: true,
      noImplicitAny: true,
      moduleResolution: ModuleResolutionKind.Bundler,
      outDir: destinationPath,
    };

    const host = createCompilerHost(tsOptions);
    createProgram([indexTsDestinationPath], tsOptions, host).emit();

    compileSpinner.succeed('Compilation completed successfully.');

    const endTime = Date.now() - startTime;

    ora().succeed(`Done in ${endTime}ms`);

    fs.rmSync(indexTsDestinationPath);
  } catch (error) {
    console.error('Error details:', error);
  }
};
