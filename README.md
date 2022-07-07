# json-serializer
Typescript JSON serializer based on decorators

![build lib workflow](https://github.com/sergeylenkov/json-serializer/actions/workflows/github-actions.yml/badge.svg)
![npm](https://img.shields.io/npm/v/@serglenkov/json-serializer)

## How it works

Declare class

```
class SomeClass {
  @JsonProperty({ field: 'string_field', required: true })
  public textField: string = '';

  @JsonProperty('number_field')
  public numberField: number = 0;

  @JsonProperty({ field: 'object_field', required: true, type: 'object' })
  public objectField: JSONObject = {};

  @JsonProperty({ field: 'date_field', required: true, type: 'date' })
  public dateField: Date = new Date();
}
```

Deserialize class from json

```
 JsonSerializer.Deserialize<SomeClass>(SomeClass, someJson);
```

See tests for more examples