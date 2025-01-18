import SwaggerParser from '@apidevtools/swagger-parser';
import handlebars from 'handlebars';
import * as path from 'node:path';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import * as process from 'node:process';

const { create } = handlebars;

function createHandlebars() {
  const instance = create();
  instance.registerHelper('ifNotEmptyObj', function (obj, options) {
    if (typeof obj === 'object' && Object.keys(obj).length > 0) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  instance.registerHelper('toUpperCase', (input: string) => input.toUpperCase());

  instance.registerHelper('ifNotEq', function (a, b, options) {
    if (a !== b) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  instance.registerHelper('ifeq', function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  instance.registerHelper('includesType', function (arr, val, options) {
    if (Array.isArray(arr) && arr.length > 0 && arr.some((v) => v.type === val)) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  instance.registerHelper('toPlainWords', function (str) {
    return str.replace(/([A-Z])/g, ' $1').toLowerCase();
  });

  instance.registerHelper('toDashes', function (str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  });

  return instance;
}

export const generateContract = async () => {
  const doc = await SwaggerParser.parse(path.resolve(process.cwd(), 'contractual', 'specs', 'openapi-v1.1.0.yaml'));

  const writeToPath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../../..',
    'contract/contract',
    'index.ts'
  );

  await generateZodClientFromOpenAPI({
    distPath: writeToPath,
    openApiDoc: doc as OpenAPIObject,
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
};
