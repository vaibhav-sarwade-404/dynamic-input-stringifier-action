const core = require("@actions/core");

const isString = object =>
  Object.prototype.toString.call(object) === "[object String]";

const isObject = object =>
  Object.prototype.toString.call(object) === "[object Object]";

const doesStringContainsOnlyCommasNoBrackets = string =>
  string.includes(",") && /^((?![\[\]\(\)\{\}]).)*$/g.test(string);

const transform = (schema, inputObj, retainCommasInValues = false) => {
  if (isObject(schema)) {
    let formattedObj = {};
    Object.keys(schema).forEach(schemaKey => {
      let value = schema[schemaKey];
      if (
        !retainCommasInValues &&
        doesStringContainsOnlyCommasNoBrackets(value)
      ) {
        value = value.replace(/\s/g).split(",");
      }
      if (isString(schemaKey)) {
        if (isString(value)) formattedObj[schemaKey] = inputObj[value];
        else if (Array.isArray(value)) {
          formattedObj[schemaKey] = value.map(_format =>
            transform(_format, inputObj, retainCommasInValues)
          );
        }
      } else {
        console.info(`${schemaKey} is not string`);
      }
    });
    return formattedObj;
  } else if (Array.isArray(schema)) {
    return schema.map(_format =>
      transform(_format, inputObj, retainCommasInValues)
    );
  } else if (isString(schema)) {
    let value = inputObj[schema];
    if (
      !retainCommasInValues &&
      doesStringContainsOnlyCommasNoBrackets(value)
    ) {
      return value.replace(/\s/g).split(",");
    }
    return value;
  } else return schema;
};

const stringify = input => {
  let stringifiedInput = "";
  if (isObject(input)) {
    stringifiedInput = `${stringifiedInput}{`;
    Object.keys(input).forEach((key, index) => {
      stringifiedInput = `${stringifiedInput}'${key}':${stringify(input[key])}`;
      if (Object.keys(input).length - 1 !== index) {
        stringifiedInput = `${stringifiedInput},`;
      }
    });
    stringifiedInput = `${stringifiedInput}}`;
  } else if (Array.isArray(input)) {
    stringifiedInput = `${stringifiedInput}[`;
    input.forEach((value, index) => {
      stringifiedInput = `${stringifiedInput}${stringify(value)}`;
      if (input.length - 1 !== index) {
        stringifiedInput = `${stringifiedInput},`;
      }
    });
    stringifiedInput = `${stringifiedInput}]`;
  } else {
    stringifiedInput = `'${input}'`;
  }

  return stringifiedInput;
};

try {
  const input = core.getInput("input");
  const inputToRatainCommas = core.getInput("inputToRatainCommas");
  const schema = core.getInput("schema", { require: true });
  let retainCommas = false;

  if (!input && !inputToRatainCommas) {
    throw new Error(
      `One of the input or inputToRatainCommas required and not supplied: ${JSON.stringify(
        input,
        inputToRatainCommas
      )}`
    );
  }

  const _schema = JSON.parse(schema);
  let _input = {};
  if (input) {
    _input = JSON.parse(input);
  } else {
    _input = JSON.parse(inputToRatainCommas);
    retainCommas = true;
  }
  const transfomedInput = transform(_schema, _input, retainCommas);
  core.info(`transformed input : ${transfomedInput}`);
  core.info(`stringified input : ${stringify(transfomedInput)}`);
  core.setOutput("stringified", stringify(transfomedInput));
} catch (error) {
  core.setFailed(
    `Action failed to transform input with error: ${error.message}`
  );
}
