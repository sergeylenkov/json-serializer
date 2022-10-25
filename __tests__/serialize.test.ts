import 'reflect-metadata';
import { JSONObject } from '../src/types';
import { JsonSerializer } from '../src/serializer';
import { Resource, TestClass, TestClass2 } from './classes';

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
