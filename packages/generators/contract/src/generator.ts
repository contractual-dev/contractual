import type SwaggerParser from '@apidevtools/swagger-parser';
import * as path from 'node:path';
import type { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import * as process from 'node:process';
import type { createProgram } from 'typescript';
import { ModuleKind, ModuleResolutionKind, ScriptTarget } from 'typescript';
import { createHandlebars } from './handlebars-helpers.js';
import type ora from 'ora';
import type * as fs from 'node:fs';
import type chalk from 'chalk';

export class SpinnerFactory {
  public constructor(private readonly spinner: typeof ora) {}

  public createSpinner(text: string) {
    return this.spinner(text);
  }
}

export class FileSystemHandler {
  public constructor(private readonly fileSystem: typeof fs) {}

  public exists(path: string): boolean {
    return this.fileSystem.existsSync(path);
  }

  public removeFile(path: string): void {
    this.fileSystem.rmSync(path);
  }
}

export class ContractFileGenerator {
  public constructor(
    private readonly spinnerFactory: SpinnerFactory,
    private readonly zodGenerator: typeof generateZodClientFromOpenAPI,
    private readonly programFactory: typeof createProgram,
    private readonly fileSystemHandler: FileSystemHandler
  ) {}

  public async generateFiles(openapiDocument: OpenAPIObject, destinationPath: string) {
    const spinner = this.spinnerFactory.createSpinner('Generating contract files..').start();
    const indexTsDestinationPath = path.resolve(destinationPath, 'index.ts');

    try {
      await this.zodGenerator({
        distPath: indexTsDestinationPath,
        openApiDoc: openapiDocument,
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

      spinner.succeed('Generated Contractual contract');
      return indexTsDestinationPath;
    } catch (error) {
      spinner.fail('Failed to generate contract files.');
      throw error;
    }
  }

  public async compileFiles(destinationPath: string) {
    const spinner = this.spinnerFactory.createSpinner('Compiling contract..').start();
    const indexTsDestinationPath = path.resolve(destinationPath, 'index.ts');

    try {
      this.programFactory([indexTsDestinationPath], {
        module: ModuleKind.ESNext,
        target: ScriptTarget.ESNext,
        skipLibCheck: true,
        declaration: true,
        noImplicitAny: true,
        moduleResolution: ModuleResolutionKind.Bundler,
        outDir: destinationPath,
      }).emit();

      spinner.succeed('Compilation completed successfully.');
      this.fileSystemHandler.removeFile(indexTsDestinationPath);
    } catch (error) {
      spinner.fail('Failed to compile contract.');
      throw error;
    }
  }
}

export class ContractCommandHandler {
  public constructor(
    private readonly spinnerFactory: SpinnerFactory,
    private readonly fileSystemHandler: FileSystemHandler,
    private readonly swaggerParser: typeof SwaggerParser,
    private readonly fileGenerator: ContractFileGenerator,
    private readonly logger: Console,
    private readonly chalker: typeof chalk,
    private readonly apiSpecPathToReadFrom: string
  ) {}

  public async handle() {
    try {
      if (!this.fileSystemHandler.exists(this.apiSpecPathToReadFrom)) {
        this.logError(
          'Could not find Contractual schema that is required for this command. You can provide it with `--spec` argument'
        );

        return;
      }

      this.logger.log(
        this.chalker.gray(`Contractual schema loaded from ${this.apiSpecPathToReadFrom}`)
      );

      const openapiDocument = await this.parseSpec(this.apiSpecPathToReadFrom);

      const destinationPath = path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        '../../..',
        'contract/contract'
      );

      await this.fileGenerator.generateFiles(openapiDocument, destinationPath);
      await this.fileGenerator.compileFiles(destinationPath);

      this.logger.log(this.chalker.green('Done'));
    } catch (error) {
      this.logError('Error occurred during contract generation.', error);
    }
  }

  private async parseSpec(apiSpecPath: string): Promise<OpenAPIObject> {
    const spinner = this.spinnerFactory.createSpinner('Parsing TypeSpec file..').start();

    return this.swaggerParser
      .parse(apiSpecPath)
      .then((document) => {
        if (!('openapi' in document)) {
          throw new Error('Invalid OpenAPI document: Missing "openapi" property.');
        }

        spinner.succeed('TypeSpec file parsed successfully.');

        return document as OpenAPIObject;
      })
      .catch((error) => {
        spinner.fail('Failed to parse TypeSpec file.');

        throw error instanceof Error ? new Error(error.message) : error;
      });
  }

  private logError(message: string, error?: unknown) {
    this.logger.log(`${this.chalker.red('Error')}: ${message}`);

    if (error) {
      this.logger.error('Error details:', error);
    }
  }
}
