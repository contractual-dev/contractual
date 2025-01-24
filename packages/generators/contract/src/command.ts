import type ora from 'ora';
import { ContractCommandHandler, ContractFileGenerator, FileSystemHandler, SpinnerFactory } from './generator.js';
import * as fs from 'node:fs';
import SwaggerParser from '@apidevtools/swagger-parser';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import { createProgram } from 'typescript';
import type chalk from 'chalk';

export const createContractCommandHandler = (
  spinner: typeof ora,
  chalker: typeof chalk,
  logger: Console,
  apiSpecPath: string
) => {
  const spinnerFactory = new SpinnerFactory(spinner);

  const fileGenerator = new ContractFileGenerator(
    spinnerFactory,
    generateZodClientFromOpenAPI,
    createProgram,
    new FileSystemHandler(fs)
  );

  return new ContractCommandHandler(
    spinnerFactory,
    new FileSystemHandler(fs),
    SwaggerParser,
    fileGenerator,
    logger,
    chalker,
    apiSpecPath
  );
};
