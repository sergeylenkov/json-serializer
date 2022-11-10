import 'reflect-metadata';
import {
  InvalidFieldTypeException,
  RequiredFieldException,
} from '../src/exceptions';
import { JsonSerializer } from '../src/serializer';
import testJson from './json/test.json';
import testJson2 from './json/test2.json';
import testJson3 from './json/test3.json';
import testJson4 from './json/test4.json';
import { Resource, TestClass, TestClass2, TestClass3, TestClass4 } from './classes';

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

test('Deserialize array of objects not requied', () => {
  let result = JsonSerializer.Deserialize<TestClass2>(TestClass2, testJson2);

  expect(result.resourcesNotRequied.length).toBe(0);

  result = JsonSerializer.Deserialize<TestClass2>(TestClass2, testJson4);

  expect(result.resourcesNotRequied.length).toBe(3);

  const testResource = result.resources[0];

  expect(testResource instanceof Resource).toBe(true);
  expect(testResource.name).toBe('test1');
});

test('Deserialize builder', () => {
  const result = JsonSerializer.Deserialize<TestClass3>(TestClass3, testJson3);

  expect(result.name).toBe('test');
});

test('Deserialize OnAfterDeserialize', () => {
  const result = JsonSerializer.Deserialize<TestClass4>(TestClass4, testJson3);

  expect(result.name).toBe('OnAfterDeserialize');
});