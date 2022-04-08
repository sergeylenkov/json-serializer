export class SerializationException {
  public field: string;
  public message: string;

  constructor(field: string, message = '') {
    this.field = field;
    this.message = message;
  }
}

export class RequiredFieldException extends SerializationException {}
export class InvalidFieldTypeException extends SerializationException {}
