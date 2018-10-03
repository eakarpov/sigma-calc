"use strict";
exports.__esModule = true;
var Field = /** @class */ (function () {
    function Field(name, type, body) {
        this.name = name;
        this.type = type;
        this.body = body;
    }
    return Field;
}());
exports.Field = Field;
var Method = /** @class */ (function () {
    function Method(name, type, ctx, body) {
        this.name = name;
        this.type = type;
        this.ctx = ctx;
        this.body = body;
    }
    return Method;
}());
exports.Method = Method;
var Lambda = /** @class */ (function () {
    function Lambda(args, body) {
        this.args = args;
        this.body = body;
    }
    return Lambda;
}());
exports.Lambda = Lambda;
var LambdaArg = /** @class */ (function () {
    function LambdaArg(name, type) {
        this.name = name;
        this.type = type;
    }
    return LambdaArg;
}());
exports.LambdaArg = LambdaArg;
var FieldUpdate = /** @class */ (function () {
    function FieldUpdate(ctx, method, type, content) {
        this.ctx = ctx;
        this.method = method;
        this.type = type;
        this.content = content;
    }
    return FieldUpdate;
}());
exports.FieldUpdate = FieldUpdate;
var MethodUpdate = /** @class */ (function () {
    function MethodUpdate(ctx, method, type, _ctx, content) {
        this.ctx = ctx;
        this.method = method;
        this.type = type;
        this._ctx = _ctx;
        this.content = content;
    }
    return MethodUpdate;
}());
exports.MethodUpdate = MethodUpdate;
var Function = /** @class */ (function () {
    function Function(arg1, operand, arg2) {
        this.arg1 = arg1;
        this.operand = operand;
        this.arg2 = arg2;
    }
    return Function;
}());
exports.Function = Function;
var Parameter = /** @class */ (function () {
    function Parameter(ctx, methodCall) {
        this.ctx = ctx;
        this.methodCall = methodCall;
    }
    return Parameter;
}());
exports.Parameter = Parameter;
var MethodCall = /** @class */ (function () {
    function MethodCall(ctx, name, args) {
        if (args === void 0) { args = []; }
        this.ctx = ctx;
        this.name = name;
        this.args = args;
    }
    return MethodCall;
}());
exports.MethodCall = MethodCall;
var ObjectType = /** @class */ (function () {
    function ObjectType(properties) {
        this.properties = properties;
    }
    return ObjectType;
}());
exports.ObjectType = ObjectType;
var Sigma = /** @class */ (function () {
    function Sigma(objectType, calls) {
        this.objectType = objectType;
        this.calls = calls;
    }
    return Sigma;
}());
exports.Sigma = Sigma;
var Type = /** @class */ (function () {
    function Type() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.args = args;
    }
    return Type;
}());
exports.Type = Type;
var Expression = /** @class */ (function () {
    function Expression(ctx, args) {
        this.ctx = ctx;
        this.args = args;
    }
    return Expression;
}());
exports.Expression = Expression;
var Int = /** @class */ (function () {
    function Int(value) {
        this.value = value;
    }
    return Int;
}());
exports.Int = Int;
var Float = /** @class */ (function () {
    function Float(value) {
        this.value = value;
    }
    return Float;
}());
exports.Float = Float;
exports.lazy = function (creator) {
    var res;
    var processed = false;
    return function () {
        if (processed)
            return res;
        res = creator.apply(this, arguments);
        processed = true;
        return res;
    };
};
