# Dynamic input stringifier action

This is github action, which can take input as stringified object format, and transform it with required schema for workflow. Please note as of today github actions requires stringified version of array / sequence for matrix.

## Inputs

## `input`

- This is input to action which will take all values which needs ot be formatted in stringified flat object.
- Please note if object values contains commas `,` then it will be converted to array. Simplified for to feed to matrix. In case use case is to retains commas in values please use `inputToRatainCommas` input instead.
- This is required input if `inputToRatainCommas` is not provided. And this input parameter has priority over `inputToRatainCommas` in case both are provided

## `inputToRatainCommas`

- This is input to action which will take all values which needs ot be formatted in stringified flat object.
- Please note if object values contains commas `,` and use case is to retain values as it is in stringified output.
- This is required input if `input` is not provided. If it is used please don't provide `input` or else it will not work

## `schema`

- This is input to transform flat input object to object like schema.

## Outputs

## `stringified`

Output in required schema mentioned in input(`"schema"`)

## Example usage

**With input convert to array**

```
- name: Workflow input stringifier
  uses: vaibhav-sarwade-404/dynamic-input-stringifier-action@0.0.1
  with:
    input: '{ "OS" : "ubuntu-latest,windows-latest" , "NODE_VERSION" : "10,16" }'
    schema: '"OS"'
```

which will generate output as

```
    '["ubuntu-latest","windows-latest"]'
```

**With inputToRatainCommas convert to array**

```
- name: Workflow input stringifier
  uses: vaibhav-sarwade-404/dynamic-input-stringifier-action@0.0.1
  with:
    input: '{ "OS" : "ubuntu-latest,windows-latest" , "NODE_VERSION" : "10,16" }'
    schema: '"OS"'
```

which will generate output as

```
    "ubuntu-latest,windows-latest"
```

## License

ISC
