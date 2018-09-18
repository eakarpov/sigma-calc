function Field(name, type, body) {
    this.type = type;
    this.name= name;
    this.body = body;
}

function Method(name, type, ctx, body) {
    this.ctx = ctx;
    this.name = name;
    this.type = type;
    this.body = body;
}

function Lambda(args, body) {
    this.args = args;
    this.body = body;
}

function FieldUpdate(ctx, method, type, content) {
    this.ctx = ctx;
    this.method = method;
    this.type = type;
    this.content = content;
}

function MethodUpdate(ctx, name, type, _ctx, body) {
    this.ctx = ctx;
    this.method = name;
    this.type = type;
    this._ctx = _ctx;
    this.content = body;
}

function Function(arg1, operand, arg2) {
    this.arg1 = arg1;
    this.operand = operand;
    this.arg2 = arg2;
}

function Parameter(ctx, methodCall) {
    this.ctx = ctx;
    this.methodCall = methodCall;
}

function MethodCall(ctx, name, args) {
    this.name = name;
    this.ctx = ctx;
    this.args = args || [];
}

function ObjectType(properties) {
    this.properties = properties
}

function Sigma(objectType, calls) {
    this.objectType = objectType;
    this.calls = calls;
}

function Type(...args) {
    this.args = args;
}

function Expression(ctx, args) {
    this.args = args;
    this.ctx = ctx;
}

function Int(arg) {
    this.value = arg;
}

function Float(arg) {
    this.value = arg;
}

const lazy = function (creator) {
    let res;
    let processed = false;
    return function () {
        if (processed) return res;
        res = creator.apply(this, arguments);
        processed = true;
        return res;
    };
};

module.exports = {
  Field,
  FieldUpdate,
  MethodCall,
  Method,
  MethodUpdate,
  Float,
  Int,
  lazy,
  Expression,
  Type,
  Sigma,
  ObjectType,
  Lambda,
  Function,
  Parameter,
};