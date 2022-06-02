import 'reflect-metadata';
import { JSONObject } from '../src/types';
import {
  InvalidFieldTypeException,
  RequiredFieldException,
} from '../src/exceptions';
import { JsonSerializer } from '../src/serializer';
import testJson from './json/test.json';
import testJson2 from './json/test2.json';
import testJson3 from './json/test3.json';
import { Resource, TestClass, TestClass2, TestClass3 } from './classes';

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
  expect(testResource.name).toBe('test1');
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
