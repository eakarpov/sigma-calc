"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var objects_1 = require("./objects");
function findMethodByName(ctx, name) {
    if (ctx instanceof types_1.ObjectType) {
        for (var _i = 0, _a = ctx.properties; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (prop.name === name)
                return prop;
        }
    }
    else {
        for (var _b = 0, _c = Object.keys(ctx); _b < _c.length; _b++) {
            var ctxEl = _c[_b];
            if (ctx[ctxEl] instanceof types_1.ObjectType) {
                for (var _d = 0, _e = ctx[ctxEl].properties; _d < _e.length; _d++) {
                    var prop = _e[_d];
                    if (prop.name === name)
                        return prop;
                }
            }
            else {
                for (var _f = 0, _g = Object.keys(ctx[ctxEl]); _f < _g.length; _f++) {
                    var key = _g[_f];
                    if (ctx[ctxEl][key] instanceof types_1.ObjectType) {
                        return findMethodByName(ctx[ctxEl][key], name);
                    }
                    if (key === name)
                        return ctx[ctxEl][key];
                }
            }
        }
    }
}
function _findVariable(ctx, name) {
    if (ctx._args && ctx._args[name]) {
        if (ctx._args[name]._ctx) {
            return ctx._args[name][ctx._args[name]._ctx];
        }
        return ctx._args[name];
    }
    else {
        if (ctx instanceof types_1.ObjectType) {
            for (var _i = 0, _a = ctx.properties; _i < _a.length; _i++) {
                var prop = _a[_i];
                if (prop.name === name)
                    return prop;
            }
        }
        else {
            for (var _b = 0, _c = Object.keys(ctx); _b < _c.length; _b++) {
                var ctxEl = _c[_b];
                if (ctxEl === name)
                    return ctx[ctxEl];
            }
        }
    }
}
function findVariable(ctx, name) {
    var a = _findVariable(ctx, name);
    if (a)
        return a;
    throw new Error("variable " + name + " not found in the scope");
}
function findIndex(ctx, name) {
    for (var i = 0; i < ctx.properties.length; i++) {
        if (ctx.properties[i].name === name)
            return i;
    }
    return -1;
}
function d(ctx, body) {
    if (!body.methodCall) {
        if (body.ctx instanceof types_1.Int)
            return body.ctx;
        if (body.ctx instanceof types_1.Float)
            return body.ctx;
        return findVariable(ctx, body.ctx);
    }
    else {
        ctx._ctx = body.ctx;
        if (Array.isArray(body.methodCall)) {
            var result = evalExprArr({ args: body.methodCall, context: ctx });
            return result;
        }
        else {
            return evalMethodCall(ctx, body.methodCall);
        }
    }
}
function b(body) {
    // if (body._default) {
    //     body = body._default;
    // }
    if (body instanceof types_1.Int || body instanceof types_1.Float)
        return body.value;
    return body;
}
function evalFunction(ctx, body) {
    return eval(b(d(ctx, body.arg1)) + " " + body.operand + " " + b(d(ctx, body.arg2)));
}
function a(ctx, method) {
    if (method.content instanceof types_1.Parameter) {
        if (!method.content.methodCall) {
            var varble = ctx._args[method.content.ctx];
            if (varble._ctx) {
                varble = varble[varble._ctx];
            }
            return varble;
        }
        else {
            return evalMethodCall(ctx, method.content.methodCall);
        }
    }
    else if (method.content instanceof types_1.Lambda) {
        return attribution(ctx, method.content);
    }
    else {
        return evalBodyParse(ctx, method.content, void 0);
    }
}
function c(method, body) {
    if (method.type.args[method.type.args.length - 1] === 'Int')
        return new types_1.Int(body);
    if (method.type.args[method.type.args.length - 1] === 'Real')
        return new types_1.Float(body);
    return body;
}
function validateType(type, args) {
    for (var i = 0; i < type.length; i++) {
        if (type[i] !== args[i])
            throw new Error("type [" + args[i] + "] does not equal to [" + type[i] + "] type");
    }
}
function substitute(outer, ctx, name, newValue) {
    if (outer) {
        var index = findIndex(outer[ctx], name);
        outer[ctx].properties.splice(index, 1);
        outer[ctx].properties.push(newValue);
        return outer;
    }
    else {
        var index = findIndex(ctx[ctx._ctx], name);
        ctx[ctx._ctx].properties.splice(index, 1);
        ctx[ctx._ctx].properties.push(newValue);
        return ctx;
    }
}
function getCtx(ctx, method) {
    return (!method.ctx || typeof method.ctx === 'string') ? (ctx[method.ctx] || ctx) : method.ctx;
}
function clone(obj) {
    if (Array.isArray(obj)) {
        var res = [];
        for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
            var el = obj_1[_i];
            var elem = clone(el);
            res.push(elem);
        }
        return res;
    }
    else {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        var res = new obj.constructor();
        for (var _a = 0, _b = Object.keys(obj); _a < _b.length; _a++) {
            var key = _b[_a];
            var elem = clone(obj[key]);
            res[key] = elem;
        }
        return res;
    }
}
function addMethod(outer, ctx, name, newValue) {
    if (outer) {
        outer[ctx].properties.push(newValue);
        return outer;
    }
    else {
        ctx[ctx._ctx].properties.push(newValue);
        return ctx;
    }
}
function evalExprBody(ctx, method, args) {
    if (method instanceof types_1.Int)
        return method.value;
    if (method instanceof types_1.Float)
        return method.value;
    if (typeof method === 'string')
        return method;
    if (method instanceof types_1.FieldUpdate) {
        var context = getCtx(ctx, method);
        var newMethod = clone(method);
        var body = c(newMethod, b(a(clone(ctx), newMethod)));
        var mtd = findMethodByName(ctx, method.method);
        // if (!mtd) throw new Error(`Method ${method.method} not found error`);
        if (mtd) {
            validateType(mtd.type.args.slice().slice(0, mtd.type.args.length - 1), method.type.args);
            var field = new types_1.Field(method.method, method.type, body);
            validateType([mtd.type.args[mtd.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
            return substitute(method.ctx && ctx, method.ctx || context, method.method, field);
        }
        else {
            var field = new types_1.Field(method.method, method.type, body);
            return addMethod(method.ctx && ctx, method.ctx || context, method.method, field);
        }
    }
    if (method instanceof types_1.MethodUpdate) {
        var context = getCtx(ctx, method);
        var newContext = clone(context);
        var newMethod_1 = clone(method);
        // console.log(context);
        var bodyB = types_1.lazy(function () { return c(newMethod_1, b(a(clone(ctx), newMethod_1))); });
        var body = typeof method.ctx === 'string' ? bodyB() : bodyB;
        var mtd = findMethodByName(ctx, method.method);
        // if (!mtd) throw new Error(`Method ${method.method} not found error`);
        if (mtd) {
            validateType(mtd.type.args.slice().slice(0, mtd.type.args.length - 1), method.type.args);
            var method2 = new types_1.Method(method.method, method.type, (method.ctx === null || method.ctx === method._ctx) ? method.ctx : ctx._ctx, body);
            validateType([mtd.type.args[mtd.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
            return substitute(method.ctx && ctx, method.ctx || context, method.method, method2);
        }
        else {
            var method2 = new types_1.Method(method.method, method.type, (method.ctx === null || method.ctx === method._ctx) ? method.ctx : newContext, body);
            return addMethod(method.ctx && ctx, method.ctx || context, method.method, method2);
        }
    }
    if (method instanceof types_1.MethodCall) {
        return evalMethodCall(ctx, method);
    }
    if (method instanceof types_1.Expression) {
        return evalExpr(ctx, method, args);
    }
    if (method instanceof types_1.Function) {
        return evalFunction(ctx, method);
    }
    if (method instanceof types_1.Parameter) {
        var astra = b(d(ctx, method));
        if (typeof astra !== 'object') {
            return astra;
        }
        if (astra instanceof types_1.ObjectType) {
            ctx._ctx = '_default';
            ctx._default = astra;
            return ctx;
        }
        return astra;
        // return astra;
    }
}
function e(ctx, expr, args) {
    if (expr.ctx) {
        var res = evalExpr(ctx, expr.ctx, args);
        return res;
    }
    return void 0;
}
function evalExpr(ctx, expr, args) {
    return evalExprArr({ context: e(ctx, expr, args) || expr.ctx || ctx, args: expr.args, _args: args || [] });
}
function getFromArgs(args, mArg) {
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        if (arg.name === mArg.ctx)
            return true;
    }
    return false;
}
function attributeExpression(ctx, mtd, args) {
    var index = 0;
    for (var _i = 0, _a = mtd.args; _i < _a.length; _i++) {
        var arg = _a[_i];
        if (arg instanceof types_1.Parameter) {
            arg = evalExprBody(ctx, arg, void 0);
            if (!(arg instanceof types_1.ObjectType)) {
                arg = arg[arg._ctx];
            }
            mtd.args[index] = arg;
        }
        if (arg instanceof types_1.MethodCall) {
            // validate context
            for (var _b = 0, _c = arg.args; _b < _c.length; _b++) {
                var mArg = _c[_b];
                if (!getFromArgs(args, mArg)) {
                    if (mArg instanceof types_1.Parameter) {
                        // arg.args[index] = evalExprBody(ctx, mArg);
                        var res = evalExprBody(ctx, mArg, void 0);
                        arg.args[index] = res[res._ctx];
                    }
                }
            }
        }
        index++;
    }
    return mtd;
}
function attributeBody(ctx, body, args) {
    if (body instanceof types_1.Expression) {
        return attributeExpression(ctx, body, args);
    }
    return body;
}
function attribution(ctx, func) {
    var args = func.args;
    func.body = attributeBody(ctx, func.body, args);
    // something to do
    return func;
}
function evalBodyParse(ctx, method, args) {
    // console.log(method);
    if (method._default) {
        method = method._default;
    }
    if (method instanceof types_1.Int)
        return method.value;
    if (method instanceof types_1.Float)
        return method.value;
    if (typeof method === 'string')
        return method;
    if (method instanceof types_1.ObjectType) {
        var prop = Array.isArray(method.properties) && method.properties[0];
        if (ctx[prop.ctx]) {
            ctx[prop.ctx] = setCtx(ctx[prop.ctx], method);
            ctx._ctx = prop.ctx;
        }
        else {
            ctx[prop.ctx] = method;
            ctx._ctx = prop.ctx;
        }
        return ctx;
    }
    if (method instanceof types_1.Lambda) {
        if (args) {
            var argObj_1 = {};
            method.args.forEach(function (e, i) {
                var res = void 0;
                // if (args[i] instanceof Parameter) {
                //     res = evalExprBody(ctx, args[i], args);
                //     if (!(res instanceof ObjectType)) {
                //         res = res[res._ctx];
                //     }
                // } else {
                res = args[i];
                // }
                argObj_1[e.name] = res;
            });
            var res = evalBodyParse(__assign({}, ctx, { _args: __assign({}, ctx._args, argObj_1) }), method.body, void 0);
            // do not use
            // for (const arg of Object.keys(argObj)) {
            //     if (ctx._args[arg]) {
            //         delete ctx._args[arg];
            //     }
            // }
            return res;
        }
    }
    if (method instanceof types_1.Expression) {
        return evalExpr(ctx, method, args);
    }
    if (method instanceof types_1.Function) {
        return evalFunction(ctx, method);
    }
    if (typeof method === 'function') {
        return evalBodyParse(ctx, method(), args);
    }
}
function validateArgs(type, mtd) {
    var innerArgs = mtd.args.slice();
    // correlate each type arg with args array
    for (var _i = 0, type_1 = type; _i < type_1.length; _i++) {
        var t = type_1[_i];
        if (t === 'Obj')
            continue;
        if (t === 'Int') {
            var arg = innerArgs.pop();
            if (arg === void 0)
                throw new Error("not enough arguments for method " + mtd.name);
            if (!(arg instanceof types_1.Int || (parseInt(arg) === arg))) {
                throw new Error((arg.value || arg) + " is not of a required [" + t + "] type");
            }
        }
        if (t === 'Real') {
            var arg = innerArgs.pop();
            if (arg === void 0)
                throw new Error("not enough arguments for method " + mtd.name);
            if (!(arg instanceof types_1.Float || !isNaN(parseFloat(arg)))) {
                throw new Error((arg.value || arg) + " is not of a required [" + t + "] type");
            }
        }
    }
}
function f(ctx) {
    if (ctx.properties) {
        var a_1 = {};
        ctx.properties.forEach(function (e) {
            if (e instanceof types_1.Method) {
                a_1[e.ctx] = ctx;
            }
        });
        return a_1;
    }
    else {
        return ctx;
    }
}
function h(ctx, method) {
    // const contextName = method.ctx || ctx._ctx;
    var context = (!method.ctx || typeof method.ctx === 'string') ? (ctx.ctxObj[method.ctx] || ctx.ctxObj[ctx.ctxObj._ctx] || ctx) : method.ctx;
    var ctxVar = _findVariable(ctx, method.ctx || ctx.ctxObj._ctx);
    if (!ctxVar && ctx.ctxObj._ctx === '_default')
        return findMethodByName(ctx.ctxObj._default, method.name);
    var mtd = findMethodByName(ctxVar || context, method.name);
    if (mtd) {
        return mtd;
    }
    else {
        // return void 0;
        return findMethodByName(ctx, method.name);
    }
}
function evalMethodCall(ctx, mtd) {
    var _a;
    if (mtd.args) {
        var index = 0;
        for (var _i = 0, _b = mtd.args; _i < _b.length; _i++) {
            var arg = _b[_i];
            if (arg instanceof types_1.Parameter) {
                var nCtx = clone(ctx);
                arg = evalExprBody(nCtx, arg, void 0);
                if (!(arg instanceof types_1.ObjectType)) {
                    arg = arg[arg._ctx];
                }
                mtd.args[index] = arg;
            }
            index++;
        }
    }
    ctx.ctxObj._ctx = ctx.ctxObj._ctx === '_default' ? ctx.ctxObj._ctx : (mtd.ctx || ctx.ctxObj._ctx);
    var method = h(ctx, mtd);
    if (method) {
        var type = method.type.args;
        validateArgs(type.slice().slice(0, type.length - 1), mtd);
        var context = method.ctx
            ? typeof method.ctx === 'string'
                ? ctx[method.ctx]
                    ? ctx
                    // : ctx
                    // : !(ctx instanceof ObjectType)
                    //     ? ctx
                    : (_a = {}, _a[method.ctx] = ctx, _a)
                : __assign({}, ctx, f(method.ctx))
            : ctx;
        context._ctx = context._ctx === '_default' ? context._ctx : (mtd.ctx || method.ctx || context._ctx);
        var result = evalBodyParse(new Context(context, ctx.result), method.body, mtd.args);
        var checker = result;
        if (result.ctxObj._ctx === '_default') {
            checker = result._default;
        }
        var outputType = type[type.length - 1];
        validateArgs([outputType], { name: mtd.name, args: [checker] });
        return result;
    }
    else {
        var execCtx = ctx.ctxObj._args && ctx.ctxObj._args[mtd.ctx];
        if (execCtx) {
            switch (execCtx.__proto__) {
                case types_1.Lambda.prototype: return evalBodyParse(ctx, execCtx, mtd.args);
                default: throw new Error("Method " + mtd.name + " not found error");
            }
        }
    }
}
function g(ctx, call) {
    if (call instanceof types_1.MethodCall) {
        return evalMethodCall(ctx, call);
    }
    else if (call instanceof types_1.MethodUpdate) {
        return evalExprBody(ctx, call);
    }
    else {
        return evalExprBody(ctx, call);
    }
}
function setCtx() {
    var contexts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        contexts[_i] = arguments[_i];
    }
    var context = {};
    for (var _a = 0, contexts_1 = contexts; _a < contexts_1.length; _a++) {
        var el = contexts_1[_a];
        // // for scala not required
        // if (el instanceof ObjectType) {
        //     el.__proto__ = ObjectType;
        // }
        if (el instanceof types_1.ObjectType) {
            context = new types_1.ObjectType();
        }
        for (var _b = 0, _c = Object.keys(el); _b < _c.length; _b++) {
            var key = _c[_b];
            if (el[key] instanceof types_1.ObjectType) {
                context[key] = new types_1.ObjectType();
            }
            context[key] = el[key];
        }
    }
    return context;
}
// function evalExprArr(sigma, i = 0, newContext) {
//     const call = sigma.args[i];
//     // const next = evalExprBody({...sigma.context, ...newContext }, call, sigma._args);
//     const next = evalExprBody(setCtx(sigma.context, newContext || {}), call, sigma._args);
//     if (i < sigma.args.length - 1) {
//         const rew = evalExprArr(sigma, i + 1, next);
//         return rew;
//     }
//     return next;
// }
function evalExprArr(sigma) {
    var newContext;
    if (!sigma.args)
        return sigma.context;
    for (var i = 0; i < sigma.args.length; i++) {
        newContext = evalExprBody(setCtx(sigma.context, newContext || {}), sigma.args[i], sigma._args);
    }
    return newContext;
}
var Context = /** @class */ (function () {
    function Context(ctxObj, result) {
        if (result === void 0) { result = Number.MIN_VALUE; }
        this.ctxObj = ctxObj;
        this.result = result;
    }
    return Context;
}());
function evalMain(sigma) {
    if (sigma.objectType instanceof types_1.Sigma) {
        var context = evalMain(sigma.objectType);
        return g(context, sigma.calls);
    }
    else {
        return g(sigma.objectType, sigma.calls);
    }
}
// function evaluator(sigma) {
//     return evalExpr(sigma.objectType, sigma.calls);
// }
console.log(evalMain(objects_1.sigma));
console.log(evalMain(objects_1.sigma2));
console.log(evalMain(objects_1.sigma3));
console.log(evalMain(objects_1.sigma4));
// console.log(evalMain(sigma5));
