import 'reflect-metadata';
import { JsonProperty } from '../src/decorators';
import {
  BUILDER_TYPE_META_DATA,
  CLASS_TYPE_META_DATA,
  DEFAULT_VALUE_META_DATA,
  FIELD_META_DATA,
  REQUIRED_META_DATA,
  TYPE_META_DATA,
} from '../src/constants';

class TestClass {
  @JsonProperty({
    field: 'json_field',
    required: true,
    type: 'string',
    className: TestClass,
    builder: (value: string) => value,
    defaultValue: 'test',
  })
  public field = '';
}

test('JsonProperty', () => {
  const testClass = new TestClass();

  const fieldName = Reflect.getMetadata(FIELD_META_DATA, testClass, 'field');
  const required = Reflect.getMetadata(REQUIRED_META_DATA, testClass, 'field');
  const fieldType = Reflect.getMetadata(TYPE_META_DATA, testClass, 'field');
  const className = Reflect.getMetadata(
    CLASS_TYPE_META_DATA,
    testClass,
    'field'
  );
  const builder = Reflect.getMetadata(
    BUILDER_TYPE_META_DATA,
    testClass,
    'field'
  );
  const defaultValue = Reflect.getMetadata(
    DEFAULT_VALUE_META_DATA,
    testClass,
    'field'
  );

  expect(fieldName).toBe('json_field');
  expect(required).toBe(true);
  expect(fieldType).toBe('string');
  expect(className).toBe(TestClass);
  expect(typeof builder).toBe('function');
  expect(defaultValue).toBe('test');
});
