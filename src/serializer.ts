import 'reflect-metadata';
import { JSONObject } from './types';
import {
  BUILDER_TYPE_META_DATA,
  CLASS_TYPE_META_DATA,
  DEFAULT_VALUE_META_DATA,
  FIELD_META_DATA,
  REQUIRED_META_DATA,
  TYPE_META_DATA,
} from './constants';
import {
  InvalidFieldTypeException,
  RequiredFieldException,
} from './exceptions';
import { isOnAfterDeserialize } from './utils';

export interface OnAfterDeserialize {
  OnAfterDeserialize(): void;
}

export class JsonSerializer {
  static Create<Type>(c: { new (): Type }): Type {
    return new c();
  }

  static Serialize<T extends Object>(obj: T): JSONObject {
    const result: JSONObject = {};

    for (const key in obj) {
      const fieldName = Reflect.getMetadata(FIELD_META_DATA, obj, key);
      const fieldType = Reflect.getMetadata(TYPE_META_DATA, obj, key);
      const builder = Reflect.getMetadata(BUILDER_TYPE_META_DATA, obj, key);
      const className = Reflect.getMetadata(CLASS_TYPE_META_DATA, obj, key);
      const required = Reflect.getMetadata(REQUIRED_META_DATA, result, key);

      if (!fieldName) {
        break;
      }

      switch (fieldType) {
        case 'object': {
          if (obj[key] === undefined && !required) {
            break;
          }

          if (className) {
            result[fieldName] = JsonSerializer.Serialize<typeof className>(
              obj[key]
            );
          } else {
            result[fieldName] = obj[key];
          }

          break;
        }

        case 'date': {
          const value = obj[key] as unknown;

          if (value instanceof Date) {
            result[fieldName] = value.toISOString();
          }

          break;
        }

        case 'array': {
          if (Array.isArray(obj[key])) {
            const array = obj[key] as any;

            if (array.length === 0 && !required) {
              break;
            }

            if (className) {
              result[fieldName] = array.map((item: typeof className) => {
                return JsonSerializer.Serialize<typeof className>(item);
              });
            } else {
              result[fieldName] = array;
            }
          }

          break;
        }

        default: {
          result[fieldName] = obj[key];
          break;
        }
      }

      if (builder && typeof builder === 'function') {
        result[fieldName] = builder(result[fieldName]);
      }
    }

    return result;
  }

  static Deserialize<T extends Object>(type: any, obj: JSONObject): T {
    const result = JsonSerializer.Create<T>(type);

    for (const key in result) {
      const fieldName = Reflect.getMetadata(FIELD_META_DATA, result, key);
      const required = Reflect.getMetadata(REQUIRED_META_DATA, result, key);
      const fieldType = Reflect.getMetadata(TYPE_META_DATA, result, key);
      const className = Reflect.getMetadata(CLASS_TYPE_META_DATA, result, key);
      const builder = Reflect.getMetadata(BUILDER_TYPE_META_DATA, result, key);
      const defaultValue = Reflect.getMetadata(
        DEFAULT_VALUE_META_DATA,
        result,
        key
      );

      if (!fieldName) {
        continue;
      }

      if (required && obj[fieldName] === undefined) {
        throw new RequiredFieldException(key);
      }

      if (!required && obj[fieldName] === undefined) {
        if (defaultValue) {
          result[key] = defaultValue as any;
        }

        continue;
      }

      switch (fieldType) {
        case 'object': {
          try {
            if (className) {
              result[key] = JsonSerializer.Deserialize<typeof className>(
                className,
                obj[fieldName] as any
              );
            } else {
              result[key] = obj[fieldName] as any;
            }
          } catch (error) {
            throw new InvalidFieldTypeException(
              key,
              `Expected object but received ${obj[fieldName]}. ${error}`
            );
          }

          break;
        }

        case 'number': {
          const value = Number(obj[fieldName] as string);

          if (isNaN(value)) {
            throw new InvalidFieldTypeException(
              key,
              `Expected number but received ${value}`
            );
          } else {
            result[key] = value as any;
          }

          break;
        }

        case 'date': {
          const value = new Date(obj[fieldName] as string);

          if (isNaN(value.getTime())) {
            throw new InvalidFieldTypeException(
              key,
              `Expected date but received ${value}`
            );
          } else {
            result[key] = value as any;
          }

          break;
        }

        case 'boolean': {
          result[key] = Boolean(obj[fieldName]) as any;
          break;
        }

        case 'array': {
          if (Array.isArray(obj[fieldName])) {
            const array = obj[fieldName] as Array<JSONObject>;

            if (className) {
              result[key] = array.map((item: JSONObject) => {
                return JsonSerializer.Deserialize<typeof className>(
                  className,
                  item
                );
              }) as any;
            } else {
              result[key] = array as any;
            }
          } else {
            throw new InvalidFieldTypeException(
              key,
              `Expected array but received ${obj[fieldName]}`
            );
          }

          break;
        }

        default: {
          if (obj[fieldName] !== null && obj[fieldName] !== undefined) {
            result[key] = obj[fieldName] as any;
          } else if (defaultValue) {
            result[key] = defaultValue as any;
          }
          break;
        }
      }

      if (builder && typeof builder === 'function') {
        result[key] = builder(result[key]);
      }
    }

    if (isOnAfterDeserialize(result)) {
      result.OnAfterDeserialize();
    }

    return result;
  }
}