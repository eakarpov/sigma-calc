export class Field {
  constructor(public name, public type, public body) {
  }
}

export class Method {
  constructor(public name, public type, public ctx, public body) {
  }
}

export class Lambda {
  constructor(public args, public body) {
  }
}

export class LambdaArg {
  constructor(public name, public type) {
  }
}

export class FieldUpdate {
  constructor(public ctx, public method, public type, public content) {
  }
}

export class MethodUpdate {
  constructor(public ctx, public method, public type, public _ctx, public content) {
  }
}

export class Function {
  constructor(public arg1, public operand, public arg2) {
  }
}

export class Parameter {
  constructor(public ctx, public methodCall?) {
  }
}

export class MethodCall {
  constructor(public ctx, public name, public args = []) {
  }
}

export class ObjectType {
  constructor(public properties?) {
  }
}

export class Sigma {
  constructor(public objectType, public calls) {
  }
}

export class Type {
  public args: any[];

  constructor(...args) {
    this.args = args;
  }
}

export class Expression {
  constructor(public ctx, public args) {
  }
}

export class Int {
  constructor(public value) {
  }
}

export class Float {
  constructor(public value) {
  }
}

export const lazy = function (creator) {
  let res;
  let processed = false;
  return function () {
    if (processed) return res;
    res = creator.apply(this, arguments);
    processed = true;
    return res;
  };
};