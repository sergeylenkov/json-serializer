import { OnAfterDeserialize } from './serializer';

export function isOnAfterDeserialize(obj: any): obj is OnAfterDeserialize {
  if (!('OnAfterDeserialize' in obj)) {
    return false;
  }

  return typeof obj.OnAfterDeserialize === 'function';
}