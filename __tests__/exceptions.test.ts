import {
  RequiredFieldException,
  InvalidFieldTypeException,
} from '../src/exceptions';

test('RequiredFieldException', () => {
  try {
    throw new RequiredFieldException('field', 'field requied');
  } catch (error) {
    if (error instanceof RequiredFieldException) {
      expect(error.field).toBe('field');
      expect(error.message).toBe('field requied');
    }
  }
});

test('InvalidFieldTypeException', () => {
  try {
    throw new InvalidFieldTypeException('field', 'invalid type');
  } catch (error) {
    if (error instanceof InvalidFieldTypeException) {
      expect(error.field).toBe('field');
      expect(error.message).toBe('invalid type');
    }
  }
});
