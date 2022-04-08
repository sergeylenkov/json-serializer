import 'reflect-metadata';
import {
  FIELD_META_DATA,
  REQUIRED_META_DATA,
  TYPE_META_DATA,
  CLASS_TYPE_META_DATA,
  BUILDER_TYPE_META_DATA,
  DEFAULT_VALUE_META_DATA,
} from './constants';

export type FieldType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'date'
  | 'array';

export interface JsonPropertyOptions {
  field?: string;
  required?: boolean;
  type?: FieldType;
  className?: any;
  defaultValue?: any;
  builder?: (value: any) => any;
}

export function JsonProperty(
  options?: JsonPropertyOptions | string
): PropertyDecorator {
  let field: string | undefined = undefined;
  let required: boolean | undefined = undefined;
  let type: any | undefined = undefined;
  let className: any | undefined = undefined;
  let builder: any | undefined = undefined;
  let defaultValue: any | undefined = undefined;

  if (typeof options === 'string') {
    field = options;
  } else if (typeof options === 'object') {
    field = options.field;
    required = options.required || false;
    type = options.type;
    className = options.className;
    defaultValue = options.defaultValue;
    builder = options.builder;
  }

  return (target: any, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(
      FIELD_META_DATA,
      field ? field : propertyKey,
      target,
      propertyKey
    );
    Reflect.defineMetadata(REQUIRED_META_DATA, required, target, propertyKey);
    type && Reflect.defineMetadata(TYPE_META_DATA, type, target, propertyKey);
    className &&
      Reflect.defineMetadata(
        CLASS_TYPE_META_DATA,
        className,
        target,
        propertyKey
      );
    builder &&
      Reflect.defineMetadata(
        BUILDER_TYPE_META_DATA,
        builder,
        target,
        propertyKey
      );
    defaultValue &&
      Reflect.defineMetadata(
        DEFAULT_VALUE_META_DATA,
        defaultValue,
        target,
        propertyKey
      );
  };
}
