# json-serializer
Typescript JSON serializer based on decorators. It allows you to convert json to objects and back.

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

JsonProperty decorator properties

```
string - json field name

object - JsonPropertyOptions object
```

JsonPropertyOptions

```
field? - json field name, by default it is equal to object field name
required? - mark field as required, by default false
type? - type of json field, 'number' | 'string' | 'boolean' | 'object' | 'date' | 'array'
className? - class name for fields type 'object' | 'array';
defaultValue? - default field value
builder? - function to transform json field value
```

See tests for more examples