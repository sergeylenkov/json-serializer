import { JsonProperty } from '../../src/decorators';
import { OnAfterDeserialize } from '../../src/serializer';
import { JSONObject } from '../../src/types';

export class Resource {
  @JsonProperty()
  public id: number = 0;

  @JsonProperty()
  public name: string = '';
}

export class TestClass {
  @JsonProperty()
  public defaultField: string = '';

  @JsonProperty({ field: 'string_field', required: true })
  public textField: string = '';

  @JsonProperty('number_field')
  public numberField: number = 0;

  @JsonProperty({ field: 'object_field', required: true, type: 'object' })
  public objectField: JSONObject = {};

  @JsonProperty({ field: 'date_field', required: true, type: 'date' })
  public dateField: Date = new Date();

  @JsonProperty({ field: 'date_field', required: false, type: 'date' })
  public dateFieldOptional?: Date;

  @JsonProperty('bool_field')
  public boolField: boolean = true;

  @JsonProperty({ field: 'default_value_field', defaultValue: 'default value' })
  public defaultValueField: string = '';

  public notJsonField: string = 'not json field';

  constructor() {}
}

export class TestClass2 {
  @JsonProperty()
  public name: string = '';

  @JsonProperty({
    field: 'resources',
    required: true,
    type: 'array',
    className: Resource,
  })
  public resources: Resource[] = [];

  @JsonProperty({
    field: 'resource',
    type: 'object',
    className: Resource,
  })
  public resource: Resource = new Resource();

  @JsonProperty({
    field: 'resources_not_requied',
    required: false,
    type: 'array',
    className: Resource,
  })
  public resourcesNotRequied: Resource[] = [];
}

export class TestClass3 {
  @JsonProperty({ field: 'name', builder: (value: any) => value.trim() })
  public name: string = '';
}

export class TestClass4 implements OnAfterDeserialize {
  @JsonProperty({ field: 'name' })
  public name: string = '';

  public OnAfterDeserialize(): void {
    this.name = 'OnAfterDeserialize';
  }
}
