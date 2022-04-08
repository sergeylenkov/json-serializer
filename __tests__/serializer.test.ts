import 'reflect-metadata';
import { JsonProperty } from '../src/decorators';
import { JSONObject } from '../src/types';
import {
  InvalidFieldTypeException,
  RequiredFieldException,
} from '../src/exceptions';
import { JsonSerializer } from '../src/serializer';

const testJson = {
  defaultField: 'default',
  string_field: 'sample text',
  number_field: 12345,
  object_field: { a: 'b', c: 'd' },
  date_field: '2021-12-01T12:11:49.925Z',
  bool_field: false,
};

const resource = {
  id: 1,
  name: 'test',
};

const testJson2 = {
  name: 'test',
  resources: [resource, resource, resource],
  resource: resource,
};

const testJson3 = {
  name: '  test    ',
};

class TestClass {
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

  @JsonProperty('bool_field')
  public boolField: boolean = true;

  @JsonProperty({ field: 'default_value_field', defaultValue: 'default value' })
  public defaultValueField: string = '';

  public notJsonField: string = 'not json field';

  constructor() {}
}

class Resource {
  @JsonProperty()
  public id: number = 0;

  @JsonProperty()
  public name: string = '';
}

class TestClass2 {
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
}

class TestClass3 {
  @JsonProperty({ field: 'name', builder: (value: any) => value.trim() })
  public name: string = '';
}

test('Serialize', () => {
  const testClass = new TestClass();

  testClass.defaultField = 'default';
  testClass.textField = 'sample text';
  testClass.numberField = 12345;
  testClass.objectField = {
    a: 'b',
    c: 'd',
  };

  testClass.dateField = new Date('2021-12-01T12:11:49.925Z');

  const result = JsonSerializer.Serialize<TestClass>(testClass);

  expect(result['defaultField']).toBe('default');
  expect(result['string_field']).toBe('sample text');
  expect(result['number_field']).toBe(12345);
  expect(result['object_field']).toEqual({ a: 'b', c: 'd' });
  expect(result['date_field']).toBe('2021-12-01T12:11:49.925Z');
  expect(result['bool_field']).toBe(true);
});

test('Deserialize', () => {
  const result = JsonSerializer.Deserialize<TestClass>(TestClass, testJson);

  expect(result.defaultField).toBe('default');
  expect(result.textField).toBe('sample text');
  expect(result.numberField).toBe(12345);
  expect(typeof result.objectField).toBe('object');
  expect(result.dateField.toISOString()).toBe('2021-12-01T12:11:49.925Z');
  expect(result.boolField).toBe(false);
  expect(result.notJsonField).toBe('not json field');
  expect(result.defaultValueField).toBe('default value');
});

test('Deserialize required filed', () => {
  try {
    const result = JsonSerializer.Deserialize<TestClass>(TestClass, {});
  } catch (error) {
    expect(error instanceof RequiredFieldException).toBe(true);
  }
});

test('Deserialize invalid date', () => {
  try {
    const result = JsonSerializer.Deserialize<TestClass>(TestClass, {
      ...testJson,
      date_field: 'abc',
    });
  } catch (error) {
    expect(error instanceof InvalidFieldTypeException).toBe(true);
  }
});

test('Deserialize invalid date', () => {
  try {
    const result = JsonSerializer.Deserialize<TestClass>(TestClass, {
      ...testJson,
      object_field: 'abc',
    });
  } catch (error) {
    expect(error instanceof InvalidFieldTypeException).toBe(true);
  }
});

test('Deserialize invalid number', () => {
  try {
    const result = JsonSerializer.Deserialize<TestClass>(TestClass, {
      ...testJson,
      number_field: 'abc',
    });
  } catch (error) {
    expect(error instanceof InvalidFieldTypeException).toBe(true);
  }
});

test('Deserialize array of objects', () => {
  const result = JsonSerializer.Deserialize<TestClass2>(TestClass2, testJson2);

  expect(result.name).toBe('test');
  expect(result.resources.length).toBe(3);
  expect(result.resource instanceof Resource).toBe(true);

  const testResource = result.resources[0];

  expect(testResource instanceof Resource).toBe(true);
  expect(testResource.name).toBe('test');
});

test('Deserialize builder', () => {
  const result = JsonSerializer.Deserialize<TestClass3>(TestClass3, testJson3);

  expect(result.name).toBe('test');
});

test('Serialize array of objects', () => {
  const testClass = new TestClass2();
  const resource = new Resource();

  resource.id = 1;
  resource.name = 'test resource';

  testClass.name = 'test';
  testClass.resource = resource;
  testClass.resources = [resource, resource];

  const result = JsonSerializer.Serialize<TestClass2>(testClass);

  const jsonResources = result.resources as JSONObject[];
  const jsonResource = result.resource as JSONObject;

  expect(result.name).toBe('test');
  expect(jsonResources.length).toBe(2);
  expect(jsonResource.id).toBe(1);
});
