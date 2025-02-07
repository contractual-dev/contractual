import handlebars from 'handlebars';

const { create } = handlebars;

export function createHandlebars() {
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
